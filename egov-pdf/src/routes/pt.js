var express = require("express");
var router = express.Router();
var url = require("url");
var config = require("../config");

var {
  search_property,
  search_bill,
  search_payment,
  create_pdf,
} = require("../api");

const { asyncMiddleware } = require("../utils/asyncMiddleware");

function renderError(res, errorMessage) {
  res.render("error-message", { message: errorMessage });
}

/* GET users listing. */
router.post(
  "/ptmutationcertificate",
  asyncMiddleware(async function (req, res, next) {
    var tenantId = req.query.tenantId;
    var uuid = req.query.uuid;
    var requestinfo = req.body;
    if (requestinfo == undefined) {
      return renderError(res, "requestinfo can not be null");
    }
    if (!tenantId || !uuid) {
      return renderError(
        res,
        "tenantId and uuid are mandatory to generate the pass"
      );
    }

    try {
      try {
        resProperty = await search_property(uuid, tenantId, requestinfo);
      } catch (ex) {
        console.log(ex.stack);
        if (ex.response && ex.response.data) console.log(ex.response.data);
        return renderError(res, "Failed to query details of the property");
      }
      var properties = resProperty.data;

      if (
        properties &&
        properties.Properties &&
        properties.Properties.length > 0
      ) {
        var pdfResponse;
        var pdfkey = config.pdf.ptmutationcertificate_pdf_template;
        try {
          pdfResponse = await create_pdf(
            tenantId,
            pdfkey,
            properties,
            requestinfo
          );
        } catch (ex) {
          console.log(ex.stack);
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, "Failed to generate PDF for property");
        }

        var filename = `${pdfkey}_${new Date().getTime()}`;

        //pdfData = pdfResponse.data.read();
        res.writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${filename}.pdf`,
        });
        pdfResponse.data.pipe(res);
      } else {
        return renderError(res, "There is no property for you for this id");
      }
    } catch (ex) {
      console.log(ex.stack);
    }
  })
);

router.post(
  "/ptbill",
  asyncMiddleware(async function (req, res, next) {
    var tenantId = req.query.tenantId;
    var uuid = req.query.uuid;
    var requestinfo = req.body;
    if (requestinfo == undefined) {
      return renderError(res, "requestinfo can not be null");
    }
    if (!tenantId || !uuid) {
      return renderError(
        res,
        "tenantId and uuid are mandatory to generate the pass"
      );
    }
    try {
      try {
        resProperty = await search_property(uuid, tenantId, requestinfo);
      } catch (ex) {
        console.log(ex.stack);
        if (ex.response && ex.response.data) console.log(ex.response.data);
        return renderError(res, "Failed to query details of the property");
      }
      var properties = resProperty.data;
      if (
        properties &&
        properties.Properties &&
        properties.Properties.length > 0
      ) {
        var propertyid = properties.Properties[0].propertyId;
        var billresponse;
        try {
          billresponse = await search_bill(propertyid, tenantId, requestinfo);
        } catch (ex) {
          console.log(ex.stack);
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, `Failed to query bills for property`);
        }
        var bills = billresponse.data;
        if (bills && bills.Bills && bills.Bills.length > 0) {
          var pdfResponse;
          var pdfkey = config.pdf.ptbill_pdf_template;
          try {
            var billArray = { Bill: bills.Bills };
            pdfResponse = await create_pdf(
              tenantId,
              pdfkey,
              billArray,
              requestinfo
            );
          } catch (ex) {
            console.log(ex.stack);
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, "Failed to generate PDF for property");
          }

          var filename = `${pdfkey}_${new Date().getTime()}`;

          //pdfData = pdfResponse.data.read();
          res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${filename}.pdf`,
          });
          pdfResponse.data.pipe(res);
        } else {
          return renderError(res, "There is no bill for this id");
        }
      } else {
        return renderError(res, "There is no property for you for this id");
      }
    } catch (ex) {
      console.log(ex.stack);
    }
  })
);

router.post(
  "/ptreceipt",
  asyncMiddleware(async function (req, res, next) {
    var tenantId = req.query.tenantId;
    var uuid = req.query.uuid;
    var requestinfo = req.body;
    if (requestinfo == undefined) {
      return renderError(res, "requestinfo can not be null");
    }
    if (!tenantId || !uuid) {
      return renderError(
        res,
        "tenantId and uuid are mandatory to generate the pass"
      );
    }
    try {
      try {
        resProperty = await search_property(uuid, tenantId, requestinfo);
      } catch (ex) {
        console.log(ex.stack);
        if (ex.response && ex.response.data) console.log(ex.response.data);
        return renderError(res, "Failed to query details of the property");
      }
      var properties = resProperty.data;
      if (
        properties &&
        properties.Properties &&
        properties.Properties.length > 0
      ) {
        var propertyid = properties.Properties[0].propertyId;
        var paymentresponse;
        try {
          paymentresponse = await search_payment(
            propertyid,
            tenantId,
            requestinfo
          );
        } catch (ex) {
          console.log(ex.stack);
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, `Failed to query payment for property`);
        }
        var payments = paymentresponse.data;
        if (payments && payments.Payments && payments.Payments.length > 0) {
          var pdfResponse;
          var pdfkey = config.pdf.ptreceipt_pdf_template;
          try {
            pdfResponse = await create_pdf(
              tenantId,
              pdfkey,
              payments,
              requestinfo
            );
          } catch (ex) {
            console.log(ex.stack);
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, "Failed to generate PDF for property");
          }

          var filename = `${pdfkey}_${new Date().getTime()}`;

          //pdfData = pdfResponse.data.read();
          res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${filename}.pdf`,
          });
          pdfResponse.data.pipe(res);
        } else {
          return renderError(res, "There is no payment for this id");
        }
      } else {
        return renderError(res, "There is no property for you for this id");
      }
    } catch (ex) {
      console.log(ex.stack);
    }
  })
);

module.exports = router;
