export interface ICardService {
    getList(requestId: string, payload?: any): Promise<any>;

    getDetails(requestId: string, payload?: any): Promise<any>;

    getBalance(requestId: string, payload?: any): Promise<any>;

    getTransactions(requestId: string, payload?: any): Promise<any>;

    getTransactionStatus(requestId: string, payload?: any): Promise<any>;

    getUnbilledTransactions(requestId: string, payload?: any): Promise<any>;

    setPin(requestId: string, payload?: any): Promise<any>;

    getCvv(requestId: string, payload?: any): Promise<any>;

    getLimit(requestId: string, payload?: any): Promise<any>;

    setLimit(requestId: string, payload?: any): Promise<any>;

    upgradeLimit(requestId: string, payload?: any): Promise<any>;

    getPreference(requestId: string, payload?: any): Promise<any>;

    setPreference(requestId: string, payload?: any): Promise<any>;

    getStatement(requestId: string, payload?: any): Promise<any>;

    updateStatementDate(requestId: string, payload?: any): Promise<any>;

    getDue(requestId: string, payload?: any): Promise<any>;

    lock(requestId: string, payload?: any): Promise<any>;

    unlock(requestId: string, payload?: any): Promise<any>;

    replace(requestId: string, payload?: any): Promise<any>;

    requestPhysicalCard(requestId: string, payload?: any): Promise<any>;

    repayment(requestId: string, payload?: any): Promise<any>;
}