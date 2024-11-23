import { BindingScope, inject, injectable } from "@loopback/core";
import {
    HttpErrorCodes, HttpRequest, HttpRequestMethod, HttpService,
    ServiceError, Logger,
    ServiceErrorCodes,
    ErrorCode
} from "common-lib";
import axiosRetry from "axios-retry";
import {
    M2PCardApiGenerateCvvRequest, M2PCardApiGetBalanceRequest, M2PCardApiGetDueRequest,
    M2PCardApiGetLimitRequest, M2PCardApiGetListRequest, M2PCardApiGetPreferenceRequest,
    M2PCardApiGetStatementRequest, M2PCardApiGetUnbilledTransactionsRequest,
    M2PCardApiSetLimitRequest, M2PCardApiSetPinRequest, M2PCardApiSetPreferenceRequest,
    M2PCardApiUpdateStatementDateRequest, M2PCardApiUpgradeLimitRequest,
    M2PCardApiUnlockRequest, M2PCardApiReplaceRequest,
    M2PCardApiRepaymentRequest, M2PCardApiPhysicalRequest,
    M2PCardApiGetTransactionStatusRequest, M2PCardApiLockRequest,
    M2PCardApiCloseRequest, M2PCardApiRegisterUserRequest,
    M2PCardApiGetOutstandingRequest, M2PCardApiBlockRequest,
    M2PCardApiGetEMIEligibleTransactionRequest,
    M2PCardApiGetAllLoansRequest, M2PCardApiPreviewLoanRequest,
    M2PCardApiCreateLoanRequest, M2PCardApiGetTransactionByExternalIdRequest
} from "./m2p-card-api.request";
import {
    M2PAccountInfoRequest, M2PCardAddressInfoRequest, M2PCardCommunicatioInfoRequest,
    M2PCardCreditInfoRequest, M2PCardKitInfoRequest, M2PCardKycInfoRequest,
    M2PDateInfoRequest
} from "../../../../controllers/card/request/card-register-info.request";
import { M2PCardLimitConfigRequest } from "../../../../controllers/card/request/card-preference.request";
import { AxiosResponse } from "axios";
import { M2PEncryptDecryptService } from "../m2p-encrypt-decrypt.service";
import underscore from 'underscore';
import { Bindings } from "../../../../models/bindings";
import { AppConfig } from "../../../../models/config.model";
import { M2PCardApiFreezeRequest } from "./m2p-card-api.request";
import { LoanRequestType, Transaction } from "../../../../controllers";
import { CardLimitModel } from "../../../../models/model/api.model";
import { TransactionStatus } from "../../../../controllers/card/request/card-transactions.request";

@injectable({ scope: BindingScope.SINGLETON, tags: Bindings.Service.M2P_CARD_API_SERVICE })
export class M2PCardApiService extends HttpService {

    constructor(
        @inject(Bindings.Config.APP_CONFIG)
        private appConfig: AppConfig,
        @inject(Bindings.Service.M2P_ENCRYPT_DECRYPT_SERVICE)
        private m2pPEncryptDecryptService: M2PEncryptDecryptService) {
        super({
            useEncryption: true,
            defaults: {
                baseURL: appConfig.PARTNER_M2P_CARD_API_URL,
            }
        });

        if (appConfig.PARTNER_M2P_CARD_API_RETRIES) {
            axiosRetry(this.axiosInstance, {
                retries: appConfig.PARTNER_M2P_CARD_API_RETRIES,
                shouldResetTimeout: true
            });
        }
        // this.encrypt = this.appConfig.m2pConfig.cardApiConfig.encrypt;
        this.axiosInstance.defaults.headers.common['Authorization']
            = 'Bearer ' + appConfig.PARTNER_M2P_CARD_API_AUTHORIZATION;
        this.axiosInstance.defaults.headers.common['TENANT']
            = appConfig.PARTNER_M2P_CARD_API_TENANT_ID;
        this.axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
        this.axiosInstance.defaults.headers.post['Accept'] = 'text/plain, application/json';
        this.axiosInstance.defaults.timeout = appConfig.PARTNER_M2P_CARD_API_TIMEOUT;
    }

    protected override getRequestBody(request: HttpRequest) {
        if (request.method === HttpRequestMethod.Post) {
            const body: any = request.getBody();
            try {
                let data: any = body;
                // TODO: convert array to string if required
                if (typeof data === 'object') {
                    data = JSON.stringify(body);
                }
                return this.m2pPEncryptDecryptService.encryptRequestPayload(data,
                    this.appConfig.PARTNER_M2P_CARD_API_TENANT_ID);
            } catch (e: any) {
                Logger.error(request._requestId, 'M2PCardApiService.onSuccessResponse',
                    'm2p api response encryption error', e, body);
                new ServiceError(HttpErrorCodes.HTTP_REQUEST_ENCRYPTION_ERROR, e);
            }
        }

        return request.getBody();
    }

    protected override onSuccessResponse(request: HttpRequest,
        response: AxiosResponse<any, any>): any {
        console.log('onSuccessResponse............', response.status)
        let data: any;
        if (request.method === HttpRequestMethod.Post) {
            try {
                data = this.m2pPEncryptDecryptService.decryptResponseData(
                    response.data.headers.key, response.data.headers.entity,
                    response.data.body, response.data.headers.hash,
                    response.data.headers.refNo);
            } catch (e: any) {
                Logger.error(request._requestId, 'M2PCardApiService.onSuccessResponse',
                    'm2p api response decryption error', e, response.data);
                throw new ServiceError(HttpErrorCodes.HTTP_RESPONSE_DECRYPTION_ERROR, e);
            }
        } else {
            data = response.data;
        }
        console.log('onSuccessResponse..............', data)
        // data = (data && data.result) || (data && data.data);
        if (!data) {
            Logger.warn(request._requestId, 'M2PCardApiService.onSuccessResponse',
                'M2P response data not found', response);
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        // TODO - Remove this
        if (!underscore.isEmpty(data.exception)) {
            Logger.error(request._requestId, 'M2PCardApiService.onSuccessResponse',
                'M2P response data exception', undefined, data);
            throw new ServiceError(new ErrorCode(data.exception.errorCode,
                data.exception.shortMessage));
        }

        return data;
    }

    protected override onErrorResponse(request: HttpRequest, response: any): any {
        console.log('onErrorResponse............', response)
        if (response.status === 400) {
            if (!response.data) {
                throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
            }

            return response.data;
        }

        throw new ServiceError(ServiceErrorCodes.PARTNER_API_NOT_AVAILABLE, response.data);
    }

    /**
     * Verifies the response for any exceptions and handles them appropriately.
     * @param response 
     * @returns 
     */
    private checkForException(response: any): void {
        if (!response || !underscore.isEmpty(response.exception)) {
            throw new ServiceError(new ErrorCode(response.exception.errorCode,
                response.exception.shortMessage));
        }

        if (!underscore.isEmpty(response.result) && !underscore.isEmpty(response.exception)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_INVALID);
        }
    }

    /**
     * Verifies the response for any exceptions and handles them appropriately.
     * @param response 
     * @returns 
     */
    private isExceptionData(response: any): boolean {
        if (!response || !underscore.isEmpty(response.exception)) {
            return true;
        }

        return false;
    }

    private getServiceError(exception: any): ServiceError {
        throw new ServiceError(new ErrorCode(exception.errorCode, exception.shortMessage));
    }

    //-------------------------------------------------------------------------------------
    //   M2P API Calls
    //-------------------------------------------------------------------------------------

    /**
     * Retrieves a list of all available cards, returning an array of card objects.
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getList(requestId: string, entityId: string): Promise<any> {
        const request: M2PCardApiGetListRequest
            = new M2PCardApiGetListRequest(requestId);
        request.entityId = entityId;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (!underscore.isArray(response.result.cardList) || underscore.isEmpty(response.result.cardList)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * Retrieves the current balance for the specified account.
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getBalance(requestId: string, entityId: string): Promise<any> {
        const request: M2PCardApiGetBalanceRequest
            = new M2PCardApiGetBalanceRequest(requestId);
        request.entityId = entityId;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (!underscore.isArray(response.result) || underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * Retrieves a transaction based on the provided external transaction ID
     * @param requestId 
     * @param externalTransactionId 
     * @returns 
     */
    async getTransactionByExternalId(requestId: string, externalTransactionId: string): Promise<any> {
        const request: M2PCardApiGetTransactionByExternalIdRequest
            = new M2PCardApiGetTransactionByExternalIdRequest(requestId);
        request.externalTransactionId = externalTransactionId;

        let response: any = await this.call(request);

        response = this.checkForException(response);

        return response;
    }

    /**
     * Retrieves the list of unbilled transactions for a specified credit card.
     * @param requestId 
     * @param entityId 
     * @param pageNumber 
     * @param pageSize 
     * @returns 
     */
    async getUnbilledTransactions(requestId: string, entityId: string,
        pageNumber?: number, pageSize?: number): Promise<any> {
        const request: M2PCardApiGetUnbilledTransactionsRequest
            = new M2PCardApiGetUnbilledTransactionsRequest(requestId);
        request.entityId = entityId;
        request.pageNumber = 0;
        request.pageSize = 999;

        const response: any = await this.call(request);

        this.checkForException(response);

        if (!underscore.isArray(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response;
    }

    /**
     * Retrieves transactions within the provided date range (from and to)
     * @param requestId 
     * @param entityId 
     * @param fromDate 
     * @param toDate 
     * @param pageNumber 
     * @param pageSize 
     * @param status 
     * @returns 
     */
    async getTransactions(requestId: string, entityId: string, fromDate: string,
        toDate: string, status?: TransactionStatus, pageNumber?: number, pageSize?: number): Promise<any> {
        const request: M2PCardApiGetTransactionStatusRequest
            = new M2PCardApiGetTransactionStatusRequest(requestId);
        request.entityId = entityId;
        request.pageNumber = 0;
        request.pageSize = 999;
        request.fromDate = fromDate;
        request.toDate = toDate;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result) || !underscore.isArray(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response;
    }

    /**
     * Sets a new ATM PIN for the specified card
     * @param requestId 
     * @param entityId 
     * @param kitNo 
     * @param expiryDate 
     * @param dob 
     * @param pin 
     * @returns 
     */
    async setPin(requestId: string, entityId: string, kitNo: string,
        expiryDate: string, dob: string, pin: string): Promise<any> {
        const request: M2PCardApiSetPinRequest
            = new M2PCardApiSetPinRequest(requestId,
                this.appConfig.PARTNER_M2P_CARD_API_SET_PIN_ENCRYPTION_KEY);
        request.entityId = entityId;
        request.kitNo = kitNo;
        request.expiryDate = expiryDate;
        request.dob = dob;
        request.pin = pin;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (!response.result) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * Retrieves the CVV (Card Verification Value) number for the specified card. 
     * Use with caution, as this is sensitive information.
     * @param requestId 
     * @param entityId 
     * @param kitNo 
     * @param expiryDate 
     * @param dob 
     * @returns 
     */
    async getCvv(requestId: string, entityId: string, kitNo: string,
        expiryDate: string, dob: string): Promise<any> {
        const request: M2PCardApiGenerateCvvRequest
            = new M2PCardApiGenerateCvvRequest(requestId);
        request.entityId = entityId;
        request.kitNo = kitNo;
        request.expiryDate = expiryDate;
        request.dob = dob.split('-').join('');

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * Retrieves the credit limit of the specified card.
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getLimit(requestId: string, entityId: string): Promise<CardLimitModel> {
        const request: M2PCardApiGetLimitRequest
            = new M2PCardApiGetLimitRequest(requestId);
        request.entityId = entityId;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * Sets a new credit limit for the specified credit card.
     * @param requestId 
     * @param entityId 
     * @param amount 
     * @returns 
     */
    async setLimit(requestId: string, entityId: string, amount: number): Promise<any> {
        const request: M2PCardApiSetLimitRequest
            = new M2PCardApiSetLimitRequest(requestId);
        request.entityId = entityId;
        request.amount = amount;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (!underscore.isBoolean(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * To upgrade the limit assigned to customer.
     * @param requestId 
     * @param entityId 
     * @param amount 
     * @returns 
     */
    async upgradeLimit(requestId: string, entityId: string, amount: number): Promise<any> {
        const request: M2PCardApiUpgradeLimitRequest
            = new M2PCardApiUpgradeLimitRequest(requestId);
        request.entityId = entityId;
        request.amount = amount;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (!underscore.isBoolean(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * Retrieves the preferences for the specified card, including user-defined settings and configurations.
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getPreference(requestId: string, entityId: string): Promise<any> {
        const request: M2PCardApiGetPreferenceRequest
            = new M2PCardApiGetPreferenceRequest(requestId);
        request.entityId = entityId;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * Sets preferences for the specified card according to the provided settings.
     * @param requestId 
     * @param entityId 
     * @param limitConfigs 
     * @param atm 
     * @param contactless 
     * @param ecom 
     * @param international 
     * @param pos 
     * @returns 
     */
    async setPreference(requestId: string, entityId: string, transactionType: 'DOMESTIC' | 'INTERNATIONAL',
        limitConfigs: M2PCardLimitConfigRequest[],
        atm: boolean, contactless: boolean, ecom: boolean,
        international: boolean, pos: boolean): Promise<any> {
        const request: M2PCardApiSetPreferenceRequest
            = new M2PCardApiSetPreferenceRequest(requestId);
        request.entityId = entityId;
        request.transactionUsageType = transactionType;
        request.limitConfigs = limitConfigs;
        request.atm = atm;
        request.contactless = contactless;
        request.ecom = ecom;
        request.international = international;
        request.pos = pos;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (!underscore.isBoolean(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * This API is used to fetch Statement Data for a customer/card for a particular month.
     * @param requestId 
     * @param entityId 
     * @param statementMonthYear 
     * @returns 
     */
    async getStatement(requestId: string, entityId: string,
        statementMonthYear: string): Promise<any> {
        const request: M2PCardApiGetStatementRequest
            = new M2PCardApiGetStatementRequest(requestId);
        request.entityId = entityId;
        request.statementMonthYear = statementMonthYear;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (!response.result.transactionList || underscore.isEmpty(response.result.stmtCustomerMapping)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * 
     * This API is used to update the statement date for a given customer. 
     * As per RBI regulations, the customer can now choose to opt for his / her 
     * own statement dates provided that there are multiple statement dates 
     * available in the program and all outstanding dues are cleared.
     * @param requestId 
     * @param entityId 
     * @param statementDate 
     * @returns 
     */
    async updateStatementDate(requestId: string, entityId: string,
        statementDate: string): Promise<any> {
        const request: M2PCardApiUpdateStatementDateRequest
            = new M2PCardApiUpdateStatementDateRequest(requestId);
        request.entityId = entityId;
        request.statementDate = statementDate;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (!underscore.isBoolean(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * This API is used to fetch the dues against a credit card/ line, both billed and unbilled. 
     * a. Payments made parameter will return the total payments received in the current billing cycle. 
     * b. Total outstanding will include both billed and unbilled amount. 
     * c. If the customer has changed a billing cycle, 'next statement date' parameter can be used to depict to customer. 
     * d. Posted EMI field will return the total EMIs (Principal+Interest) posted to credit card/ line.
     * e. Unpaid total due can be used to display bill status.
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getDue(requestId: string, entityId: string): Promise<any> {
        const request: M2PCardApiGetDueRequest
            = new M2PCardApiGetDueRequest(requestId);
        request.entityId = entityId;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * This API is used to lock the card.
     * Locks the specified credit card, preventing any further transactions.
     * @param requestId 
     * @param entityId 
     * @param reason 
     * @param kitNo 
     * @returns 
     */
    async lock(requestId: string, entityId: string, reason: string, kitNo: string): Promise<any> {
        const request: M2PCardApiLockRequest
            = new M2PCardApiLockRequest(requestId);
        request.entityId = entityId;
        request.reason = reason;
        request.kitNo = kitNo;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * This API is used to unlock the card.
     * Unlocks the specified card, allowing transactions to proceed
     * @param requestId 
     * @param entityId 
     * @param reason 
     * @param kitNo 
     * @returns 
     */
    async unlock(requestId: string, entityId: string, reason: string, kitNo: string): Promise<any> {
        const request: M2PCardApiUnlockRequest
            = new M2PCardApiUnlockRequest(requestId);
        request.entityId = entityId;
        request.reason = reason;
        request.kitNo = kitNo;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * Issues a replacement for the specified card, providing a new card with updated information.
     * The existing card is blocked and a new kit is assigned to the used . 
     * Card dispatch is done post this in case the program uses a physical card.
     * @param requestId 
     * @param entityId 
     * @param newKitNo 
     * @param oldKitNo 
     * @returns 
     */
    async replace(requestId: string, entityId: string,
        newKitNo: string, oldKitNo: string, businessType?: string): Promise<any> {
        const request: M2PCardApiReplaceRequest
            = new M2PCardApiReplaceRequest(requestId);
        request.entityId = entityId;
        request.newKitNo = newKitNo;
        request.oldKitNo = oldKitNo;
        request.businessType = businessType;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * Rrequest to generate a physical card by assigning a kit to the customer.
     * It takes in the input required for processing such as customer's address, 
     * card's default preferences at the time of delivery , credit limit , cash limit etc.
     * @param requestId 
     * @param entityId 
     * @param kitNo 
     * @param addressDto 
     * @returns 
     */
    async requestPhysicalCard(requestId: string, entityId: string,
        kitNo: string, addressDto: any): Promise<any> {
        const request: M2PCardApiPhysicalRequest
            = new M2PCardApiPhysicalRequest(requestId);
        request.entityId = entityId;
        request.kitNo = kitNo;
        request.addressDto = addressDto;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * Based on the configured loan products, the fetch transactions API returns 
     * an additional parameters which flags if a Transaction is eligible for EMI 
     * conversion along with the loan product id/rule id under which it got eligible. 
     * It covers both single and group EMI feature.
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getEmiEligibleTransactions(requestId: string, entityId: string): Promise<any> {
        const request: M2PCardApiGetEMIEligibleTransactionRequest
            = new M2PCardApiGetEMIEligibleTransactionRequest(requestId);
        request.entityId = entityId;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (!underscore.isArray(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getAllLoans(requestId: string, entityId: string): Promise<any> {
        const request: M2PCardApiGetAllLoansRequest
            = new M2PCardApiGetAllLoansRequest(requestId);
        request.entityId = entityId;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response;
    }

    /**
     * This API will be used to fetch the loan schedule for the proposed loan. 
     * Request will need the rule id obtained in Fetch Transactions 
     * API(fetch eligible transactions) and corresponding transaction id(original transaction). 
     * The API returns the loan amortisation/repayment schedule for all possible tenures. 
     * The information in the API is recommended to be displayed to borrower(s) 
     * and necessary consent is to be obtained before initiating loan booking.
     * @param requestId 
     * @param entityId 
     * @param ruleId 
     * @param loanRequestType 
     * @param transactions 
     * @returns 
     */
    async previewLoan(requestId: string, entityId: string, ruleId: string,
        loanRequestType: LoanRequestType, transactions: Transaction[]): Promise<any> {
        const request: M2PCardApiPreviewLoanRequest
            = new M2PCardApiPreviewLoanRequest(requestId);
        request.entityId = entityId;
        request.ruleId = ruleId;
        request.loanRequestType = loanRequestType;
        request.transactions = transactions;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param tenure 
     * @param loanRequestId 
     * @returns 
     */
    async createLoan(requestId: string, entityId: string,
        tenure: string, loanRequestId: string): Promise<any> {
        const request: M2PCardApiCreateLoanRequest
            = new M2PCardApiCreateLoanRequest(requestId);
        request.entityId = entityId;
        request.tenure = tenure;
        request.loanRequestId = loanRequestId;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * This API is used to process payments made by customer to the credit card/ line. 
     * Once processed successfully, OTB limit will be released instantly for the customer. 
     * Partner should avoid multiple API calls which will result in multiple payments being processed. 
     * Before reinitiating a request, notification status can be checked or even use the 
     * fetch due API to validate dues. The API is agnostic and hence can be used to process payments. 
     * Payments received through PG, SI based auto-debit, 
     * bulk clearances and cash deposits can be notified to M2P using this API.
     * @param requestId 
     * @param entityId 
     * @param businessEntityId 
     * @param business 
     * @param amount 
     * @param transactionType 
     * @param transactionOrigin 
     * @param productId 
     * @param externalTransactionId 
     * @param description 
     * @param otherPartyId 
     * @param otherPartyName 
     * @returns 
     */
    async repayment(requestId: string, entityId: string, businessEntityId: string,
        business: string, amount: string, transactionType: string, transactionOrigin: string,
        productId: string, externalTransactionId: string, description: string,
        otherPartyId: string, otherPartyName: string): Promise<any> {
        const request: M2PCardApiRepaymentRequest
            = new M2PCardApiRepaymentRequest(requestId);
        request.entityId = entityId;
        request.businessEntityId = businessEntityId;
        request.business = business;
        request.amount = amount;
        request.transactionType = transactionType;
        request.transactionOrigin = transactionOrigin;
        request.productId = productId;
        request.externalTransactionId = externalTransactionId;
        request.description = description;
        request.otherPartyId = otherPartyId;
        request.otherPartyName = otherPartyName;

        let response: any = await this.call(request);

        this.checkForException(response);

        return response.result;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param entityType 
     * @param entityCategory 
     * @param businessId 
     * @param customerId 
     * @param title 
     * @param firstName 
     * @param middleName 
     * @param lastName 
     * @param gender 
     * @param isNRICustomer 
     * @param isMinor 
     * @param isDependant 
     * @param maritalStatus 
     * @param employmentIndustry 
     * @param employmentType 
     * @param businessType 
     * @param cardOpenDate 
     * @param kitInfo 
     * @param addressInfo 
     * @param communicationInfo 
     * @param accountInfo 
     * @param kycInfo 
     * @param dateInfo 
     * @param creditInfo 
     * @returns 
     */
    async register(requestId: string, entityId: string, entityType: string, entityCategory: string, businessId: string,
        customerId: string, title: string, firstName: string, middleName: string,
        lastName: string, gender: string, isNRICustomer: boolean, isMinor: boolean,
        isDependant: boolean, maritalStatus: string, employmentIndustry: string,
        employmentType: string, businessType: string, cardOpenDate: string,
        kitInfo: M2PCardKitInfoRequest, addressInfo: M2PCardAddressInfoRequest,
        communicationInfo: M2PCardCommunicatioInfoRequest, accountInfo: M2PAccountInfoRequest,
        kycInfo: M2PCardKycInfoRequest, dateInfo: M2PDateInfoRequest, creditInfo: M2PCardCreditInfoRequest): Promise<any> {
        const request: M2PCardApiRegisterUserRequest
            = new M2PCardApiRegisterUserRequest(requestId);
        request.entityId = entityId,
            request.entityType = entityType,
            request.entityCategory = entityCategory,
            request.businessId = businessId,
            request.customerId = customerId,
            request.title = title,
            request.firstName = firstName,
            request.middleName = middleName,
            request.lastName = lastName,
            request.gender = gender,
            request.isNRICustomer = isNRICustomer,
            request.isMinor = isMinor,
            request.isDependant = isDependant,
            request.maritalStatus = maritalStatus,
            request.employmentIndustry = employmentIndustry,
            request.employmentType = employmentType,
            request.businessType = businessType,
            request.cardOpenDate = cardOpenDate,
            request.kitInfo = kitInfo,
            request.addressInfo = addressInfo,
            request.communicationInfo = communicationInfo,
            request.accountInfo = accountInfo,
            request.kycInfo = kycInfo,
            request.dateInfo = dateInfo,
            request.creditInfo = creditInfo

        let response: any = await this.call(request);

        this.checkForException(response);

        return response.result;
    }

    /**
     * This API is used to block the card. It is important to note ‘BL’ will permanently block the card, 
     * and the customer must be issued another card for further account/ line utilisation.
     * @param requestId 
     * @param entityId 
     * @param reason 
     * @param kitNo 
     * @returns 
     */
    async block(requestId: string, entityId: string, reason: string, kitNo: string): Promise<any> {
        const request: M2PCardApiBlockRequest
            = new M2PCardApiBlockRequest(requestId);
        request.entityId = entityId;
        request.reason = reason;
        request.kitNo = kitNo;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }

    /**
     * This API is invoked to place a permanent irreversible block on the card so as to prevent 
     * any further financial (debit) or non-financial (replacement/renewal) transactions.
     * @param requestId 
     * @param entityId 
     * @param reason 
     * @returns 
     */
    async freeze(requestId: string, entityId: string, reason?: string): Promise<any> {
        const request: M2PCardApiFreezeRequest
            = new M2PCardApiFreezeRequest(requestId);
        request.entityId = entityId;
        request.reason = reason;

        let response: any = await this.call(request);

        this.checkForException(response);

        return response.result;
    }

    /**
     * This API is used to close the card account/credit line and mark the 
     * Customer Entity as "Surrendered". In the case of secured cards, the 
     * collateral associated with the crd account needs to be closed before 
     * the card account can be closed subject to bank policy. 
     * There should not be any outstanding on the card at the time of closure.
     * @param requestId 
     * @param entityId 
     * @param reason
     * @returns 
     */
    async close(requestId: string, entityId: string, reason?: string): Promise<any> {
        const request: M2PCardApiCloseRequest
            = new M2PCardApiCloseRequest(requestId);
        request.entityId = entityId;
        request.reason = reason;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (!underscore.isBoolean(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }


    /**
     * This API returns the outstanding on a card account that includes 
     * billed (including disputed) transactions, unbilled & unsettled transactions, 
     * unposted EMIs for loans availed on card, unposted interest on EMIs,
     * unposted charges and rewards available for redemption.
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getOutstanding(requestId: string, entityId: string): Promise<any> {
        const request: M2PCardApiGetOutstandingRequest
            = new M2PCardApiGetOutstandingRequest(requestId);
        request.entityId = entityId;

        let response: any = await this.call(request);

        this.checkForException(response);

        if (underscore.isEmpty(response.result)) {
            throw new ServiceError(ServiceErrorCodes.PARTNER_DATA_NOT_FOUND);
        }

        return response.result;
    }
}