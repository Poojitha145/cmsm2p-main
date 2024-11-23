import moment from "moment";
import { CardStatementModel, CardTransactionModel, CardTransactionType } from "./card.model";
import underscore from 'underscore';
import { RandomUtil } from "common-lib";
import { CardStatementPayloadEntity } from "../../../../models/entity/card-statement-payload.entity";

export namespace M2PCardEntityUtil {

    export function getCardStatementModel(entity: CardStatementPayloadEntity): CardStatementModel {
        const payload: any = entity.payload;
        const transactions: CardTransactionModel[] = underscore.map(payload.transactionList, (transaction: any) => {
            let description: string = (
                underscore.isEmpty(transaction.merchantName) === false &&
                underscore.isEmpty(transaction.txndescription) === false
            ) ? transaction.txndescription + " - " + transaction.merchantName :
                transaction.txndescription || transaction.merchantName || transaction.txnSubCategory;

            if (transaction.txnCategory === 'FEES' ||
                transaction.txnCategory === 'SERVICETAX' ||
                transaction.txnSubCategory === 'REWARDS_CASHBACK') {
                description = transaction.txnSubCategory;
            }

            const datetime: string = moment.unix(transaction.transactionDate / 1000).format('YYYY-MM-DD HH:mm:ss');
            const [date, time] = datetime.split(' ');
            return <CardTransactionModel>{
                id: transaction.id,
                internalId: transaction.intTxnId,
                externalId: transaction.extTxnId,
                description: description,
                date: date,
                time: time,
                datetime: transaction.transactionDate,
                amount: transaction.amount,
                type: transaction.crDr === 'CR' ? CardTransactionType.CREDIT : CardTransactionType.DEBIT,
                merchantId: transaction.merchantId,
                merchantName: transaction.merchantName ? transaction.merchantName : '',
                merchantLocation: transaction.merchantLocation,
                category: transaction.txnCategory,
                subCategory: transaction.txnSubCategory,
                universalCurrencyAmount: transaction.univCrncyAmt
            };
        });

        const statement: CardStatementModel = {
            id: payload.statementId,
            lastStatementBalance: <number>underscore.result(payload.stmtCustomerMapping,
                'lastStatementBalance', 0),
            amount: <number>(underscore.result(payload.stmtCustomerMapping, 'currentStatementAmount', 0),
                - underscore.result(payload.stmtCustomerMapping, 'excessAmount', 0)),
            currentStatementAmount: <number>underscore.result(payload.stmtCustomerMapping, 'currentStatementAmount', 0),
            totalCreditAmount: <number>underscore.result(payload.stmtCustomerMapping, 'totalCredit', 0),
            totalDebitAmount: <number>underscore.result(payload.stmtCustomerMapping, 'totalDebit', 0),
            minimumDueAmount: <number>underscore.result(payload.stmtCustomerMapping, 'minDue', 0),
            statementDate: moment.unix(underscore.result(payload.stmtCustomerMapping,
                'statementDate') / 1000).format('YYYY-MM-DD HH:mm:ss'),
            startDate: moment.unix(underscore.result(payload.stmtCustomerMapping,
                'startDate') / 1000).format('YYYY-MM-DD HH:mm:ss'),
            customerDueDate: moment.unix(underscore.result(payload.stmtCustomerMapping,
                'customerDueDate') / 1000).format('YYYY-MM-DD HH:mm:ss'),
            dueDate: moment.unix(underscore.result(payload.stmtCustomerMapping,
                'dueDate') / 1000).format('YYYY-MM-DD HH:mm:ss'),
            statementMonthYear: entity.statementMonthYear,
            // cashbackEarned: totalCashback,
            paymentStatus: underscore.result(payload.stmtCustomerMapping, 'paymentStatus', "UNPAID"),
            excessAmount: <number>underscore.result(payload.stmtCustomerMapping, 'excessAmount', 0),
            finance: {
                interest: <number>underscore.result(payload.stmtCustomerMapping, 'interest', 0),
                tax: <number>underscore.result(payload.stmtCustomerMapping, 'tax', 0),
                fees: <number>underscore.result(payload.stmtCustomerMapping, 'fees', 0)
            },
            purchase: {
                amount: <number>underscore.result(payload.stmtCustomerMapping, 'purchase', 0),
                cash: <number>underscore.result(payload.stmtCustomerMapping, 'cash', 0)
            },
            emi: {
                debit: <number>underscore.result(payload.stmtCustomerMapping, 'emiDebit', 0),
                principle: <number>underscore.result(payload.stmtCustomerMapping, 'emiPrinciple', 0),
                interest: <number>underscore.result(payload.stmtCustomerMapping, 'emiInterest', 0),
                otherCharges: <number>underscore.result(payload.stmtCustomerMapping, 'emiOtherCharges', 0),
                limitBlockedAmount: <number>underscore.result(payload.stmtCustomerMapping, 'emiLimitBlockedAmount', 0)
            },
            invoiceNumber: payload.invoiceNumber,
            transactions: transactions
        };

        return statement;
    }
}