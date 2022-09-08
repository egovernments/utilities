
from numpy import sinc
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.postgres_operator import PostgresOperator
from airflow.utils.dates import days_ago
from datetime import  datetime, timedelta, timezone
from hooks.elastic_hook import ElasticHook
from airflow.operators.http_operator import SimpleHttpOperator
import requests
from airflow.hooks.base import BaseHook
from queries.tl import *
from utils.utils import log
from pytz import timezone
from airflow.models import Variable
import logging
import json
from elasticsearch import Elasticsearch, helpers
from csv import reader
import uuid


default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'retries': 3,
    'retry_delay': timedelta(seconds=10),
    'start_date': datetime(2017, 1, 24)

}

module_map = {
    'TL' : (tl_queries, empty_tl_payload),
}


dag = DAG('national_dashboard_adaptor_TL', default_args=default_args, schedule_interval=None)
log_endpoint = 'kibana/api/console/proxy'
batch_size = 50

ulbs = {}
modules = {}
total_ulbs = 0
totalApplications = 0
totalApplicationWithinSLA = 0

def dump_kibana(**kwargs):
    hook = ElasticHook('GET', 'es_conn')
    module = kwargs['module']
    module_config = module_map.get(module)
    queries = module_config[0]
    date = kwargs['dag_run'].conf.get('date')
    localtz = timezone('Asia/Kolkata')
    dt_aware = localtz.localize(datetime.strptime(date, "%d-%m-%Y"))
    start = int(dt_aware.timestamp() * 1000)
    end = start + (24 * 60 * 60 * 1000) - 1000
    logging.info(start)
    logging.info(end)
    merged_document = {}

    for query in queries:
        q = query.get('query').format(start,end)
        logging.info(q)
        response = hook.search(query.get('path'),json.loads(q))
        merged_document[query.get('name')] = response
        logging.info(json.dumps(response))

    ward_list = transform_response_sample(merged_document, date, module)
    kwargs['ti'].xcom_push(key='payload_{0}'.format(module), value=json.dumps(ward_list))
    return json.dumps(ward_list)


def transform_response_sample(merged_document, date, module):
    module_config = module_map.get(module)
    queries = module_config[0]
    ward_map = {}
    ward_list = []
    for query in queries:
        single_document = merged_document[query.get('name')]
        single_document = single_document.get('aggregations')
        lambda_function = query.get('lambda')
        ward_map = transform_single(single_document, ward_map, date, lambda_function, module)
    ward_list = [ward_map[k] for k in ward_map.keys()]
    return ward_list

def get_key(ward, ulb):
    return '{0}|{1}'.format(ward, ulb)

def transform_single(single_document, ward_map, date, lambda_function, module):
    module_config = module_map.get(module)
    empty_lambda = module_config[1]
    ward_agg = single_document.get('ward')
    ward_buckets = ward_agg.get('buckets')
    for ward_bucket in ward_buckets:
        ward = ward_bucket.get('key')
        ulb_agg = ward_bucket.get('ulb')
        ulb_buckets = ulb_agg.get('buckets')
        for ulb_bucket in ulb_buckets:
            ulb = ulb_bucket.get('key')
            region_agg = ulb_bucket.get('region')
            region_buckets = region_agg.get('buckets')
            for region_bucket in region_buckets:
                region = region_bucket.get('key')
                if ward_map.get(get_key(ward,ulb)):
                    ward_payload = ward_map.get(get_key(ward,ulb))
                else:
                    ward_payload = empty_lambda(region, ulb, ward, date)
                metrics = ward_payload.get('metrics')
                metrics = lambda_function(metrics, region_bucket)
                ward_payload['metrics'] = metrics
                ward_map[get_key(ward, ulb)] = ward_payload
    return ward_map


def get_auth_token(connection):
    endpoint = 'user/oauth/token'
    url = '{0}://{1}/{2}'.format('https', connection.host, endpoint)
    data = {
        'grant_type' : 'password',
        'scope' : 'read',
        'username' : Variable.get('username'),
        'password' : Variable.get('password'),
        'tenantId' : Variable.get('tenantid'),
        'userType' : Variable.get('usertype')
    }

    r = requests.post(url, data=data, headers={'Authorization' : 'Basic {0}'.format(Variable.get('token')), 'Content-Type' : 'application/x-www-form-urlencoded'})
    response = r.json()
    logging.info(response)
    return (response.get('access_token'), response.get('refresh_token'), response.get('UserRequest'))


def call_ingest_api(connection, access_token, user_info, payload, module):
    endpoint = 'national-dashboard/metric/_ingest'
    url = '{0}://{1}/{2}'.format('https', connection.host, endpoint)
    data = {
        "RequestInfo": {
            "apiId": "asset-services",
            "ver": None,
            "ts": None,
            "action": None,
            "did": None,
            "key": None,
            "msgId": "search with from and to values",
            "authToken": access_token,
            "userInfo": user_info
        },
        "Data": payload

    }

    r = requests.post(url, data=json.dumps(data), headers={'Content-Type' : 'application/json'})
    response = r.json()
    logging.info(json.dumps(data))
    logging.info(response)

    q = {
        'timestamp' : 0,
        'module' : module,
        'severity' : 'Info',
        'state' : 'Punjab',
        'message' : json.dumps(response)
    }
    es = Elasticsearch(host = "elasticsearch-data-v1.es-cluster", port = 9200)
    actions = [
        {
            '_index':'adaptor_logs',
            '_type': '_doc',
            '_id': str(uuid.uuid1()),
            '_source': json.dumps(q),
        }
    ]
    helpers.bulk(es, actions)
    with open('/opt/airflow/dags/repo/egov-national-dashboard-accelerator/dags/water_and_meter.csv', 'r') as read_obj:
        # pass the file object to reader() to get the reader object
        csv_reader = reader(read_obj)
        # Iterate over each row in the csv using reader object
        for row in csv_reader:
            # row variable is a list that represents a row in csv
            actions = [
                {
                    '_index':'water_and_meter',
                    '_type': '_doc',
                    '_id': str(uuid.uuid1()),
                    '_source': row,
                }
            ]
            helpers.bulk(es, actions)
    return response



def load(**kwargs):
    connection = BaseHook.get_connection('digit-auth')
    (access_token, refresh_token, user_info) = get_auth_token(connection)
    module = kwargs['module']

    payload = kwargs['ti'].xcom_pull(key='payload_{0}'.format(module))
    logging.info(payload)
    payload_obj = json.loads(payload)
    logging.info("payload length {0} {1}".format(len(payload_obj),module))
    localtz = timezone('Asia/Kolkata')
    dt_aware = localtz.localize(datetime.strptime(kwargs['dag_run'].conf.get('date'), "%d-%m-%Y"))
    startdate = int(dt_aware.timestamp() * 1000)
    logging.info(startdate)
    if access_token and refresh_token:
        for i in range(0, len(payload_obj), batch_size):
            logging.info('calling ingest api for batch starting at {0} with batch size {1}'.format(i, batch_size))
            call_ingest_api(connection, access_token, user_info, payload_obj[i:i+batch_size], module)
    return None

def transform(**kwargs):
    logging.info('Your transformations go here')
    return 'Post Transformed Data'

def import_data():
    hook = ElasticHook('GET', 'es_conn')
    with open('/opt/airflow/dags/repo/egov-national-dashboard-accelerator/dags/water_and_meter.csv', 'r') as read_obj:
        # pass the file object to reader() to get the reader object
        csv_reader = reader(read_obj)
        # Iterate over each row in the csv using reader object
        for row in csv_reader:
            # row variable is a list that represents a row in csv
            logging.log(row)
            helpers.bulk(hook, json.dumps(row), index='water_and_meter')




extract_tl = PythonOperator(
    task_id='elastic_search_extract_tl',
    python_callable=dump_kibana,
    provide_context=True,
    do_xcom_push=True,
    op_kwargs={ 'module' : 'TL'},
    dag=dag)

transform_tl = PythonOperator(
    task_id='nudb_transform_tl',
    python_callable=transform,
    provide_context=True,
    dag=dag)

load_tl = PythonOperator(
    task_id='nudb_ingest_load_tl',
    python_callable=load,
    provide_context=True,
    op_kwargs={ 'module' : 'TL'},
    dag=dag)



extract_tl >> transform_tl >> load_tl