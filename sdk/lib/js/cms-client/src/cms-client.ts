import axios, { AxiosInstance } from "axios";

export interface CmsClientOptions {
    baseURL: string;
    virtual?: boolean;
}

const ApiPath = {
    USER_VERIFY_MPIN: '/user/verify/mpin',
    CARD_GET_BALANCE: '/card/get/balance',
    RESET_MPIN: '/card/reset/mpin',
    CARD_GET_LIST: '/card/get/list',
    CARD_GET_DETAILS: '/card/get/details',
    CARD_GET_CVV: '/card/get/cvv',
    CARD_SET_LIMIT: '/card/set/limit',
    CARD_GET_LIMIT: '/card/get/limit',
    CARD_UPGRADE_LIMIT: '/card/upgrade/limit',
    CARD_GET_PREFERENCE: '/card/get/preference',
    CARD_SET_PREFERENCE: '/card/set/preference',
    CARD_GET_STATEMENT: '/card/get/statement',
    CARD_GET_UNBILLED_TRANSACTIONS: '/card/get/unbilled/transactions',
    CARD_GET_DUE: '/card/get/due',
    CARD_UPDATE_STATEMENT_DATE: '/card/update/statement/date',
    CARD_SET_PIN: '/card/set/pin',
    CARD_GET_BILLING_DATES: '/card/get/billing_dates',
    CARD_LOCK: '/card/lock',
    CARD_UNLOCK: '/card/unlock',
    CARD_REPLACE: '/card/replace',
    CARD_GET_TRANSACTION_STATUS: '/card/get/transaction/status',
    REQUEST_PHYSICAL_CARD: '/request/physical/card',
    CARD_BLOCK: '/card/block',
    CARD_CLOSE: '/card/close',
    LOAN_ELIGIBLE_EMI_TRANSACTIONS: '/loan/eligible/emi/transactions',
    LOAN_GET_LIST: '/loan/get/list',
    LOAN_PREVIEW: '/loan/preview'
}

export class CmsClient {

    private readonly axios: AxiosInstance;
    private readonly options: CmsClientOptions;
    private readonly defaultOptions: any = {};

    constructor(options: CmsClientOptions) {
        this.options = options;

        const config = {
            baseURL: this.options.baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (options.virtual) {
            config.headers['Virtual-Data'] = true;
        }

        this.axios = axios.create(config);
    }

    private async doGet(path: string, options?: any): Promise<any> {
        if (options) {
            options = Object.assign({}, this.defaultOptions, options)
        }

        try {
            const result: any = await this.axios.get(path, options);
            return result.data;
        } catch (e: any) {
            console.error('Error on doGet :', {
                path: path,
                options: options
            }, e);
            this.handleErrorResponse(e);
        }
    }

    private async doPost(path: string, payload: any, options?: any): Promise<any> {
        if (options) {
            options = Object.assign({}, this.defaultOptions, options)
        }

        try {
            const result: any = await this.axios.post(path, payload, options);
            return result.data;
        } catch (e: any) {
            console.error('Error on doPost :', {
                path: path,
                options: options
            }, e);
            this.handleErrorResponse(e);
        }
    }

    private handleErrorResponse(e: any): void {

        throw new Error();
    }

    private addAuthTokenHeader(token: string, headers?: any): any {
        if (!headers || typeof headers !== 'object') {
            headers = {};
        }
        headers['Authorization'] = `Bearer ${token}`;
        return headers;
    }

    private addActionTokenHeader(token: string, headers?: any): any {
        if (!headers || typeof headers !== 'object') {
            headers = {};
        }
        headers['Action-Token'] = token;
        return headers;
    }

    private addOtpTokenHeader(token: string, headers?: any): any {
        if (!headers || typeof headers !== 'object') {
            headers = {};
        }
        headers['Otp-Token'] = token;
        return headers;
    }

    /**
     * ======================================
     *              CMS Services 
     * ======================================
     */

    /**
     * Authenicate and generate a token to access cms services
     * @param id 
     * @param pin 
     * @returns 
     */
    public async authenticate(id: string, pin: string): Promise<any> {
        return await this.doPost(ApiPath.USER_VERIFY_MPIN, { mobileNumber: id, pin: pin });
    }

    public async getActionToken(token: string, action: string): Promise<any> {
        let headers: any = this.addAuthTokenHeader(token);
        return await this.doPost('/', headers);
    }

    public async getOtpToken(id: string): Promise<any> {
        return await this.doPost('/', {});
    }

    /**
     * To get the active card balance
     * @param token 
     * @returns 
     */
    public async getBalance(token: string): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doGet(ApiPath.CARD_GET_BALANCE, { headers });
    }

    /**
     * To get the card's list of user
     * @param token 
     * @returns 
     */
    public async getDetails(token: string): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doGet(ApiPath.CARD_GET_DETAILS, { headers });
    }

    /**
     * To get the card list
     * @param token
     * @param status 
     * @returns 
     */
    public async getList(token: string, status?: string, type?: string): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        if (!status && !type) {
            return await this.doGet(ApiPath.CARD_GET_LIST, { headers });
        }
        return await this.doPost(ApiPath.CARD_GET_LIST, { status, type }, { headers });
    }

    /**
     * To get the card preferences of the user
     * @param token 
     * @returns 
     */
    public async getPreference(token: string): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doGet(ApiPath.CARD_GET_PREFERENCE, { headers });
    }

    /**
     * To set the card preferences of the user
     * @param payload body of user preferences
     * @returns 
     */
    public async setPreference(token: string, payload: any): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_SET_PREFERENCE, payload, { headers });
    }

    /**
     * To get the limit of the card
     * @param token 
     * @returns 
     */
    public async getLimit(token: string): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doGet(ApiPath.CARD_GET_LIMIT, { headers });
    }

    /**
     * To upgrade the limit of the card
     * @param token
     * @param limit payload
     * @returns 
     */
    public async upgradeLimit(token: string, payload: any): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_SET_LIMIT, payload, { headers });
    }

    /**
     * To get the cvv of the card
     * @param token
     * @returns 
     */
    public async getCvv(token: string, payload: {
        kitNo: string,
        expiryDate: string,
        dob: string
    }): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_GET_CVV, payload, { headers });
    }

    /**
     * To get the statement of the card
     * @param token
     * @param statement timeline specified in payload as from and to
     * @returns 
     */
    public async getStatement(token: string, payload: {
        stmt_month: string
    }): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_GET_STATEMENT, payload, { headers });
    }

    /**
     * To update the statement of the card
     * @param token
     * @param statement date payload
     * @returns 
     */
    public async updateStatementDate(token: string, payload: { stmtDate: number }): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_UPDATE_STATEMENT_DATE, payload, { headers });
    }

    /**
     * To get the transactions of the card
     * @param token
     * @param transaction payload
     * @returns 
     */
    public async getTransactions(token: string, payload: {
        fromDate: string,
        toDate: string
    }): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_GET_UNBILLED_TRANSACTIONS, payload, { headers });
    }

    /**
     * To request physical card approval
     * @param token
     * @param payload
     * @returns 
     */
    public async requestPhysicalCard(token: string, payload: any): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.REQUEST_PHYSICAL_CARD, payload, { headers });
    }

    /**
     * To get the due amount of the card
     * @param token
     * @returns 
     */
    public async getDue(token: string): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doGet(ApiPath.CARD_GET_DUE, { headers });
    }

    /**
     * To set the pin of the card
     * @param token
     * @param card pin payload
     * @returns 
     */
    public async setPin(token: string, payload: any): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_SET_PIN, payload, { headers });
    }

    /**
     * To get the billing dates list eligible for the user to update
     * @param token
     * @returns 
     */
    public async getBillingDates(token: string): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doGet(ApiPath.CARD_GET_BILLING_DATES, { headers });
    }

    /**
     * To get the card locked
     * @param token 
     * @returns 
     */
    public async lock(token: string, payload: {
        kitNo: string, reason: string
    }): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_LOCK, payload, { headers });
    }

    /**
     * To get the card unlocked which is locked
     * @param token 
     * @returns 
     */
    public async unlock(token: string, payload: {
        kitNo: string, reason: string
    }): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_UNLOCK, payload, { headers });
    }

    /**
     * To get the card blocked for the user
     * @param token 
     * @returns 
     */
    public async block(token: string, payload: {
        kitNo: string, reason: string
    }): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_BLOCK, payload, { headers });
    }


    /**
     * To reset the Mpin
     * @param token
     * @param Mpin payload 
     * @returns 
     */
    public async resetMpin(token: string, payload: any): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.RESET_MPIN, payload, { headers });
    }

    /**
     * To get the card closed for the user
     * @param token 
     * @returns 
     */
    public async close(token: string, payload: {
        reason: string
    }): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_CLOSE, payload, { headers });
    }

    /**
     * To get the card replaced for the user
     * @param token 
     * @returns 
     */
    public async replace(token: string, payload: {
        kitNo: string, reason: string
    }): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.CARD_REPLACE, payload, { headers });
    }

    /**
     * To get the EMI eligible transactions list
     * @param token
     * @returns 
     */
    public async getEmiEligibleTransactions(token: string): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doGet(ApiPath.LOAN_ELIGIBLE_EMI_TRANSACTIONS, { headers });
    }

    /**
     * To get the list of EMI converted transactions
     * @param token
     * @returns 
     */
    public async getEmiEligibleList(token: string): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doGet(ApiPath.LOAN_GET_LIST, { headers });
    }

    /**
     * To get the preview of details to convert into EMI
     * @param token
     * @param payload with id and amount to convert
     * @returns 
     */
    public async getEmiPreview(token: string, payload: {
        ruleId: string,
        requestType: string,
        transactions: [
            {
                extTxnId: string,
                amount: number
            }
        ]
    }): Promise<any> {
        const headers: any = this.addAuthTokenHeader(token);
        return await this.doPost(ApiPath.LOAN_PREVIEW, payload, { headers });
    }

    /**
     * To set the Cvv of the card
     * @param token 
     * @returns 
     */
    public async setCvv(token: string, actionToken: string): Promise<any> {
        let headers: any = this.addAuthTokenHeader(token);
        headers = this.addActionTokenHeader(actionToken, headers);
        return await this.doGet('/card/set/cvv', { headers });
    }
}