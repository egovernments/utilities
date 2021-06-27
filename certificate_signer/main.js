const {Kafka} = require('kafkajs');
const config = require('./config/config');
const signer = require('./signer');
const {publicKeyPem, privateKeyPem} = require('./config/keys');
const R = require('ramda');
const INPROGRESS_KEY_EXPIRY_SECS = 5 * 60;
const CERTIFICATE_INPROGRESS = "P";
const REGISTRY_SUCCESS_STATUS = "SUCCESSFUL";
const REGISTRY_FAILED_STATUS = "UNSUCCESSFUL";
/*
(async function signData(data) {
  //await consumer.connect();
  //await producer.connect();
  //await consumer.subscribe({topic: config.CERTIFY_TOPIC, fromBeginning: true});

  //await consumer.run({
    //eachMessage: async ({topic, partition, message}) => {
      //console.time("certify");
      //console.log({
        //value: message.value.toString(),
        //uploadId: message.headers.uploadId ? message.headers.uploadId.toString():'',
        //rowId: message.headers.rowId ? message.headers.rowId.toString():'',
      //});
      let jsonMessage = data;
      try {
        console.log("Message received: " + jsonMessage);
        if (!false) {
          await signer.signAndSave(jsonMessage);
        }
      } catch (e) {
        // const preEnrollmentCode = R.pathOr("", ["preEnrollmentCode"], jsonMessage);
        // const currentDose = R.pathOr("", ["vaccination", "dose"], jsonMessage);
        // if (preEnrollmentCode !== "" && currentDose !== "") {
        //   redis.deleteKey(`${preEnrollmentCode}-${currentDose}`) //if retry fails it clears the key -
        // }
        console.error("ERROR: " + e.message);
      }
    }
//  })
)();
/*
async function sendCertifyAck(status, uploadId, rowId, errMsg="") {
  if (config.ENABLE_CERTIFY_ACKNOWLEDGEMENT) {
    if (status === REGISTRY_SUCCESS_STATUS) {
      producer.send({
        topic: 'certify_ack',
        messages: [{
          key: null,
          value: JSON.stringify({
            uploadId: uploadId,
            rowId: rowId,
            status: 'SUCCESS',
            errorMsg: ''
          })}]})
    } else if (status === REGISTRY_FAILED_STATUS) {
      producer.send({
        topic: 'certify_ack',
        messages: [{
          key: null,
          value: JSON.stringify({
            uploadId: uploadId,
            rowId: rowId,
            status: 'FAILED',
            errorMsg: errMsg
          })}]})
    }
  }
}

*/
