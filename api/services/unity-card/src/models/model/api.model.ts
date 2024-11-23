
/**
 * Card
 */
export class CardModel {
    id: string;
    name: string;
    dob: string;
    kitNo: string;
    cardNo: string;
    partialCardNo: string;
    isPinSetup: boolean;
    type: string;
    networkType: string;
    status: string;
    expiryDate: string;
    issueDate: string;
}

export class CardBalanceModel {
    productId: string;
    balanceAmount: number;
    lienBalanceAmount: number;
}

/**
 * Card
 */
export class CardLimitModel {
    totalLimit: number;
    availableLimit: number;
    utilizedLimit: number;
    purchaseLimit: number;
    cashLimit: number;
    creditBalance: number;
}

/**
 * TRANSACTIONS
 */
export enum TransactionType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT'
}

export interface TransactionModel {
    id: string;
    internalId?: string;
    externalId?: string;
    description: string;
    date: string;
    amount: number;
    type: TransactionType;
    merchantId?: string;
    merchantName?: string;
    merchantLocation?: string;
    category?: string;
    subCategory?: string;
    currencyCode?: string;
};

/**
 * STATEMENTS
 */
export interface StatementModel {
    id: string;
    amount: number;
    currentStatementAmount: number;
    lastStatementBalance: number;
    // currentStatementAmount: number;
    totalCreditAmount: number;
    totalDebitAmount: number;
    minimumDueAmount: number;
    // cash: number;
    purchase: {
        amount: number,
        cash: number
    };
    finance: {
        interest: number,
        tax: number,
        fees: number
    },
    emi: {
        debit: number,
        principle: number,
        interest: number,
        otherCharges: number,
        limitBlockedAmount: number
    },
    paymentStatus: string;
    startDate: string;
    statementDate: string;
    customerDueDate: string;
    statementMonthYear: string;
    invoiceNumber: string;
    dueDate: string;
    excessAmount: number;
    // rewardPointsCreditLastStmt: string;
    // statementFile: string;
}

export interface TransactionalStatementModel {
    transactions: TransactionModel[];
    statement: StatementModel;
}