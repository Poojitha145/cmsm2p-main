
export const CardApiMessages = {
    LOCKED_SUCCESSFULLY: 'Your card has been successfully locked.',
    UNLOCKED_SUCCESSFULLY: 'Your card has been successfully unlocked.',
    BLOCKED_SUCCESSFULLY: 'Your card has been successfully blocked.',
    REPLACED_SUCCESSFULLY: 'Your card has been successfully replaced.',
    PHYSICAL_CARD_REQUEST_PLACED_SUCCESSFULLY: 'Your physical card request has been placed successfully.',
    FREEZED_SUCCESSFULLY: 'Your card has been successfully freezed.',
    CLOSED_SUCCESSFULLY: 'Your card closure has been successfully processed.',
    SETTLE_YOUR_OUTSTANDING_BALANCE: 'Your request to close the card has been submitted successfully. Please settle your outstanding balance to proceed with the closure.',
    STATEMENT_DATE_UPDATED_SUCCESSFULLY: 'Your statement date has been updated successfully.',
};

export enum CardType {
    VIRTUAL = 'VIRTUAL',
    PHYSICAL = 'PHYSICAL'
};

/**
 * Card transaction types
 */
export enum CardTransactionType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT'
};

/**
 * Card details
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
};

/**
 * Card details
 */
export class CardDetailsModel {
    card: CardModel;
    customer: { name: string, dob: string };
};

/**
 * Card limit details
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
 * Card transaction model
 */
export interface CardTransactionModel {
    id: string;
    internalId?: string;
    externalId?: string;
    description: string;
    date: string;
    time: string;
    datetime: number;
    amount: number;
    type: CardTransactionType;
    merchantId?: string;
    merchantName?: string;
    merchantLocation?: string;
    category?: string;
    subCategory?: string;
    universalCurrencyAmount?: number;
    origin?: string;
    billedStatus?: string;
    authorizationStatus?: any;
    kitNo?: string;
    postTransactionLimit?: any;
};

/**
 * Card statement model
 */
export interface CardStatementModel {
    id: string;
    amount: number;
    currentStatementAmount: number;
    lastStatementBalance: number;
    totalCreditAmount: number;
    totalDebitAmount: number;
    minimumDueAmount: number;
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
    transactions: CardTransactionModel[];
}

export interface CardStatementTemplateModel extends CardStatementModel {
    card: CardModel,
    cardLimit: CardLimitModel,
    transactionAmount: number,
    feesAndIntrest: number,
    newBalance: number
}

export interface StatusResultModel {
    status: boolean,
    message?: string;
}