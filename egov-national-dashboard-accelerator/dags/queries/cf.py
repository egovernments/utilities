
import logging

def extract_cf_total_no_of_citizen_responses_by_channel(metrics, region_bucket):
      serviceModule=[]
      serviceType=[]
      todaysNoOfCitizenResponses=[]
      group_by_channel=[]
      serviceModule_buckets=region_bucket.get('serviceModule').get('buckets')

      for serviceModule_bucket in serviceModule_buckets:
           serviceModule= serviceModule_bucket.get("key")
           logging.info(serviceModule)
           serviceType_buckets=serviceModule_bucket.get("serviceType").get('buckets')
           for serviceType_bucket in serviceType_buckets:
                serviceType=serviceType_bucket.get('key')
                logging.info(serviceType)
                channel_buckets=serviceType_bucket.get("channel").get('buckets')
                for channel_bucket in channel_buckets:
                     channel=channel_bucket.get('key')
                     logging.info(channel)
                     logging.info(channel_bucket)
                     value=channel_bucket.get('todaysNoOfCitizenResponsesForChannel').get('value')
                     group_by_channel.append({'name':channel.upper(),'value':value})
                todaysNoOfCitizenResponses.append({'name':"channel",value:group_by_channel})
                metrics['serviceModule']=serviceModule
                metrics['serviceType']=serviceType
                metrics['todaysNoOfCitizenResponses']=todaysNoOfCitizenResponses
                logging.info(todaysNoOfCitizenResponses)
                logging.info(metrics)


    return metrics
 
    # service_module_agg = region_bucket.get('serviceModule')
    # service_module_buckets = service_module_agg.get('buckets')

    # for service_module_bucket in service_module_buckets:
    #   metrics['']=



    # earlier channel based aggregation
    # channel_agg = region_bucket.get('channel')
    # channel_buckets = channel_agg.get('buckets')
    # grouped_by = []

    # for channel_bucket in channel_buckets:
    #   grouped_by.append({'name': channel_bucket.get('key'),'value': 
    #   channel_bucket.get('todaysNoOfCitizenResponses').get('value') if 
    #   channel_bucket.get('todaysNoOfCitizenResponses') else 0})

    # metrics['todaysNoOfCitizenResponses'] = [{'groupBy': 'channel', 'buckets': grouped_by}]
    # return metrics


cf_total_no_of_citizen_responses_by_channel = {'path': 'citizen-feedback/_search',
                          'name': 'cf_total_no_of_citizen_responses_by_channel',
                          'lambda': extract_cf_total_no_of_citizen_responses_by_channel,
                          'query': """
{{
  "size": 0,
  "query": {{
    "bool": {{
      "must": [
        {{
          "range": {{
            "Data.@timestamp": {{
                 "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }}
      ],
      "must_not": [
        {{
          "term": {{
            "Data.tenantId.keyword": "pb.testing"
          }}
        }}
      ]
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "Data.ward.name.keyword",
        "size": 10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "Data.tenantId.keyword",
            "size": 10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "Data.tenantData.city.districtName.keyword",
                "size": 10000
              }},
                "aggs": {{
                "serviceModule":{{
                  "terms": {{
                    "field": "Data.serviceModule.keyword",
                    "size": 10
                  }}
             , 
              "aggs": {{
                "serviceType":{{
                  "terms": {{
                    "field": "Data.serviceType.keyword",
                    "size": 10
                  }}
                
              ,"aggs": {{
                "channel": {{
                  "terms": {{
                    "field": "Data.channel.keyword",
                    "size": 10000
                  }},
                  "aggs": {{
                    "todaysNoOfCitizenResponsesForChannel": {{
                      "value_count": {{
                        "field": "Data.id.keyword"
                      }}
                    }}
                  }}
                }}
              }}
                }}
              }}
            }}
            }}
          }}
        }}
      }}
    }}
  }}
}}}}

"""
                          }

def extract_average_citizen_rating(metrics, region_bucket):
    metrics['todaysAverageCitizenRating'] = region_bucket.get('todaysAverageCitizenRating').get('value') if region_bucket.get('todaysAverageCitizenRating') else 0
    return metrics


average_citizen_rating = {'path': 'citizen-feedback/_search',
                             'name': 'average_citizen_rating',
                             'lambda': extract_average_citizen_rating,
                             'query':
                                 """
{{
  "size": 0,
  "query": {{
    "bool": {{
      "must": [
        {{
          "range": {{
            "Data.@timestamp": {{
              "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }}
      ],
      "must_not": [
        {{
          "term": {{
            "Data.tenantId.keyword": "pb.testing"
          }}
        }}
      ]
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "Data.ward.name.keyword",
        "size": 10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "Data.tenantId.keyword",
            "size": 10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "Data.tenantData.city.districtName.keyword",
                "size": 10000
              }},
              "aggs": {{
                "NoOfCitizenResponses": {{
                  "value_count": {{
                    "field": "Data.id.keyword"
                  }}
                }},
                "totalFeedbackScore": {{
                  "sum": {{
                    "field": "Data.rating"
                  }}
                }},
                "todaysAverageCitizenRating": {{
                  "bucket_script": {{
                    "buckets_path": {{
                      "closed": "NoOfCitizenResponses",
                      "total": "totalFeedbackScore"
                    }},
                    "script": "params.total / params.closed"
                  }}
                }}
              }}
            }}
          }}
        }}
      }}
    }}
  }}
}}
"""
                             }

cf_queries = [cf_total_no_of_citizen_responses_by_channel
               
              ]

#the default payload for CF
def empty_cf_payload(region, ulb, ward, date ):
    return {
        "date": date,
        "module": "CF",
        "ward": ward,
        "ulb": ulb,
        "region": region,
        "state": "Punjab",
        "metrics": {
           "todaysAverageCitizenRating": 0,
           "serviceModule": "",
            "serviceType": "",
            "todaysNoOfCitizenResponses": [
                {
                     "groupBy": "channel",
                     "buckets": [
                      
                        ]
                }
                      
                 ]
         }

       }
    

