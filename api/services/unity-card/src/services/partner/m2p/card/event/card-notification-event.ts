export interface M2PNotificationEvent {
    eventId: string; // message id from queue
    traceNo: string;
    bin: string;
    txnCurrency: string;
    extTxnId: string;
    terminalId: string;
    mcc: string;
    merchantName: string;
    network: string;
    retrievalRefNo: string;
    proxyCardNo: string;
    cardEnding: string;
    txnStatus: string;
    crdr: string;
    balance: string;
    merchantId: string;
    curCode: string;
    acquirerId: string;
    amount: number;
    channel: string;
    kitNo: string;
    authCode: string;
    transactionDateTime: string;
    entityId: string;
    transactionFees: string;
    mobileNo: string;
    prodType: string;
    transactionType: string;
    txnOrigin: string;
    txnRefNo: string;
    txnAmt: string;
    txnDate: string;
    description: string;
    subTemplate: string;
    statementDate: string;
    dueDate: string;
}