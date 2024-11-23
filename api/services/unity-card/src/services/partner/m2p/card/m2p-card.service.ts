import { BindingScope, inject, injectable } from "@loopback/core";
import { M2PCardApiService } from "./m2p-card-api.service";
import underscore from "underscore";
import {
    M2PCardGetTransactionsRequest
} from "../../../../controllers/card/request/card-transactions.request";
import { M2PCardSetPinRequest } from "../../../../controllers/card/request/card-pin.request";
import { M2PCardGetCvvRequest } from "../../../../controllers/card/request/card-cvv.request";
import { M2PCardBlockRequest, M2PCardLockUnLockRequest } from "../../../../controllers/card/request/card-lock-unlock.request";
import { M2PCardReplaceRequest } from "../../../../controllers/card/request/card-replace.request";
import { M2PCardRepaymentRequest } from "../../../../controllers/card/request/card-payment.request";
import { M2PCardPhysicalRequest } from "../../../../controllers/card/request/card-physical.request";
import { M2PCardRegisterRequest } from "../../../../controllers/card/request/card-m2p-register.request";
import { M2PCardSetPreferncesRequest } from "../../../../controllers/card/request/card-preference.request";
import { Bindings } from "../../../../models/bindings";
import { repository } from "@loopback/repository";
import { ErrorCode, Logger, RandomUtil, ServiceError } from "common-lib";
import { Transaction } from "../../../../controllers";
import { LoanRequestType } from "../../../../controllers";
import _ from "underscore";
import moment from "moment";
import { StatementEntityPaymentStatus } from "../../../../models/entity/statement.entity";
import { CardBalanceModel, CardLimitModel, CardModel } from "../../../../models/model/api.model";
import { AuthCardSessionPayload, CardSessionPayload } from "../../../../models/config.model";
import { CardStatementPayloadRepository } from "../../../../repositories/card-statement-payload.repository";
import { CardStatementPayloadEntity } from "../../../../models/entity/card-statement-payload.entity";
import { M2PCardEntityUtil } from "./m2p-card.util";
import { CardApiMessages, CardStatementModel, CardType, CardDetailsModel, StatusResultModel, CardTransactionModel } from "./card.model";
import { M2PCardStatus } from "./m2p-card.model";
import { M2PConfig } from "./m2p-card-api.config";
import { CardErrorCode } from "../../../card/card.model";

@injectable({ scope: BindingScope.SINGLETON, tags: Bindings.Service.M2P_CARD_SERVICE })
export class M2PCardService {

    constructor(
        @repository(CardStatementPayloadRepository)
        private cardStatementPayloadRepository: CardStatementPayloadRepository,
        @inject(Bindings.Service.M2P_CARD_API_SERVICE)
        private m2pCardApiService: M2PCardApiService) {
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getDetails(requestId: string, entityId: string): Promise<CardDetailsModel> {
        const result: any = await this.m2pCardApiService.getList(requestId, entityId);

        let cards: CardModel[] = await result.cardList.map((item: any) => {
            return <CardModel>{
                id: '',
                kitNo: item.kitNo,
                cardNo: item.cardNo,
                partialCardNo: (item.cardNo).slice(-4),
                isPinSetup: item.isPinSet === 'true' ? true : false,
                type: item.cardType,
                networkType: item.networkType,
                status: item.status,
                expiryDate: item.expiryDate,
                issueDate: item.cardIssueDate &&
                    moment(item.cardIssueDate, moment.ISO_8601, true).isValid() ?
                    moment(item.cardIssueDate).format('YYYY-MM-DD') : null
            }
        });

        cards = underscore.filter(cards, (card: CardModel) => {
            return card.status !== 'REPLACED';
        });

        cards = underscore.sortBy(underscore.sortBy(cards, 'issueDate'), 'status');
        // TODO - Question 

        if (underscore.isEmpty(cards)) {
            Logger.warn(requestId, 'M2PCardService.getDetails', 'card not found', result);
            throw new ServiceError(CardErrorCode.CARD_NOT_FOUND);
        }

        return <CardDetailsModel>{
            card: cards[0],
            customer: {
                name: result.name,
                dob: result.dob
            }
        };
    }

    /**
     * 
     * @param cardSessionPayload 
     * @param status 
     * @param type 
     * @returns 
     */
    async getList(cardSessionPayload: CardSessionPayload, status?: M2PCardStatus,
        type?: CardType): Promise<CardModel[]> {
        const result: any = await this.m2pCardApiService.getList(
            cardSessionPayload.requestId, cardSessionPayload.partnerCifNo);

        // TODO - can remoce status and type filter and can be (status !== 'REPLACED')
        const cardList: any[] = underscore.filter(result.cardList, (item: any) => {
            return ((status) ? item.status === status : true) &&
                ((type) ? item.cardType === type : true);
        });

        const data: CardModel[] = underscore.map(cardList, (item: any) => {
            return <CardModel>{
                kitNo: item.kitNo,
                cardNo: item.cardNo,
                partialCardNo: (item.cardNo).slice(-4),
                isPinSetup: item.isPinSet === 'true' ? true : false,
                type: item.cardType,
                networkType: item.networkType,
                status: item.status,
                expiryDate: item.expiryDate,
                issueDate: item.cardIssueDate &&
                    moment(item.cardIssueDate, moment.ISO_8601, true).isValid() ?
                    moment(item.cardIssueDate).format('YYYY-MM-DD') : null
            };
        });

        return data;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getBalance(requestId: string, entityId: string): Promise<CardBalanceModel> {
        const result: any = await this.m2pCardApiService.getBalance(requestId, entityId);
        let list: CardBalanceModel[] = await result.map((item: any) => {
            return <CardBalanceModel>{
                productId: item.productId,
                balanceAmount: item.balance,
                lienBalanceAmount: item.lienBalance
            };
        });

        if (underscore.isEmpty(list)) {
            Logger.warn(requestId, 'M2PCardService.getBalance', 'card balance found', result);
            throw new ServiceError(CardErrorCode.BALANC_NOT_FOUND);
        }

        return list[0];
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param data 
     * @returns 
     */
    async getTransactions(requestId: string, entityId: string,
        data: M2PCardGetTransactionsRequest): Promise<CardTransactionModel[]> {
        let result: any = await this.m2pCardApiService.getTransactions(requestId, entityId,
            data.fromDate, data.toDate, data.status);

        result = result.result;

        let transactions: CardTransactionModel[] = result.map((item: any) => {
            let description: string = (
                underscore.isEmpty(item.merchantName) === false &&
                underscore.isEmpty(item.txndescription) === false
            ) ? item.txndescription + " - " + item.merchantName :
                item.txndescription || item.merchantName || item.txnSubCategory;

            if (item.txnCategory === 'FEES' ||
                item.txnCategory === 'SERVICETAX' ||
                item.txnSubCategory === 'REWARDS_CASHBACK') {
                description = item.txnSubCategory;
            }

            const datetime: string = moment.unix(item.transactionDate / 1000).format('YYYY-MM-DD HH:mm:ss');
            const [date, time] = datetime.split(' ');

            return <CardTransactionModel>{
                id: '',
                amount: item.amount,
                date: date,
                time: time,
                datetime: item.transactionDate,
                externalId: item.extTxnId,
                internalId: item.intTxnId,
                origin: item.txnOrigin,
                billedStatus: item.billedStatus,
                authorizationStatus: item.authorizationStatus,
                kitNo: item.kitNo,
                postTransactionLimit: item.afterTransactionLimit,
                description: description,
                merchantId: item.merchantId,
                merchantName: item.merchantName,
                merchantLocation: item.merchantLocation,
                type: item.crDr === 'CR' ? 'CREDIT' : 'DEBIT',
                category: item.txnCategory,
                subCategory: item.txnSubCategory,
                universalCurrencyAmount: item.univCrncyAmt
            };
        });

        if (data.status) {
            transactions = transactions.filter((transaction: any) => {
                return transaction.billedStatus === data.status;
            });
        }
        transactions = underscore.sortBy(transactions, 'datetime').reverse();

        return transactions;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getUnbilledTransactions(requestId: string, entityId: string): Promise<any> {
        let result: any = await this.m2pCardApiService.getUnbilledTransactions(requestId, entityId);

        result = result.result;

        let transactions: any[] = result.map((item: any) => {
            let description: string = (
                underscore.isEmpty(item.merchantName) === false &&
                underscore.isEmpty(item.txndescription) === false
            ) ? item.txndescription + " - " + item.merchantName :
                item.txndescription || item.merchantName || item.txnSubCategory;

            if (item.txnCategory === 'FEES' ||
                item.txnCategory === 'SERVICETAX' ||
                item.txnSubCategory === 'REWARDS_CASHBACK') {
                description = item.txnSubCategory;
            }

            const datetime: string = moment.unix(item.transactionDate / 1000).format('YYYY-MM-DD HH:mm:ss');
            const [date, time] = datetime.split(' ');

            return <CardTransactionModel>{
                id: '',
                amount: item.amount,
                date: date,
                time: time,
                datetime: item.transactionDate,
                externalId: item.extTxnId,
                internalId: item.intTxnId,
                origin: item.txnOrigin,
                billedStatus: item.billedStatus,
                authorizationStatus: item.authorizationStatus,
                kitNo: item.kitNo,
                postTransactionLimit: item.afterTransactionLimit,
                description: description,
                merchantId: item.merchantId,
                merchantName: item.merchantName,
                merchantLocation: item.merchantLocation,
                type: item.crDr === 'CR' ? 'CREDIT' : 'DEBIT',
                category: item.txnCategory,
                subCategory: item.txnSubCategory,
                universalCurrencyAmount: item.univCrncyAmt
            };
        });

        transactions = underscore.sortBy(transactions, 'date').reverse();

        return transactions;
    }

    /**
     * 
     * @param requestId 
     * @param entityId
     * @param externalTransactionId 
     * @returns 
     */
    async getTransactionByExternalId(requestId: string, externalTransactionId: string): Promise<any> {
        let result: any = await this.m2pCardApiService
            .getTransactionByExternalId(requestId, externalTransactionId);

        return result;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param data 
     * @returns 
     */
    async setPin(requestId: string, entityId: string,
        data: M2PCardSetPinRequest): Promise<any> {
        const result: any = await this.m2pCardApiService.setPin(requestId, entityId,
            data.kitNo, data.expiryDate, data.dob, data.pin);

        return result;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param data 
     * @returns 
     */
    async getCvv(requestId: string, entityId: string,
        data: M2PCardGetCvvRequest): Promise<any> {
        const result: any = await this.m2pCardApiService.getCvv(requestId, entityId,
            data.kitNo, data.expiryDate, data.dob);

        return result;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getLimit(requestId: string, entityId: string): Promise<CardLimitModel> {
        const result: any = await this.m2pCardApiService.getLimit(requestId, entityId);

        const data: CardLimitModel = {
            totalLimit: result.limitActual,
            availableLimit: result.limitAvailable,
            utilizedLimit: result.limitUtilized,
            purchaseLimit: result.purchaseLimit,
            cashLimit: result.cashLimit,
            creditBalance: result.creditBalance
        };

        return data;
    }

    /**
     * To set the credit limit for a customer/card.
     * @param requestId 
     * @param entityId 
     * @param amount 
     * @returns 
     */
    async setLimit(requestId: string, entityId: string, amount: number): Promise<StatusResultModel> {
        const result: any = await this.m2pCardApiService
            .setLimit(requestId, entityId, amount);

        return <StatusResultModel>{ status: result };
    }

    /**
     * To upgrade the limit assigned to customer. 
     * @param requestId 
     * @param entityId 
     * @param amount 
     * @returns 
     */
    async upgradeLimit(requestId: string, entityId: string, amount: number):
        Promise<StatusResultModel> {
        const result: any = await this.m2pCardApiService.
            upgradeLimit(requestId, entityId, amount);

        return <StatusResultModel>{ status: result };
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getPreference(requestId: string, entityId: string): Promise<any> {
        const result: any = await this.m2pCardApiService
            .getPreference(requestId, entityId);

        const data: any = {
            domestic: {
                atm: result.atm,
                ecom: result.ecom,
                pos: result.pos,
                contactless: result.contactless,
                international: result.international,
                limitConfig: result.limitConfig
            }
        };
        if (!underscore.isEmpty(result.internationalPreference)) {
            data.international = {
                atm: result.internationalPreference.atm,
                ecom: result.internationalPreference.ecom,
                pos: result.internationalPreference.pos,
                contactless: result.internationalPreference.contactless,
                international: result.internationalPreference.international,
                limitConfig: result.internationalPreference.limitConfig
            }
        }

        return data;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param request 
     * @returns 
     */
    async setPreference(requestId: string, entityId: string,
        request: M2PCardSetPreferncesRequest): Promise<any> {
        const result: any = {};
        if (request.domestic) {
            result.domestic = await this.m2pCardApiService.setPreference(requestId, entityId, 'DOMESTIC',
                request.domestic.limitConfigs, request.domestic.atm, request.domestic.contactless,
                request.domestic.ecom, request.domestic.international, request.domestic.pos);
        }

        if (request.international) {
            result.international = await this.m2pCardApiService.setPreference(requestId, entityId, 'INTERNATIONAL',
                request.international.limitConfigs, request.international.atm, request.international.contactless,
                request.international.ecom, request.international.international, request.international.pos);
        }

        return result;
    }

    /**
     * 
     * @param cardSessionPayload 
     * @param statementMonthYear 
     * @returns 
     */
    async getStatement(cardSessionPayload: CardSessionPayload,
        statementMonthYear: string): Promise<CardStatementModel> {
        try {
            let cardStatementPayloadEntity: CardStatementPayloadEntity | null = await this.cardStatementPayloadRepository
                .getCardStatementPayload(cardSessionPayload.userPartnerId, statementMonthYear);
            if (cardStatementPayloadEntity !== null) {
                if (cardStatementPayloadEntity.payload.paymentStatus === StatementEntityPaymentStatus.UNPAID) {
                    const result: any = await this.m2pCardApiService.getStatement(cardSessionPayload.requestId,
                        cardSessionPayload.partnerCifNo, statementMonthYear);

                    if (result.stmtCustomerMapping.paymentStatus === StatementEntityPaymentStatus.PAID) {
                        cardStatementPayloadEntity.payload.paymentStatus = StatementEntityPaymentStatus.PAID;
                        const updated: boolean = await this.cardStatementPayloadRepository
                            .updateCardStatementPayload(cardStatementPayloadEntity.statementId, cardStatementPayloadEntity);

                        Logger.info(cardSessionPayload.requestId, 'M2PCardService.getStatement', 'statement status updated to \'PAID\'',
                            { statementId: cardStatementPayloadEntity.statementId })
                    }
                }
                return M2PCardEntityUtil.getCardStatementModel(cardStatementPayloadEntity);
            } else {
                const result: any = await this.m2pCardApiService.getStatement(cardSessionPayload.requestId,
                    cardSessionPayload.partnerCifNo, statementMonthYear);
                underscore.forEach(result.transactionList, (transaction: any) => { transaction.id = RandomUtil.uuid() });
                cardStatementPayloadEntity = await this.cardStatementPayloadRepository
                    .createCardStatementPayload(cardSessionPayload.userPartnerId, statementMonthYear, result);

                return M2PCardEntityUtil.getCardStatementModel(cardStatementPayloadEntity);
            }
        } catch (e: any) {
            if (e instanceof ServiceError) {
                throw e;
            }
            throw new ServiceError(new ErrorCode('12345', ''));
        }
    }

    async getPreviousStatements(cardSessionPayload: CardSessionPayload,
        statementMonthYear: string): Promise<CardStatementModel[]> {
        let statements: CardStatementModel[] = [];
        try {
            let entities: CardStatementPayloadEntity[] = await this.cardStatementPayloadRepository
                .getCardPreviousStatementsPayload(cardSessionPayload.userPartnerId, statementMonthYear);
                console.log(entities)
            statements = underscore.map(entities, (entity: CardStatementPayloadEntity) => {
                return M2PCardEntityUtil.getCardStatementModel(entity);
            });

        } catch (e: any) { console.log(e)}

        return statements;
    }

    /**
     * Update's the statement date for a given customer.     * 
     * @param requestId 
     * @param entityId 
     * @param statementDate 
     * @returns 
     */
    async updateStatementDate(requestId: string, entityId: string,
        statementDate: string): Promise<StatusResultModel> {
        const result: any = await this.m2pCardApiService
            .updateStatementDate(requestId, entityId, statementDate);

        return <StatusResultModel>{
            status: result,
            message: CardApiMessages.STATEMENT_DATE_UPDATED_SUCCESSFULLY
        };
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getDue(requestId: string, entityId: string): Promise<any> {
        const result: any = await this.m2pCardApiService.getDue(requestId, entityId);

        return result;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param data 
     * @returns 
     */
    async lock(requestId: string, entityId: string,
        data: M2PCardLockUnLockRequest): Promise<StatusResultModel> {
        const result: any = await this.m2pCardApiService
            .lock(requestId, entityId, data.reason, data.kitNo);
        // TODO: update db
        return <StatusResultModel>{
            status: result === 'success',
            message: CardApiMessages.LOCKED_SUCCESSFULLY
        };
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param data 
     * @returns 
     */
    async unlock(requestId: string, entityId: string,
        data: M2PCardLockUnLockRequest): Promise<StatusResultModel> {
        const result: any = await this.m2pCardApiService
            .unlock(requestId, entityId, data.reason, data.kitNo);
        // TODO: update db
        return <StatusResultModel>{
            status: result === 'success',
            message: CardApiMessages.UNLOCKED_SUCCESSFULLY
        };
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param data 
     * @returns 
     */
    async block(requestId: string, entityId: string,
        data: M2PCardBlockRequest): Promise<StatusResultModel> {
        // const result: any = await this.m2pCardApiService
        //     .block(requestId, entityId, data.reason, data.kitNo);
        // TODO: update db
        return <StatusResultModel>{
            status: true, // result === 'success',
            message: CardApiMessages.BLOCKED_SUCCESSFULLY
        };
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param data 
     * @returns 
     */
    async replace(requestId: string, entityId: string,
        data: M2PCardReplaceRequest): Promise<StatusResultModel> {
        const result: any = await this.m2pCardApiService.replace(requestId, entityId, data.newKitNo, data.oldKitNo);
        // TODO: update db
        return <StatusResultModel>{
            status: result === 'success',
            message: CardApiMessages.REPLACED_SUCCESSFULLY
        };
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param data 
     * @returns 
     */
    async requestPhysicalCard(requestId: string, entityId: string,
        data: M2PCardPhysicalRequest): Promise<StatusResultModel> {
        const result: any = await this.m2pCardApiService
            .requestPhysicalCard(requestId, entityId, data.kitNo, data.addressDto);
        // TODO: update db
        return <StatusResultModel>{
            status: result,
            message: CardApiMessages.PHYSICAL_CARD_REQUEST_PLACED_SUCCESSFULLY
        };
    }

    /**
     * Retrieves a list of transactions that are eligible for conversion to EMI (Equated Monthly Installments)
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getEmiEligibleTransactions(requestId: string, entityId: string): Promise<any> {
        const result: any = await this.m2pCardApiService
            .getEmiEligibleTransactions(requestId, entityId);

        return result.result
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     */
    async getAllLoans(requestId: string, entityId: string): Promise<any> {
        const result: any = await this.m2pCardApiService
            .getAllLoans(requestId, entityId);

        return result.result;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param ruleId 
     * @param loanRequestType 
     * @param transactions 
     * @returns 
     */
    async previewLoan(requestId: string, entityId: string, ruleId: string,
        loanRequestType: LoanRequestType, transactions: Transaction[]): Promise<any> {
        const result: any = await this.m2pCardApiService
            .previewLoan(requestId, entityId, ruleId,
                loanRequestType, transactions);

        return result;
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
        const result: any = await this.m2pCardApiService
            .createLoan(requestId, entityId, tenure, loanRequestId);

        return result;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param data 
     * @returns 
     */
    async repayment(requestId: string, entityId: string, data: M2PCardRepaymentRequest): Promise<any> {
        const result: any = await this.m2pCardApiService
            .repayment(requestId, entityId, data.businessEntityId,
                data.business, data.amount, data.transactionType, data.transactionOrigin,
                data.productId, data.externalTransactionId, data.description,
                data.otherPartyId, data.otherPartyName);

        return result;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param data 
     * @returns 
     */
    async register(requestId: string, entityId: string, data: M2PCardRegisterRequest): Promise<any> {
        const result: any = await this.m2pCardApiService
            .register(requestId, entityId, data.entityType,
                data.entityCategory, data.businessId, data.customerId, data.title,
                data.firstName, data.middleName, data.lastName, data.gender, data.isNRICustomer,
                data.isMinor, data.isDependant, data.maritalStatus, data.employmentIndustry,
                data.employmentType, data.businessType, data.cardOpenDate, data.kitInfo,
                data.addressInfo, data.communicationInfo, data.accountInfo, data.kycInfo,
                data.dateInfo, data.creditInfo);

        return result;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @param reason 
     * @returns 
     */
    async freeze(requestId: string, entityId: string, reason?: string): Promise<StatusResultModel> {
        // const result: any = await this.m2pCardApiService.freeze(requestId, entityId, reason);
        return <StatusResultModel>{
            status: true, // result === 'success' or true
            message: CardApiMessages.FREEZED_SUCCESSFULLY
        };
    }

    /**
     * 
     * @param authCardSessionPayload 
     * @param data 
     * @returns 
     */
    async close(authCardSessionPayload: AuthCardSessionPayload, data: any): Promise<StatusResultModel> {
        const result: any = await this.getOutstanding(authCardSessionPayload.requestId,
            authCardSessionPayload.partnerCifNo);

        if (result && result.totalPayable > 0) {
            // throw new ServiceError(new ErrorCode('E123232', 'outstanding error'));
            return <StatusResultModel>{
                status: false,
                message: CardApiMessages.SETTLE_YOUR_OUTSTANDING_BALANCE
            }
        }
        // const closeResult:any = await this.m2pCardApiService.close(requestId,
        //     authTokenPayload.partner.partnerCifNo, data.reason);
        return <StatusResultModel>{
            status: true, // closeResult === 'success'
            message: CardApiMessages.CLOSED_SUCCESSFULLY,
        };
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getOutstanding(requestId: string, entityId: string): Promise<any> {
        const result: any = await this.m2pCardApiService
            .getOutstanding(requestId, entityId);

        return result;
    }

    /**
     * 
     * @param requestId 
     * @param entityId 
     * @returns 
     */
    async getEligibleBillingDates(requestId: string, entityId: string): Promise<any> {
        const result: any = await this.m2pCardApiService
            .getDue(requestId, entityId);

        const availableBillingDates: any[] = M2PConfig.Card.BILLING_DATES;
        const currentStatementDateString: string | null | undefined = result.currentStatementDate;

        if (!currentStatementDateString) {
            return availableBillingDates.map((date: any) => {
                return { ...date, eligible: true };
            });
        }

        const currentStatementDate: moment.Moment = moment(currentStatementDateString);
        const currentDate: moment.Moment = moment();
        const isInCurrentMonth: boolean = currentStatementDate.isSame(currentDate, 'month');
        const currentDay: number = currentDate.date();

        return availableBillingDates.map((obj: any) => {
            const isEligible = isInCurrentMonth ?
                obj.billingDate < currentDay :
                obj.billingDate > currentDay;
            return { ...obj, eligible: isEligible };
        });
    }
}