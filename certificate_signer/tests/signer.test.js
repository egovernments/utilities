const {signJSON, transformW3, customLoader} = require('../signer');
const jsigs = require('jsonld-signatures');
const {RSAKeyPair} = require('crypto-ld');
const {RsaSignature2018} = jsigs.suites;

const cert2 = {
                  "RequestInfo": {
                      "apiId": "Rainmaker",
                      "ver": ".01",
                      "action": "_get",
                      "did": "1",
                      "key": "",
                      "msgId": "20170310130900|en_IN",
                      "requesterId": "",
                      "authToken": "412250b1-955c-417a-9b1e-9a027be7a612",
                      "userInfo": {
                          "id": 24226,
                          "uuid": "40dceade-992d-4a8f-8243-19dda76a4171",
                          "userName": "amr001",
                          "name": "leela",
                          "mobileNumber": "9814424443",
                          "emailId": "leela@llgmail.com",
                          "locale": null,
                          "type": "EMPLOYEE",
                          "roles": [
                              {
                                  "name": "CSC Collection Operator",
                                  "code": "CSC_COLL_OPERATOR",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "Employee",
                                  "code": "EMPLOYEE",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "NoC counter employee",
                                  "code": "NOC_CEMP",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "TL Counter Employee",
                                  "code": "TL_CEMP",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "Anonymous User",
                                  "code": "ANONYMOUS",
                                  "tenantId": "pb"
                              },
                              {
                                  "name": "TL Field Inspector",
                                  "code": "TL_FIELD_INSPECTOR",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "TL Creator",
                                  "code": "TL_CREATOR",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "NoC counter Approver",
                                  "code": "NOC_APPROVER",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "TL Approver",
                                  "code": "TL_APPROVER",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "Super User",
                                  "code": "SUPERUSER",
                                  "tenantId": "pb"
                              },
                              {
                                  "name": "BPA Services Approver",
                                  "code": "BPA_APPROVER",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "Field Employee",
                                  "code": "FEMP",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "Counter Employee",
                                  "code": "CEMP",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "NoC Field Inpector",
                                  "code": "NOC_FIELD_INSPECTOR",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "Super User",
                                  "code": "SUPERUSER",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "Grievance Officer",
                                  "code": "GO",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "NoC Doc Verifier",
                                  "code": "NOC_DOC_VERIFIER",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "Collection Operator",
                                  "code": "COLL_OPERATOR",
                                  "tenantId": "pb.amritsar"
                              },
                              {
                                  "name": "TL doc verifier",
                                  "code": "TL_DOC_VERIFIER",
                                  "tenantId": "pb.amritsar"
                              }
                          ],
                          "active": true,
                          "tenantId": "pb.amritsar"
                      },
                      "responseType": "arraybuffer"
                  },
                  "Licenses": [
                      {
                          "comment": null,
                          "id": "10743831-a30a-4cb3-b3c7-234f8784cb99",
                          "tenantId": "pb.amritsar",
                          "businessService": "TL",
                          "licenseType": "PERMANENT",
                          "applicationType": "NEW",
                          "workflowCode": "NewTL",
                          "licenseNumber": "PB-TL-2021-06-10-001673",
                          "applicationNumber": "PB-TL-2021-06-10-010743",
                          "oldLicenseNumber": null,
                          "propertyId": null,
                          "oldPropertyId": null,
                          "accountId": null,
                          "tradeName": "xyz",
                          "applicationDate": 1623305896492,
                          "commencementDate": 1591813799000,
                          "issuedDate": 1623316797128,
                          "financialYear": "2020-21",
                          "validFrom": 1585679399000,
                          "validTo": 1617172199000,
                          "action": "PAY",
                          "assignee": [],
                          "wfDocuments": null,
                          "status": "APPROVED",
                          "tradeLicenseDetail": {
                              "id": "d3988a4d-233a-4926-b459-6f6e4245c8c2",
                              "surveyNo": null,
                              "subOwnerShipCategory": "INDIVIDUAL.SINGLEOWNER",
                              "structureType": "IMMOVABLE.KUTCHA",
                              "operationalArea": null,
                              "noOfEmployees": null,
                              "adhocExemption": null,
                              "adhocPenalty": null,
                              "adhocExemptionReason": null,
                              "adhocPenaltyReason": null,
                              "owners": [
                                  {
                                      "id": 26354,
                                      "uuid": "d1909e78-f451-46d0-b3cb-3c3bb60604ba",
                                      "userName": "33819b3e-34ae-4247-b4ea-2e4637dbe510",
                                      "password": null,
                                      "salutation": null,
                                      "name": "ganesh",
                                      "gender": "MALE",
                                      "mobileNumber": "8208110238",
                                      "emailId": null,
                                      "altContactNumber": null,
                                      "pan": null,
                                      "aadhaarNumber": null,
                                      "permanentAddress": "xyz house number",
                                      "permanentCity": null,
                                      "permanentPinCode": null,
                                      "correspondenceCity": null,
                                      "correspondencePinCode": null,
                                      "correspondenceAddress": null,
                                      "active": true,
                                      "dob": 360959400000,
                                      "pwdExpiryDate": 1631081896000,
                                      "locale": null,
                                      "type": "CITIZEN",
                                      "signature": null,
                                      "accountLocked": false,
                                      "roles": [
                                          {
                                              "id": null,
                                              "name": "Citizen",
                                              "code": "CITIZEN",
                                              "tenantId": "pb"
                                          }
                                      ],
                                      "fatherOrHusbandName": "vignesh",
                                      "bloodGroup": null,
                                      "identificationMark": null,
                                      "photo": null,
                                      "createdBy": "12006",
                                      "createdDate": 1623305896000,
                                      "lastModifiedBy": "1",
                                      "lastModifiedDate": 1623316676000,
                                      "otpReference": null,
                                      "tenantId": "pb",
                                      "isPrimaryOwner": null,
                                      "ownerShipPercentage": null,
                                      "ownerType": null,
                                      "institutionId": null,
                                      "documents": null,
                                      "userActive": true,
                                      "relationship": "FATHER"
                                  }
                              ],
                              "channel": null,
                              "address": {
                                  "id": "49f4dd8f-0c14-48b8-af93-5e5983233c88",
                                  "tenantId": "pb.amritsar",
                                  "doorNo": null,
                                  "latitude": null,
                                  "longitude": null,
                                  "addressId": null,
                                  "addressNumber": null,
                                  "type": null,
                                  "addressLine1": null,
                                  "addressLine2": null,
                                  "landmark": null,
                                  "city": "pb.amritsar",
                                  "pincode": null,
                                  "detail": null,
                                  "buildingName": null,
                                  "street": null,
                                  "locality": {
                                      "code": "SUN04",
                                      "name": "Ajit Nagar - Area1",
                                      "label": "Locality",
                                      "latitude": null,
                                      "longitude": null,
                                      "children": [],
                                      "materializedPath": null
                                  }
                              },
                              "tradeUnits": [
                                  {
                                      "id": "e782eb55-1737-471f-b1af-0ab52e01b7af",
                                      "tenantId": "pb.amritsar",
                                      "active": true,
                                      "tradeType": "GOODS.MANUFACTURE.TST-15",
                                      "uom": null,
                                      "uomValue": null,
                                      "auditDetails": null
                                  }
                              ],
                              "accessories": null,
                              "applicationDocuments": [
                                  {
                                      "id": "1bde77cf-23f4-4a00-a72d-2704bce2069c",
                                      "active": true,
                                      "tenantId": "pb.amritsar",
                                      "documentType": "OWNERIDPROOF",
                                      "fileStoreId": "5ca0a417-f3c7-4114-8164-5c520fb723d7",
                                      "documentUid": null,
                                      "auditDetails": null
                                  },
                                  {
                                      "id": "6ae06e98-e5b8-40b6-99f8-35d06da22fbe",
                                      "active": true,
                                      "tenantId": "pb.amritsar",
                                      "documentType": "OWNERPHOTO",
                                      "fileStoreId": "7295a3c3-12a2-4271-949a-cb5a137074e3",
                                      "documentUid": null,
                                      "auditDetails": null
                                  },
                                  {
                                      "id": "f0dc33e3-d15d-416b-8798-e908d5cc8dcd",
                                      "active": true,
                                      "tenantId": "pb.amritsar",
                                      "documentType": "OWNERSHIPPROOF",
                                      "fileStoreId": "c523a788-fcf2-47a2-9aa7-3e4f843270c1",
                                      "documentUid": null,
                                      "auditDetails": null
                                  }
                              ],
                              "verificationDocuments": null,
                              "additionalDetail": null,
                              "institution": null,
                              "auditDetails": {
                                  "createdBy": "864e6c10-7be8-4479-b3ad-6ffbb57ffea5",
                                  "lastModifiedBy": "4dc1010d-4b31-4b31-a596-cec2986ac04c",
                                  "createdTime": 1623305896492,
                                  "lastModifiedTime": 1623305896492
                              }
                          },
                          "calculation": null,
                          "auditDetails": {
                              "createdBy": "864e6c10-7be8-4479-b3ad-6ffbb57ffea5",
                              "lastModifiedBy": "4dc1010d-4b31-4b31-a596-cec2986ac04c",
                              "createdTime": 1623305896492,
                              "lastModifiedTime": 1623316676245
                          },
                          "fileStoreId": null,
                          "headerSideText": {
                              "word1": "Trade License No: ",
                              "word2": "PB-TL-2021-06-10-001673"
                          }
                      }
                  ]
              };

signJSON(transformW3(cert2))
  .then(d => {
    console.log(d)
  });

test('Sign the json', async () => {
  sign = await signJSON(transformW3(cert2));
  console.log(JSON.stringify(sign))
  expect(sign).not.toBe(null);
});
/*
test('Verify the signed json', async () => {
  const signed = "{\"@context\":[\"https://www.w3.org/2018/credentials/v1\",\"https://cowin.gov.in/credentials/vaccination/v1\"],\"type\":[\"VerifiableCredential\",\"ProofOfVaccinationCredential\"],\"credentialSubject\":{\"type\":\"Person\",\"id\":\"did:in.gov.uidai.aadhaar:2342343334\",\"refId\":\"12346\",\"name\":\"Bhaya Mitra\",\"gender\":\"Male\",\"age\":\"27\",\"nationality\":\"Indian\",\"address\":{\"streetAddress\":\"\",\"streetAddress2\":\"\",\"district\":\"\",\"city\":\"\",\"addressRegion\":\"\",\"addressCountry\":\"IN\",\"postalCode\":\"\"}},\"issuer\":\"https://cowin.gov.in/\",\"issuanceDate\":\"2021-01-15T17:21:13.117Z\",\"evidence\":[{\"id\":\"https://cowin.gov.in/vaccine/undefined\",\"feedbackUrl\":\"https://cowin.gov.in/?undefined\",\"infoUrl\":\"https://cowin.gov.in/?undefined\",\"type\":[\"Vaccination\"],\"batch\":\"MB3428BX\",\"vaccine\":\"CoVax\",\"manufacturer\":\"COVPharma\",\"date\":\"2020-12-02T19:21:18.646Z\",\"effectiveStart\":\"2020-12-02\",\"effectiveUntil\":\"2025-12-02\",\"dose\":\"\",\"totalDoses\":\"\",\"verifier\":{\"name\":\"Sooraj Singh\"},\"facility\":{\"name\":\"ABC Medical Center\",\"address\":{\"streetAddress\":\"123, Koramangala\",\"streetAddress2\":\"\",\"district\":\"Bengaluru South\",\"city\":\"Bengaluru\",\"addressRegion\":\"Karnataka\",\"addressCountry\":\"IN\",\"postalCode\":\"\"}}}],\"nonTransferable\":\"true\",\"proof\":{\"type\":\"RsaSignature2018\",\"created\":\"2021-01-15T17:21:13Z\",\"verificationMethod\":\"did:india\",\"proofPurpose\":\"assertionMethod\",\"jws\":\"eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..mJlHZZRD7VQwVJchfI21ZavjxNKglbf3LSaF1SAjELOWn9MARALkugsmOzG0mBon9R7zXSVPkPM8EDbUZxR4FsRlAFFszFv-0BjyAeIqRv-9MRnlm4cScQi8aCBgBnvsWfNIE175cGNbPUluVv5n6G66tVinioL5IL6uCZNQnSGp4jJrEAZa0t5s3jXfq7soHz1LTfQbLs7cH5-fDi3JW1-WeF4_ELy_9l_OxAc2CoACqYLOLJB-NnPsnz2bwAvH8yXHsjZJphzaBNqpn8DmJvcRHzhz7OjpGfhyouiOyGo_XncadFmftqwfilJkC1EISkSb6QVsyhHLOudY4PTTaA\"}}";
  const {publicKeyPem} = require('../config/keys');
  const publicKey = {
    '@context': jsigs.SECURITY_CONTEXT_URL,
    id: 'did:india',
    type: 'RsaVerificationKey2018',
    controller: 'https://cowin.gov.in/',
    publicKeyPem
  };
  const controller = {
    '@context': jsigs.SECURITY_CONTEXT_URL,
    id: 'https://cowin.gov.in/',
    publicKey: [publicKey],
    // this authorizes this key to be used for making assertions
    assertionMethod: [publicKey.id]
  };
  const key = new RSAKeyPair({...publicKey});
  const {AssertionProofPurpose} = jsigs.purposes;
  const result = await jsigs.verify(signed, {
    suite: new RsaSignature2018({key}),
    purpose: new AssertionProofPurpose({controller}),
    compactProof: false,
    documentLoader: customLoader
  });
  console.log(result);
  expect(result.verified).toBe(true)
});

test('Signed json to include certificate id', async () => {
    const certificateId = "123";
    sign = await signJSON(transformW3(cert2, certificateId));
    expect(sign.credentialSubject.id).toBe(cert2.recipient.identity);
    expect(sign.evidence[0].id).toBe("https://cowin.gov.in/vaccine/" + certificateId);
    expect(sign.evidence[0].certificateId).toBe(certificateId);
});
*/