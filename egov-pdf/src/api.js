var config = require("./config");
var axios = require("axios").default;
var url = require("url");

auth_token = config.auth_token;

async function search_user(uuid, tenantId, requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.user, config.paths.user_search),
    data: {
      RequestInfo: requestinfo.RequestInfo,
      uuid: [uuid],
      tenantId: tenantId,
    },
  });
}

async function search_epass(uuid, tenantId, requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.epass, config.paths.epass_search),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      ids: uuid,
    },
  });
}

async function search_property(uuid, tenantId, requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.pt, config.paths.pt_search),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      uuids: uuid,
    },
  });
}

async function search_payment(consumerCodes, tenantId, requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.payments, config.paths.payment_search),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      consumerCodes: consumerCodes,
    },
  });
}

async function search_bill(consumerCode, tenantId, requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.bill, config.paths.bill_search),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      consumerCode: consumerCode,
    },
  });
}

async function search_tllicense(applicationNumber, tenantId, requestinfo) {
  console.log("requestinfo",JSON.stringify(requestinfo));
  console.log("url",url.resolve(config.host.tl, config.paths.tl_search));
  return await axios({
    method: "post",
    url: url.resolve(config.host.tl, config.paths.tl_search),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      applicationNumber: applicationNumber,
    },
  });
}

async function search_mdms(tenantId, module, master, requestinfo) {
  return await axios({
    method: "post",
    url: url.resolve(config.host.mdms, config.paths.mdms_search),
    data: requestinfo,
    params: {
      tenantId: tenantId,
      ids: uuid,
    },
  });
}

async function create_pdf(tenantId, key, data, requestinfo) {
  return await axios({
    responseType: "stream",
    method: "post",
    url: url.resolve(config.host.pdf, config.paths.pdf_create),
    data: Object.assign(requestinfo, data),
    params: {
      tenantId: tenantId,
      key: key,
    },
  });
}

module.exports = {
  create_pdf,
  search_epass,
  search_mdms,
  search_user,
  search_property,
  search_bill,
  search_payment,
  search_tllicense,
};
