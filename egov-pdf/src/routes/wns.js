var express = require("express");
var router = express.Router();
var url = require("url");
var config = require("../config");

var {
  search_water,
  search_sewerage,
  search_waterOpenSearch,
  search_sewerageOpenSearch,
  search_bill_genie_water_bills,
  search_bill_genie_sewerage_bills,
  search_billV2,
  search_payment,
  create_pdf
} = require("../api");

const { asyncMiddleware } = require("../utils/asyncMiddleware");

function renderError(res, errorMessage, errorCode) {
  if (errorCode == undefined) errorCode = 500;
  res.status(errorCode).send({ errorMessage });
}


router.post(
    "/wnsbill",
    asyncMiddleware(async function (req, res, next) {
      var tenantId = req.query.tenantId;
      var applicationNumber = req.query.applicationNumber;
      var bussinessService = req.query.bussinessService;
      var requestinfo = req.body;
      var restWns;
      if (requestinfo == undefined) {
        return renderError(res, "requestinfo can not be null");
      }
      if (!tenantId || !applicationNumber) {
        return renderError(
          res,
          "tenantId and applicationNumber are mandatory to generate the tlreceipt"
        );
      }
 
      try {
        try {
            if(bussinessService === 'WS' || bussinessService === 'WS.ONE_TIME_FEE'){
                restWns = await search_water(
                    applicationNumber,
                    tenantId,
                    requestinfo,
                    true
                  );
            }
            else{
                restWns = await search_sewerage(
                    applicationNumber,
                    tenantId,
                    requestinfo,
                    true
                  );
            }
          
        } catch (ex) {
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, "Failed to query details of water and sewerage application");
        }

        var connection = restWns.data;
 
        if (
            connection &&
            connection.WaterConnection &&
            connection.WaterConnection.length > 0
        ) {
          var consumerCode = bussinessService == "WS"? connection.WaterConnection[0].connectionNo : connection.WaterConnection[0].applicationNo;
          var billresponse;
          try {
            billresponse = await search_billV2(
              tenantId,
              consumerCode,
              bussinessService,
              requestinfo
            );
          } catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, `Failed to query bills for water application`);
          }
          
          var bills = billresponse.data;
          if (bills && bills.Bill && bills.Bill.length > 0) {
            var pdfResponse;
            var pdfkey = config.pdf.wns_bill;
            try {
              var billArray = { Bill: bills.Bill };
              pdfResponse = await create_pdf(
                tenantId,
                pdfkey,
                billArray,
                requestinfo
              );
            } catch (ex) {
              let errorMessage;
              if(bussinessService == 'WS')
                errorMessage = "Failed to generate PDF for water connection bill";
              if(bussinessService == 'WS.ONE_TIME_FEE')
                errorMessage = "Failed to generate PDF for water one time fees bill"; 

              if (ex.response && ex.response.data) console.log(ex.response.data);
              return renderError(
                res,
                errorMessage
              );
            }
            var filename = `${pdfkey}_${new Date().getTime()}`;
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename=${filename}.pdf`,
            });
            pdfResponse.data.pipe(res);
          } else {
            return renderError(res, "There is no bill for this application number");
          }
        }
        else if (
            connection &&
            connection.SewerageConnections &&
            connection.SewerageConnections.length > 0
        ) {
            var consumerCode = bussinessService == "SW"? connection.SewerageConnections[0].connectionNo : connection.SewerageConnections[0].applicationNo;
            var billresponse;
          try {
            billresponse = await search_billV2(
              tenantId,
              consumerCode,
              bussinessService,
              requestinfo
            );
          } catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, `Failed to query bills for sewerage application`);
          }
          
          var bills = billresponse.data;
          if (bills && bills.Bill && bills.Bill.length > 0) {
            var pdfResponse;
            var pdfkey = config.pdf.wns_bill;
            try {
              var billArray = { Bill: bills.Bill };
              pdfResponse = await create_pdf(
                tenantId,
                pdfkey,
                billArray,
                requestinfo
              );
            } catch (ex) {
              let errorMessage;
              if(bussinessService == 'SW')
                errorMessage = "Failed to generate PDF for sewerage connection bill";
              if(bussinessService == 'SW.ONE_TIME_FEE')
                errorMessage = "Failed to generate PDF for sewerage one time fees bill"; 

              if (ex.response && ex.response.data) console.log(ex.response.data);
              return renderError(
                res,
                errorMessage
              );
            }
            var filename = `${pdfkey}_${new Date().getTime()}`;
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename=${filename}.pdf`,
            });
            pdfResponse.data.pipe(res);
          } else {
            return renderError(res, "There is no bill for this application number");
          }
        }
        else {
          return renderError(
            res,
            "There is no water and sewerage applicaion for this applicationNumber"
          );
        }
      } catch (ex) {
        return renderError(res, `Failed to query bill for water and sewerage application`);
      }
    })
  );

  router.post(
    "/wnsreceipt",
    asyncMiddleware(async function (req, res, next) {
      var tenantId = req.query.tenantId;
      var applicationNumber = req.query.applicationNumber;
      var bussinessService = req.query.bussinessService;
      var requestinfo = req.body;
      var restWns;
      if (requestinfo == undefined) {
        return renderError(res, "requestinfo can not be null");
      }
      if (!tenantId || !applicationNumber) {
        return renderError(
          res,
          "tenantId and applicationNumber are mandatory to generate the tlreceipt"
        );
      }
 
      try {
        try {
            if(bussinessService === 'WS' || bussinessService === 'WS.ONE_TIME_FEE'){
                restWns = await search_water(
                    applicationNumber,
                    tenantId,
                    requestinfo,
                    false
                  );
            }
            else{
                restWns = await search_sewerage(
                    applicationNumber,
                    tenantId,
                    requestinfo,
                    false
                  );
            }
          
        } catch (ex) {
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, "Failed to query details of water and sewerage application");
        }
        var connection = restWns.data;
 
        if (
            connection &&
            connection.WaterConnection &&
            connection.WaterConnection.length > 0
        ) {
          var consumerCode = bussinessService == "WS"? connection.WaterConnection[0].connectionNo : connection.WaterConnection[0].applicationNo;
          var paymentresponse;
          try {
            paymentresponse = await search_payment(
                consumerCode,
                tenantId,
                requestinfo,
                bussinessService
              );
          } catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, `Failed to query receipt for water application`);
          }
          
          var payments = paymentresponse.data;
          if (payments && payments.Payments && payments.Payments.length > 0) {
            var pdfResponse;
            var pdfkey = config.pdf.wns_one_time_receipt;
            try {
              pdfResponse = await create_pdf(
                tenantId,
                pdfkey,
                payments,
                requestinfo
              );
            } catch (ex) {
              let errorMessage;
              if(bussinessService == 'WS')
                errorMessage = "Failed to generate PDF for water connection receipt";
              if(bussinessService == 'WS.ONE_TIME_FEE')
                errorMessage = "Failed to generate PDF for water one time fees receipt"; 

              if (ex.response && ex.response.data) console.log(ex.response.data);
              return renderError(
                res,
                errorMessage
              );
            }
            var filename = `${pdfkey}_${new Date().getTime()}`;
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename=${filename}.pdf`,
            });
            pdfResponse.data.pipe(res);
          } else {
            return renderError(res, "There is no receipt for this application number");
          }
        }
        else if (
            connection &&
            connection.SewerageConnections &&
            connection.SewerageConnections.length > 0
        ) {
            var consumerCode = bussinessService == "SW"? connection.SewerageConnections[0].connectionNo : connection.SewerageConnections[0].applicationNo;
            var paymentresponse;
          try {
            paymentresponse = await search_payment(
                consumerCode,
                tenantId,
                requestinfo,
                bussinessService
              );
          } catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, `Failed to query receipt for sewerage application`);
          }
          
          var payments = paymentresponse.data;
          if (payments && payments.Payments && payments.Payments.length > 0) {
            var pdfResponse;
            var pdfkey = config.pdf.wns_one_time_receipt;
            try {
              pdfResponse = await create_pdf(
                tenantId,
                pdfkey,
                payments,
                requestinfo
              );
            } catch (ex) {
              let errorMessage;
              if(bussinessService == 'SW')
                errorMessage = "Failed to generate PDF for sewerage connection receipt";
              if(bussinessService == 'SW.ONE_TIME_FEE')
                errorMessage = "Failed to generate PDF for sewerage one time fees receipt"; 

              if (ex.response && ex.response.data) console.log(ex.response.data);
              return renderError(
                res,
                errorMessage
              );
            }
            var filename = `${pdfkey}_${new Date().getTime()}`;
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename=${filename}.pdf`,
            });
            pdfResponse.data.pipe(res);
          } else {
            return renderError(res, "There is no receipt for this application number");
          }
        }
        else {
          return renderError(
            res,
            "There is no water and sewerage applicaion for this applicationNumber"
          );
        }
      } catch (ex) {
        return renderError(res, `Failed to query receipt for water and sewerage application`);
      }
    })
  );  

  router.post(
    "/wnsgroupbill",
    asyncMiddleware(async function (req, res, next) {
      var tenantId = req.query.tenantId;
      var locality = req.query.locality;
      var bussinessService = req.query.bussinessService;
      var isConsolidated = (req.query.isConsolidated != undefined && req.query.isConsolidated.toLowerCase() === 'true' ? true : false)
      var consumerCode = null;
      if(req.query.consumerCode)
        consumerCode = req.query.consumerCode;
      var requestinfo = req.body;
      var restWater,restSewerage;
      var waterBills, sewerageBills;
      var consolidatedResult = {Bill:[]};
      var propertyIdSet = [];
      if (requestinfo == undefined) {
        return renderError(res, "requestinfo can not be null");
      }
      if (!tenantId || !locality || !bussinessService) {
        return renderError(
          res,
          "Bussiness Service, TenantId and Locality are mandatory to generate the water and sewerage bill"
        );
      } 
           
      try {

        if(isConsolidated){
          try{
           
            var searchCriteria = {searchCriteria :{locality: locality, tenantId: tenantId,connectionno: consumerCode}};

            restWater = await search_waterOpenSearch(
              searchCriteria,
              requestinfo
            );
  
            restWater = restWater.data.WaterConnection;
            if(restWater.length>0){
              for(let water of restWater){
                if(!propertyIdSet.includes(water.property_id))
                  propertyIdSet.push(water.property_id);
              }
            }

  
            restSewerage = await search_sewerageOpenSearch(
              searchCriteria,
              requestinfo
            );
  
            restSewerage = restSewerage.data.SewerageConnections;
            if(restSewerage.length>0){
              for(let sewerage of restSewerage){
                if(!propertyIdSet.includes(sewerage.property_id))
                  propertyIdSet.push(sewerage.property_id);
              }   
            }
  
          }
          catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, "Failed to query details of water and sewerage connection");
          }
  
          try{
            var inputData = {searchCriteria :{locality: locality, tenantId: tenantId, propertyId: propertyIdSet}};

            waterBills = await search_bill_genie_water_bills(
              inputData,
              requestinfo
            );
            waterBills = waterBills.data.Bills;
  
            sewerageBills = await search_bill_genie_sewerage_bills(
              inputData,
              requestinfo
            );
            sewerageBills = sewerageBills.data.Bills;
  
            if(waterBills.length>0){
              for(let waterBill of waterBills){
                if(waterBill.status ==='EXPIRED'){
                  var billresponse = await search_billV2(
                  tenantId, waterBill.consumerCode,
                  waterBill.businessService, requestinfo);
                
                  consolidatedResult.Bill.push(billresponse.data.Bill);
                }
                else{
                  consolidatedResult.Bill.push(waterBill);
                }
              }
            }
  
            if(sewerageBills.length>0){
              for(let sewerageBill of sewerageBills){
                if(sewerageBill.status ==='EXPIRED'){
                  var billresponse = await search_billV2(
                  tenantId, sewerageBill.consumerCode,
                  sewerageBill.businessService, requestinfo);
                
                  consolidatedResult.Bill.push(billresponse.data.Bill);
                }
                else{
                  consolidatedResult.Bill.push(sewerageBill);
                }
              }
            }
  
          }
          catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, `Failed to query bills for water and sewerage connection`);
          }
  
  
        }

        else if(!isConsolidated && bussinessService == 'WS'){

          //get property ids
          try{
            var searchCriteria = {searchCriteria :{locality: locality, tenantId: tenantId,connectionno: consumerCode}};

            restWater = await search_waterOpenSearch(
              searchCriteria,
              requestinfo
            );

            restWater = restWater.data.WaterConnection;
            if(restWater.length>0){
              for(let water of restWater){
                if(!propertyIdSet.includes(water.property_id))
                  propertyIdSet.push(water.property_id);
              }
            }

          }
          catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, "Failed to query details of water connection");
          }
          
          //get water bills for the property ids
          try{

            var inputData = {searchCriteria :{locality: locality, tenantId: tenantId, propertyId: propertyIdSet}};
            waterBills = await search_bill_genie_water_bills(
              inputData,
              requestinfo
            );
  
            waterBills = waterBills.data.Bills;
            if(waterBills.length>0){
              for(let waterBill of waterBills){
                if(waterBill.status ==='EXPIRED'){
                  var billresponse = await search_billV2(
                  tenantId, waterBill.consumerCode,
                  waterBill.businessService, requestinfo);
                
                  consolidatedResult.Bill.push(billresponse.data.Bill);
                }
                else{
                  consolidatedResult.Bill.push(waterBill);
                }
              }
            }
          }
          catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, `Failed to query bills for water connection`);
          }
        }
  
        else if(!isConsolidated && bussinessService == 'SW'){

          try{
           
            var searchCriteria = {searchCriteria :{locality: locality, tenantId: tenantId,connectionno: consumerCode}};
  
            restSewerage = await search_sewerageOpenSearch(
              searchCriteria,
              requestinfo
            );
  
            restSewerage = restSewerage.data.SewerageConnections;
            if(restSewerage.length>0){
              for(let sewerage of restSewerage){
                if(!propertyIdSet.includes(sewerage.property_id))
                  propertyIdSet.push(sewerage.property_id);
              }   
            }
  
          }
          catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, "Failed to query details of sewerage connection");
          }
  
          try{
            var inputData = {searchCriteria :{locality: locality, tenantId: tenantId, propertyId: propertyIdSet}};
  
            sewerageBills = await search_bill_genie_sewerage_bills(
              inputData,
              requestinfo
            );
            sewerageBills = sewerageBills.data.Bills;
  
            if(sewerageBills.length>0){
              for(let sewerageBill of sewerageBills){
                if(sewerageBill.status ==='EXPIRED'){
                  var billresponse = await search_billV2(
                  tenantId, sewerageBill.consumerCode,
                  sewerageBill.businessService, requestinfo);
                
                  consolidatedResult.Bill.push(billresponse.data.Bill);
                }
                else{
                  consolidatedResult.Bill.push(sewerageBill);
                }
              }
            }
  
          }
          catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, `Failed to query bills for sewerage connection`);
          }
  
        }

        else{
          return renderError(res, "There is no billfound for the criteria");
        }
  
        if (consolidatedResult && consolidatedResult.Bill && consolidatedResult.Bill.length > 0) {
          var pdfResponse;
          var pdfkey = config.pdf.wns_bill;
          try {
            var billArray = { Bill: consolidatedResult.Bill };
            pdfResponse = await create_pdf(
              tenantId,
              pdfkey,
              billArray,
              requestinfo
            );
          } catch (ex) {
            let errorMessage= "Failed to generate PDF"; 
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(
              res,
              errorMessage
            );
          }
          var filename = `${pdfkey}_${new Date().getTime()}`;
          res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${filename}.pdf`,
          });
          pdfResponse.data.pipe(res);
        } else {
          return renderError(res, "There is no billfound for the criteria");
        }
        
      } catch (ex) {
        return renderError(res, `Failed to query bill for water and sewerage application`);
      }

    })
  );


module.exports = router;
