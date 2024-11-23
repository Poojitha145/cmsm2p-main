export enum M2PTransactionType {
    ATM = 'ATM',
    ATM_REVERSAL = 'ATM_REVERSAL',
    POS = 'POS',
    POS_REVERSAL = 'POS_REVERSAL',
    ECOM = 'ECOM',
    ECOM_REVERSAL = 'ECOM_REVERSAL',
    DIRECT_CREDIT = 'DIRECT_CREDIT',
    DIRECT_DEBIT = 'DIRECT_DEBIT',
    PG = 'PG',
    FEES = 'FEES',
    FEES_REVERSAL = 'FEES_REVERSAL',
    FUNDPOST_CREDIT = 'FUNDPOST_CREDIT',
    FUNDPOST_DEBIT = 'FUNDPOST_DEBIT',
    FUNDPOST_DEBIT_REVERSAL = 'FUNDPOST_DEBIT_REVERSAL',
    INTEREST = 'INTEREST',
    REFUND = 'REFUND',
    REGISTRATION_FEE = 'REGISTRATION_FEE',
    REGISTRATION_FEE_REVERSAL = 'REGISTRATION_FEE_REVERSAL',
    REVERSAL = 'REVERSAL',
    SERVICETAX = 'SERVICETAX',
    SERVICETAX_REVERSAL = 'SERVICETAX_REVERSAL',
    LOAD = 'LOAD',
    CHARGEBACK_CREDIT = 'CHARGEBACK_CREDIT',
    UNCATEGORISED = 'UNCATEGORISED' // this is added by Saven when unknown txn type shows up
}

export class M2PCardTransaction {

    public static Type = class {
        public static readonly PIN_CHANGE_SUCCESS: string = 'pin_change_success';
        public static readonly CUSTOMER_CARD_STATUS_UPDATE: string = 'customer_cardstatus_update';
        public static readonly ATM: string = 'ATM';
        public static readonly POS: string = 'POS';
        public static readonly CASH_AT_POS: string = 'CASH_AT_POS';
        public static readonly ECOM: string = 'ECOM';
        public static readonly ATM_REVERSAL: string = 'ATM_REVERSAL';
        public static readonly POS_REVERSAL: string = 'POS_REVERSAL';
        public static readonly ECOM_REVERSAL: string = 'ECOM_REVERSAL';
        public static readonly DIRECT_CREDIT: string = 'DIRECT_CREDIT';
        public static readonly FUNDPOST_CREDIT: string = 'FUNDPOST_CREDIT';
        public static readonly CHARGEBACK_CREDIT: string = 'CHARGEBACK_CREDIT';
        public static readonly REFUND: string = 'REFUND';
        public static readonly STATEMENT_GENERATED: string = 'STATEMENT_GENERATED';
        public static readonly FEES: string = 'FEES';
        public static readonly INTEREST: string = 'INTEREST';
    }

    public static Status = class {
        public static readonly PAYMENT_SUCCESS: string = 'PAYMENT_SUCCESS';
        public static readonly PAYMENT_FAILURE: string = 'PAYMENT_FAILURE';
    }

    public static Description = class {
        public static readonly CARD_BLOCKED: string = "BLOCKED";
        public static readonly INVALID_PIN: string = "Invalid Pin";
        public static readonly INVALID_TRANSACTION: string = "Invalid Transaction";
    }

    public static Template = class {
        public static readonly INVALID_EXPIRY_DATE: string = "INVALID_EXPIRY_DATE";
        public static readonly CVV2_FAIL: string = "CVV2_FAIL";
        public static readonly INTL_NA: string = "INTL_NA";
        public static readonly POS_PREFERENCE_FAILED_TXN_ORIGIN: string = "pos_preference_failed_txn_origin";
        public static readonly ECOM_PREFERENCE_FAILED_TXN_ORIGIN: string = "ecom_preference_failed_txn_origin";
        public static readonly ATM_PREFERENCE_FAILED_TXN_FAILED: string = "atm_preference_failed_txn_origin";
        public static readonly POS_PREFERENCE_FAILED_CONTACTLESS: string = "pos_preference_failed_contactless";
    }
}

export class M2PCardTransactionDescription {
    public static readonly CARD_BLOCKED: string = 'BLOCKED';
    public static readonly INVALID_PIN: string = 'Invalid Pin';
    public static readonly INVALID_TRANSACTION: string = 'Invalid Transaction';
}

export class M2PCardTransactionSubTemplate {
    public static readonly INVALID_EXPIRY_DATE: string = 'INVALID_EXPIRY_DATE';
    public static readonly CVV2_FAIL: string = 'CVV2_FAIL';
    public static readonly INTL_NA: string = 'INTL_NA';
    public static readonly POS_PREFERENCE_FAILED_TXN_ORIGIN: string = 'pos_preference_failed_txn_origin';
    public static readonly ECOM_PREFERENCE_FAILED_TXN_ORIGIN: string = 'ecom_preference_failed_txn_origin';
    public static readonly ATM_PREFERENCE_FAILED_TXN_FAILED: string = 'atm_preference_failed_txn_origin';
    public static readonly POS_PREFERENCE_FAILED_CONTACTLESS: string = 'pos_preference_failed_contactless';
}