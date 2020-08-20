# Egov-pdf service

Egov-pdf service work in between pdf-service and client requesting pdfs. Earlier client used to directly call pdf-service with complete data as json, but with introduction of this new service one can provide just few parameters ex:- applicationnumber, tenantId to this new service to get a pdf. 
### DB UML Diagram

- NA

### Service Dependencies

- egov-mdms-service
- tl-service
- Property-service
- Pdf-service
- User-service
- Collection service
- Billing-service
- Workflow-service


### Swagger API Contract

http://editor.swagger.io/?url=https://raw.githubusercontent.com/egovernments/utilities/gopesh67-patch-1/docs/egov-pdf_contract.yml#!/

## Service Details

Egov-pdf service is new service being added which can work in between existing pdf-service and client requesting pdfs. Earlier client used to directly call pdf-service with complete data as json, but with introduction of this new service one can provide just few parameters ex:- applicationnumber, tenantId to this new service to get a pdf. The egov-pdf service will take responsibility of getting application data from concerned service and also will do any enrichment if required and then with the data call pdf service to get pdf directly . The service will return pdf binary as response which can be directly downloaded by the client. With this service the existing pdf service endpoints need not be exposed to frontend.

For any new pdf requirement one new endpoint with validations and logic for getting data for pdf has to be added in the code. With separate endpoint for each pdf we can define access rules per pdf basis. Currently egov-pdf service has endpoint for following pdfs used in our system:-

- PT mutationcertificate
- PT bill
- PT receipt
- TL receipt
- TL certifcate
- TL renewal certificate
- Consolidated receipt

#### Configurations
NA

### API Details
Currently below endpoints are in use for ‘CITIZEN' and 'EMPLOYEE’ roles

| Endpoint | module | query parameter | Restrict Citizen to own records |
| -------- | ------ | --------------- | ------------------------------- |
|`/egov-pdf/download/PT/ptreceipt` | property-tax | `uuid, tenantId` | yes |
|`/egov-pdf/download/PT/ptbill` | property-tax | `uuid, tenantId` | no |
|`/egov-pdf/download/PT/ptmutationcertificate` | property-tax | `uuid, tenantId` | yes |
|`/egov-pdf/download/TL/tlrenewalcertificate` | Tradelicense | `applicationNumber, tenantId` | yes |
|`/egov-pdf/download/TL/tlcertificate` | Tradelicense | `applicationNumber, tenantId` | yes |
|`/egov-pdf/download/TL/tlreceipt` | Tradelicense | `applicationNumber, tenantId` | yes |
|`/egov-pdf/download/PAYMENT/consolidatedreceipt` | Collection | `consumerCode, tenantId` | yes |

### Kafka Consumers
NA

### Kafka Producers
NA