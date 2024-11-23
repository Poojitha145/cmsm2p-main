import { BindingScope, inject, injectable } from "@loopback/core";
import { Bindings } from "../../../../models/bindings";
import stream from "stream";
import { M2PCardService } from "./m2p-card.service";
import { StatementHtmlTemplate, StatementUtil } from "../../../common/statement.util";
import { AppConfig, CardSessionPayload } from "../../../../models/config.model";
import { ErrorCode, Logger, ServiceError, FileUtil } from "common-lib";
import { CardLimitModel, CardModel } from "../../../../models/model/api.model";
import underscore from "underscore";
import { CardStatementModel, CardStatementTemplateModel, CardTransactionModel } from "./card.model";
import fs from 'fs';
import path from 'path';
import { APP_DOWNLOADS_DIRECTORY } from "../../../../application";
import { AwsService } from "../../../common/aws/aws.service";

@injectable({ scope: BindingScope.SINGLETON, tags: Bindings.Service.M2P_CARD_STATEMENT_SERVICE })
export class M2PCardStatementService {

    private readonly EXCLUDE_CATEGORY_FOR_TRANSACTION_AMOUNT = ['FEES', 'INTEREST', 'SERVICETAX', 'LATE_FEES', 'REGISTRATION_FEE', 'SERVICETAX', 'REVOLVE_INTEREST', 'ATM'];
    private readonly CATEGORY_FOR_FEES_AND_INTREST = ['FEES', 'INTEREST', 'SERVICETAX', 'LATE_FEES', 'REGISTRATION_FEE', 'SERVICETAX', 'REVOLVE_INTEREST'];

    public readonly htmlTemplate: StatementHtmlTemplate;

    constructor(
        @inject(Bindings.Config.APP_CONFIG)
        private appConfig: AppConfig,
        @inject(Bindings.Service.AWS_SERVICE)
        private awsService: AwsService,
        @inject(Bindings.Service.M2P_CARD_SERVICE)
        public m2pCardService: M2PCardService) {
        this.htmlTemplate = new StatementHtmlTemplate();
    }

    /**
     * Download statement to local downloads directory from S3 
     * and returns the relative url to download. 
     * @param requestId 
     * @param stream 
     * @param fileName 
     * @returns 
     */
    private async downloadStatementToDownloadsDirectory(requestId: string,
        stream: stream.Readable, fileName: string): Promise<any> {
        const statementPath: string = path.join(APP_DOWNLOADS_DIRECTORY, 'statement');
        const filePath = path.join(statementPath, fileName);
        await FileUtil.createDirectoryIfNotExists(statementPath);
        const file = fs.createWriteStream(filePath);
        const location: string = '/downloads/statement/' + fileName;
        try {
            //TODO handle async error
            await new Promise<any>(async (resolve: any, reject: any) => {
                stream.pipe(file);
                file.on('finish', () => {
                    file.close(() => {
                        Logger.debug(requestId, 'M2PCardStatementService.downloadStatementToDownloadsDirectory',
                            `file downloaded and saved file: ${filePath}`);
                        resolve(filePath);
                    });
                });
                stream.on('error', (e: any) => {
                    Logger.error(requestId, 'M2PCardStatementService.downloadStatementToDownloadsDirectory',
                        `error downloading file: ${filePath}`, e);
                    try {
                        fs.unlinkSync(filePath); // Delete the file if there's an error
                    } catch (e: any) {
                        Logger.error(requestId, 'M2PCardStatementService.downloadStatementToDownloadsDirectory',
                            `unlinkSync file: ${filePath}`, e);
                    }
                });
            });
        } catch (e: any) {
            Logger.error(requestId, 'M2PCardStatementService.downloadStatementToDownloadsDirectory',
                'downloading failed', e);
            try {
                fs.unlink(filePath, () => { });
            } catch (e: any) {
                Logger.error(requestId, 'M2PCardStatementService.downloadStatementToDownloadsDirectory',
                    `unlink file: ${filePath}`, e);
            }
            throw new ServiceError(new ErrorCode('E3343', ' failed to download the statement.'));
        }

        return { location: location, filePath: filePath, fileName: fileName };
    }

    /**
     * Download statement locally from S3 and returns the relative url to download. 
     * @param cardSessionPayload 
     * @param statementMonthYear 
     */
    async downloadStatement(cardSessionPayload: CardSessionPayload,
        statementMonthYear: string): Promise<any> {
        const pdfMetadata: {
            location: string,
            key: string,
            bucket: string,
            name: string
        } = await this.generateStatementPdf(
            cardSessionPayload, statementMonthYear, false);

        const stream: stream.Readable = this.awsService.S3.getObjectStream(pdfMetadata.bucket, pdfMetadata.key);

        return await this.downloadStatementToDownloadsDirectory(cardSessionPayload.requestId, stream, pdfMetadata.name);
    }

    /**
     * Download statement from S3 and stream it directly to the client 
     * without storing it locally and returns the relative url to download. 
     * @param cardSessionPayload 
     * @param statementMonthYear 
     */
    async downloadStatementStream(cardSessionPayload: CardSessionPayload,
        statementMonthYear: string): Promise<stream.Readable> {
        const pdfMetadata: {
            location: string,
            key: string,
            bucket: string,
            name: string
        } = await this.generateStatementPdf(
            cardSessionPayload, statementMonthYear, false);
        console.log(pdfMetadata)
        const stream: stream.Readable = await this.awsService.S3
            .getObjectStream(pdfMetadata.bucket, pdfMetadata.name);
        return stream;
    }

    /**
     * Invoke this method on m2p statemnet notification.
     * @param cardSessionPayload 
     * @param statementMonthYear 
     */
    async generateStatementPdf(cardSessionPayload: CardSessionPayload, statementMonthYear: string,
        override: boolean = false): Promise<{ location: string, key: string, bucket: string, name: string }> {
        Logger.info(cardSessionPayload.requestId, 'M2PCardStatementService.generateStatementPdf',
            'preparing statement object for template', { statementMonthYear });
        try {
            const cardStatementModel: CardStatementModel = await this.m2pCardService
                .getStatement(cardSessionPayload, statementMonthYear);

            const name: string = cardStatementModel.id + '.pdf';
            const path: string = 'statement/' + statementMonthYear + '/' + name;

            if (!override) {
                const object: any = await this.awsService.S3
                    .getObjectInfo(this.appConfig.APP_ROOT_BUCKET, path);
                if (object) {
                    object.name = name;
                    return object;
                }
            }

            const cardDetails: { card: CardModel, customer: any } = await this.m2pCardService
                .getDetails(cardSessionPayload.requestId, cardSessionPayload.partnerCifNo);
            cardDetails.card.issueDate = '';

            const cardLimit: CardLimitModel = await this.m2pCardService
                .getLimit(cardSessionPayload.requestId, cardSessionPayload.partnerCifNo);

            // calculating transaction amount
            let transactionAmount: number = 0;
            let feesAndIntrest: number = 0;
            let newBalance: number = 0;
            let totalCredit: number = 0;
            cardStatementModel.transactions.forEach((transaction: CardTransactionModel) => {
                if (transaction.type === 'DEBIT') {
                    if (!underscore.contains(this.EXCLUDE_CATEGORY_FOR_TRANSACTION_AMOUNT, transaction.category)) {
                        transactionAmount += transaction.amount;
                    }
                    if (underscore.contains(this.CATEGORY_FOR_FEES_AND_INTREST, transaction.category)) {
                        feesAndIntrest += transaction.amount;
                    }
                } else {
                    totalCredit += transaction.amount;
                }
            });
            newBalance = cardStatementModel.lastStatementBalance - totalCredit +
                cardStatementModel.purchase.cash + transactionAmount + feesAndIntrest

            const cardStatementTemplateModel: CardStatementTemplateModel = underscore.extend({
                card: cardDetails.card,
                customer: cardDetails.customer,
                cardLimit: cardLimit,
                transactionAmount: transactionAmount,
                feesAndIntrest: feesAndIntrest,
                newBalance: newBalance
            }, cardStatementModel);

            //  if card cash limit is not set it would be 10% of availible limit
            if (!cardLimit.cashLimit && cardLimit.availableLimit && cardLimit.availableLimit !== 0) {
                cardLimit.cashLimit = cardLimit.availableLimit - ((10 / 100) * cardLimit.availableLimit);
            }

            console.log(cardStatementTemplateModel)
            Logger.info(cardSessionPayload.requestId, 'M2PCardStatementService.generateStatementPdf',
                'prepared statement data to generate pdf', { statementId: cardStatementModel.id });

            // TODO - const content: string = await this.htmlTemplate().formatContent(statementTemplatePaylod);
            const content: string = await new StatementHtmlTemplate().formatContent(cardStatementTemplateModel);
            Logger.info(cardSessionPayload.requestId, 'M2PCardStatementService.generateStatementPdf',
                'formated statement html content');

            const buffer: any = await StatementUtil.generatePdf(content);
            Logger.info(cardSessionPayload.requestId, 'M2PCardStatementService.generateStatementPdf',
                'converted statement content from html to pdf', { path: path });

            const object: AWS.S3.ManagedUpload.SendData = await this.awsService.S3
                .uploadFile(this.appConfig.APP_ROOT_BUCKET, path, buffer);
            Logger.info(cardSessionPayload.requestId, 'M2PCardStatementService.generateStatementPdf',
                'pdf statement uploaded to S3', { path: object });

            return {
                location: object.Location,
                key: object.Key,
                bucket: object.Bucket,
                name: name
            };
        } catch (e: any) {
            console.log(e)
            if (e instanceof ServiceError) {
                throw e;
            }
            throw new ServiceError(new ErrorCode('E000', 'unable to generate statement pdf'));
        }
    }
}