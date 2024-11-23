import { HttpRequest, HttpRequestMethod } from "common-lib";
import { createCipheriv } from "crypto";
import { HttpErrors } from "@loopback/rest";
import { LoanRequestType, Transaction } from "../../../../controllers";

/**
 * Get Card List
 */
export class M2PCardApiGetListRequest extends HttpRequest {
    entityId: string;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/v2/getCardList', HttpRequestMethod.Post, {});
    }

    override getBody(): any {
        return {
            customerId: this.entityId
        }
    }
}

/**
 * Get Card List - V3
 */
export class M2PCardApiV3GetListRequest extends HttpRequest {
    entityId: string;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/v3/getCardList',
            HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId
        }
    }
}

/**
 * Get Balance
 */
export class M2PCardApiGetBalanceRequest extends HttpRequest {
    entityId: string;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/fetchbalance/',
            HttpRequestMethod.Get);
    }

    override getQueryParameters(): string {
        return this.entityId;
    }
}

/**
 * Get Transactions
 */
export class M2PCardApiGetTransactionsRequest extends HttpRequest {
    entityId: string;
    fromDate: string;
    toDate: string;
    pageNumber?: number;
    pageSize?: number;

    constructor(id: string) {
        super(id, '/Yappay/txn-manager/fetchTnxByEntityIdBetween/', HttpRequestMethod.Get);
    }

    override getQueryParameters(): string {
        let query: string = this.entityId + '?fromDate=' + this.fromDate
            + '&toDate=' + this.toDate;
        if (this.pageNumber !== null && this.pageNumber !== undefined) {
            query += '&pageNumber=' + this.pageNumber;
        }
        if (this.pageSize !== null && this.pageSize !== undefined) {
            query += '&pageSize=' + this.pageSize;
        }
        return query;
    }
}


/**
 * Get Transaction By External Id
 */
export class M2PCardApiGetTransactionByExternalIdRequest extends HttpRequest {
    externalTransactionId: string;

    constructor(id: string) {
        super(id, '/Yappay/txn-manager/fetch/', HttpRequestMethod.Get);
    }

    override getQueryParameters(): string {
        return this.externalTransactionId;
    }
}

/**
 * Get Transaction Status
 */
export class M2PCardApiGetTransactionStatusRequest extends HttpRequest {
    entityId: string;
    fromDate: string;
    toDate: string;
    pageNumber?: number;
    pageSize?: number;

    constructor(id: string) {
        super(id, '/statement/txn-manager/fetch?', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entity_id: this.entityId
        }
    }

    override getPath(): string {
        return this.path + `fromDate=${this.fromDate}&toDate=${this.toDate}`
            + (this.pageNumber ? `&pageNo=${this.pageNumber}` : '')
            + (this.pageSize ? `&pageSize=${this.pageSize}` : '');
    }
}

/**
 * Get Unbilled Transactions
 */
export class M2PCardApiGetUnbilledTransactionsRequest extends HttpRequest {
    entityId: string;
    pageNumber?: number;
    pageSize?: number;

    constructor(id: string) {
        super(id, '/statement/customer/fetchUnbilledTxns', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entity_id: this.entityId,
            pageNumber: this.pageNumber ? this.pageNumber : 0,
            pageSize: this.pageSize ? this.pageSize : 999
        }
    }
}

/**
 * Set Pin
 */
export class M2PCardApiSetPinRequest extends HttpRequest {
    private readonly KEY: string;

    entityId: string;
    kitNo: string;
    expiryDate: string;
    dob: string;
    pin: string;

    constructor(id: string, key: string = 'C1FB4064FEF0F9D5EAAAD890D1BC2B0A') {
        super(id, '/Yappay/business-entity-manager/setPin', HttpRequestMethod.Post);
        this.KEY = key;
    }

    override getBody(): any {
        try {
            return {
                entityId: this.entityId,
                kitNo: this.kitNo,
                expiryDate: this.expiryDate,
                dob: this.dob.split('-').join(''),
                pin: this.encrytPin(this.getPinBlock())
            }
        } catch (e: any) {
            throw new HttpErrors.UnprocessableEntity(`ERROR - getting error while encryption`);
        }
    }

    private getPinBlock(): string {
        const pinLength = this.pin.length.toString().padStart(2, '0') + this.pin;
        const hexPin = Buffer.from(pinLength.padEnd(16, 'F'), 'hex');
        const kitNumberFinal = this.kitNo.length <= 12 ? this.kitNo : this.kitNo.slice(-12);
        const hexKitNumber = Buffer.from(kitNumberFinal.padStart(16, '0'), 'hex');
        const pinBlock = Buffer.from(hexPin.slice(0, 8).map((value, i) => value ^ hexKitNumber[i]));
        return pinBlock.toString('hex').toUpperCase();
    }

    private encrytPin(data: string): string {
        const passwordBytes = Buffer.from(this.KEY, 'utf8');
        const cipher = createCipheriv('aes-256-ecb', passwordBytes, null);
        const encryptedBytes = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
        const base64Encoded = encryptedBytes.toString('base64');
        return base64Encoded;
    }
}

/**
 * Generate CVV
 */
export class M2PCardApiGenerateCvvRequest extends HttpRequest {
    entityId: string;
    kitNo: string;
    expiryDate: string;
    dob: string;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/generateCVV', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            kitNo: this.kitNo,
            expiryDate: this.expiryDate,
            dob: this.dob
        }
    }
}

/**
 * Get Limit
 */
export class M2PCardApiGetLimitRequest extends HttpRequest {
    entityId: string;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/fetchLimit',
            HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId
        };
    }
}

/**
 * Set Limit
 */
export class M2PCardApiSetLimitRequest extends HttpRequest {
    entityId: string;
    amount: number;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/setLimit', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            amount: this.amount
        };
    }
}

/**
 * Upgrade Limit
 */
export class M2PCardApiUpgradeLimitRequest extends HttpRequest {
    entityId: string;
    amount: number;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/upgradeLimit', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            amount: this.amount
        };
    }
}

/**
 * Get Preference
 */
export class M2PCardApiGetPreferenceRequest extends HttpRequest {
    entityId: string;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/fetchPreference',
            HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId
        };
    }
}

/**
 * Set Preference
 */
export class M2PCardApiSetPreferenceRequest extends HttpRequest {
    entityId: string;
    limitConfigs: {
        txnType: string;
        dailyLimitValue: string;
        dailyLimitCnt?: string;
        minAmount?: string;
        maxAmount?: string;
    }[];
    atm: boolean;
    pos: boolean;
    ecom: boolean;
    international: boolean;
    contactless: boolean;
    transactionUsageType: string;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/v2/setPreferences',
            HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            transactionUsageType: this.transactionUsageType,
            limitConfigs: this.limitConfigs,
            atm: this.atm,
            pos: this.pos,
            ecom: this.ecom,
            international: this.international,
            contactless: this.contactless,
            dcc: this.international
        };
    }
}

/*
* Get statement
*/
export class M2PCardApiGetStatementRequest extends HttpRequest {
    entityId: string;
    statementMonthYear: string; // MMYYYY

    constructor(id: string) {
        // super(id, '/statement/customer/fetchStatementDataList', HttpRequestMethod.Post);
        super(id, '/statement/customer/fetchStatementData', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            stmt_month: this.statementMonthYear
        };
    }
}

/**
 * Update statement
 */
export class M2PCardApiUpdateStatementDateRequest extends HttpRequest {
    entityId: string;
    statementDate: string;

    constructor(id: string) {
        super(id, '/statement/update/StatementDate', HttpRequestMethod.Post);

    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            stmtDate: this.statementDate
        };
    }
}

/**
 * Get due
 */
export class M2PCardApiGetDueRequest extends HttpRequest {
    entityId: string;

    constructor(id: string) {
        super(id, '/statement/customer/fetchDue?emi_details=true&include_fee=true',
            HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
        };
    }
}

/**
 * Lock card
 */
export class M2PCardApiLockRequest extends HttpRequest {
    private readonly flag: string = 'L';
    entityId: string;
    reason: string;
    kitNo: string;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/block', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            kitNo: this.kitNo,
            reason: this.reason,
            flag: this.flag
        }
    }
}

/**
 * Unlock card
 */
export class M2PCardApiUnlockRequest extends HttpRequest {
    readonly flag: string = 'UL';
    entityId: string;
    reason: string;
    kitNo: string;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/block', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            kitNo: this.kitNo,
            reason: this.reason,
            flag: this.flag
        }
    }
}

/**
 * Block card
 */
export class M2PCardApiBlockRequest extends HttpRequest {
    readonly flag: string = 'BL';
    entityId: string;
    reason: string;
    kitNo: string;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/block', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            kitNo: this.kitNo,
            reason: this.reason,
            flag: this.flag
        }
    }
}

/**
 * Replace card
 */
export class M2PCardApiReplaceRequest extends HttpRequest {
    entityId: string;
    newKitNo: string;
    oldKitNo: string;
    businessType?: string;

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/replaceCard', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            oldKitNo: this.oldKitNo,
            newKitNo: this.newKitNo,
            businessType: this.businessType
        }
    }
}

/**
 * Card repayment
 */
export class M2PCardApiRepaymentRequest extends HttpRequest {
    entityId: string;
    businessEntityId: string;
    business: string;
    amount: string;
    transactionType: string;
    transactionOrigin: string;
    productId: string;
    externalTransactionId: string;
    description: string;
    otherPartyId: string;
    otherPartyName: string;

    constructor(id: string) {
        super(id, '/Yappay/txn-manager/create', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            businessEntityId: this.businessEntityId,
            business: this.business,
            amount: this.amount,
            transactionType: this.transactionType,
            transactionOrigin: this.transactionOrigin,
            productId: this.productId,
            externalTransactionId: this.externalTransactionId,
            description: this.description,
            otherPartyId: this.otherPartyId,
            otherPartyName: this.otherPartyName,
        }
    }
}

/**
 * Request Physical Card 
 */
export class M2PCardApiPhysicalRequest extends HttpRequest {
    entityId: string;
    kitNo: string;
    addressDto: {
        address: {
            title: string,
            address1: string,
            address2: string,
            city: string,
            state: string,
            country: string,
            pinCode: string,
            fourthLine: string
        }[]
    };

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/requestPhysicalCard', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            kitNo: this.kitNo,
            addressDto: this.addressDto
        }
    }
}

/**
 * Register User
 */
export class M2PCardApiRegisterUserRequest extends HttpRequest {
    entityId: string;
    entityType: string;
    entityCategory: string;
    businessId: string;
    customerId: string;
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    isNRICustomer: boolean;
    isMinor: boolean;
    isDependant: boolean;
    maritalStatus: string;
    employmentIndustry: string;
    employmentType: string;
    businessType: string;
    cardOpenDate: string;
    kitInfo: {
        kitNo: string,
        cardType: string,
        cardCategory: string,
        cardRegStatus: string,
        expDate: number,
        aliasName: string,
        fourthLine: string
    }
    addressInfo: {
        addressCategory: string,
        address1: string,
        address2: string,
        address3: string,
        city: string,
        state: string,
        country: string,
        pinCode: string
    };
    communicationInfo: {
        contactNo: string,
        contactNo2: string,
        emailId: string,
        notification: boolean
    };
    accountInfo: {
        entityId: string,
        tenant: string,
        accountNo: string,
        accountType: string,
        accountTag: string
    };
    kycInfo: {
        kycRefNo: string,
        documentType: string,
        documentNo: string,
        documentExpiry: string
    };
    dateInfo: {
        dateType: string,
        date: string
    };
    creditInfo: {
        cardCategory: string,
        creditLimit: string,
        cardLimit: string,
        statementDate: string
    }

    constructor(id: string) {
        super(id, 'api/v1/users/register', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            entityType: this.entityType,
            entityCategory: this.entityCategory,
            businessId: this.businessId,
            customerId: this.customerId,
            title: this.title,
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            gender: this.gender,
            isNRICustomer: this.isNRICustomer,
            isMinor: this.isMinor,
            isDependant: this.isDependant,
            maritalStatus: this.maritalStatus,
            employmentIndustry: this.employmentIndustry,
            employmentType: this.employmentType,
            businessType: this.businessType,
            cardOpenDate: this.cardOpenDate,
            kitInfo: this.kitInfo,
            addressInfo: this.addressInfo,
            communicationInfo: this.communicationInfo,
            accountInfo: this.accountInfo,
            kycInfo: this.kycInfo,
            dateInfo: this.dateInfo,
            creditInfo: this.creditInfo
        }
    }
}

/**
 * Freeze Card
 */
export class M2PCardApiFreezeRequest extends HttpRequest {
    entityId: string;
    reason?: string;

    constructor(id: string) {
        super(id, '/statement/accountClosure/freeze', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            reason: this.reason
        }
    }
}

/**
 * Get EMI eligible transactions
 */
export class M2PCardApiGetEMIEligibleTransactionRequest extends HttpRequest {
    entityId: string;
    pageNumber?: number;
    pageSize?: number;

    constructor(id: string) {
        super(id, '/loan/eligibility/transactions', HttpRequestMethod.Post);
    }

    override getBody() {
        return {
            entityId: this.entityId,
            pageNumber: this.pageNumber ? this.pageNumber : 0,
            pageSize: this.pageSize ? this.pageSize : 999
        };
    }
}

/**
 * Close card account
 */
export class M2PCardApiCloseRequest extends HttpRequest {
    entityId: string;
    reason?: string;

    constructor(id: string) {
        super(id, '/statement/accountClosure', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            reason: this.reason
        }
    }
}

/**
 * All loans
 */
export class M2PCardApiGetAllLoansRequest extends HttpRequest {
    entityId: string;
    pageNumber?: number;
    pageSize?: number;
    status: 'ACTIVE' | 'CANCELLED' | 'CLOSED' | 'PRE_CLOSED' = 'ACTIVE';

    constructor(id: string) {
        super(id, '/loan/getByStatus', HttpRequestMethod.Post)
    }

    override getBody() {
        return {
            entityId: this.entityId,
            status: this.status,
            offset: 0,
            pageNo: 0,
            pageSize: 999
        };
    }

    override getQueryParameters(): string {
        if (this.pageNumber && this.pageSize) {
            // return '?offset=' + this.pageSize + '&pageNo=' + this.pageNumber;
        }

        return '?offset=2&pageNo=2';
    }
}

/**
 * Get Outstanding Details
 */
export class M2PCardApiGetOutstandingRequest extends HttpRequest {
    entityId: string;

    constructor(id: string) {
        super(id, '/statement/accountClosure/previewOutStanding', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId
        }
    }
}

/**
 * Preview loan
 */
export class M2PCardApiPreviewLoanRequest extends HttpRequest {
    entityId: string;
    ruleId: string;
    loanRequestType: LoanRequestType;
    transactions: Transaction[];

    constructor(id: string) {
        super(id, '/loan/create/preview', HttpRequestMethod.Post);
    }

    override getBody() {
        return {
            entityId: this.entityId,
            ruleId: this.ruleId,
            requestType: this.loanRequestType,
            transactions: this.transactions
        };
    }
}

/**
 * Create loan
 */
export class M2PCardApiCreateLoanRequest extends HttpRequest {
    entityId: string;
    tenure: string;
    loanRequestId: string;

    constructor(id: string) {
        super(id, '/loan/create', HttpRequestMethod.Post);
    }

    override getBody() {
        return {
            entityId: this.entityId,
            tenure: this.tenure,
            requestId: this.loanRequestId
        };
    }
}
