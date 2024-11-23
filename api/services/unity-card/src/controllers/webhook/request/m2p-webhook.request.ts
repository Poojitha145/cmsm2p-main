import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";

// export const M2PCardEventNotificationSchema: SchemaObject | ReferenceObject = {
//   type: 'object',
//   properties: {
//     traceNo: { type: 'string' },
//     bin: { type: 'string' },
//     txnCurrency: { type: 'string' },
//     extTxnId: { type: 'string' },
//     terminalId: { type: 'string' },
//     mcc: { type: 'string' },
//     merchantName: { type: 'string' },
//     network: { type: 'string' },
//     retrievalRefNo: { type: 'string' },
//     proxyCardNo: { type: 'string' },
//     cardEnding: { type: 'string' },
//     txnStatus: { type: 'string' },
//     crdr: { type: 'string' },
//     balance: { type: 'string' },
//     merchantId: { type: 'string' },
//     channelMode: { type: 'string' },
//     curCode: { type: 'string' },
//     acquirerId: { type: 'string' },
//     amount: { type: 'number' },
//     kitNo: { type: 'string' },
//     authCode: { type: 'string' },
//     transactionDateTime: { type: 'string' },
//     entityId: { type: 'string' },
//     transactionFees: { type: 'string' },
//     mobileNo: { type: 'string' },
//     prodType: { type: 'string' },
//     transactionType: { type: 'string' },
//     txnOrigin: { type: 'string' },
//     txnRefNo: { type: 'string' },
//     txnAmt: { type: 'string' },
//     txnDate: { type: 'string' },
//     // description: { type: 'string' },
//     // subTemplate: { type: 'string' },
//     // statementDate: { type: 'string' },
//     // dueDate: { type: 'string' },
//     partnerId: { type: 'string' }
//   },
// };

// export const M2PCardEventNotificationSchema: SchemaObject | ReferenceObject = {
//   type: 'object',
//   properties: {
//     traceNo: { tyepe: 'string' },
//     bin: {type:'string'},
//     txnCurrency: {type:'string'},
    
//   }
// }

// export const M2PWebookRequestBody: Partial<RequestBodyObject> = {
//   description: '',
//   required: true,
//   content: {
//     'application/json': { schema: M2PCardEventNotificationSchema }
//   }
// }