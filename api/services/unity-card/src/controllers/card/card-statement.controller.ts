import { inject, service } from '@loopback/core';
import { Response, RestBindings, get, param, post, requestBody } from '@loopback/rest';
import { authenticate } from '@loopback/authentication';
import {
  M2PCardUpdateStatementDateRequest, M2PCardUpdateStatementDateRequestBody
} from './request/card-statement.request';
import {
  M2PCardGetTransactionsRequest, M2PCardGetTransactionsRequestBody
} from './request/card-transactions.request';
import { M2PCardService } from '../../services/partner/m2p/card/m2p-card.service';
import { Bindings } from '../../models/bindings';
import { M2PCardStatementService } from '../../services/partner/m2p/card/m2p-card-statement.service';
import { AuthCardSessionPayload } from '../../models/config.model';
import { createReadStream } from 'fs';
import moment from 'moment';
import { ErrorCode, ServiceError } from 'common-lib';

@authenticate("jwt")
export class CardStatementController {

  constructor(
    @inject(Bindings.Request.ID)
    private requestId: string,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @inject(Bindings.Model.AUTH_CARD_SESSION_PAYLOAD)
    private authCardSessionPayload: AuthCardSessionPayload,
    @service() private cardService: M2PCardService,
    @service() private cardStatementService: M2PCardStatementService) {

  }

  @post('/card/get/transactions')
  async getTransactions(@requestBody(M2PCardGetTransactionsRequestBody)
  body: M2PCardGetTransactionsRequest): Promise<any> {
    return await this.cardService.getTransactions(this.requestId,
      this.authCardSessionPayload.partnerCifNo, body);
  }

  @get('/card/get/transaction/{externalId}')
  async getTransaction(@param.path.string('externalId') externalId: string): Promise<any> {
    return await this.cardService.getTransactionByExternalId(this.requestId, externalId);
  }

  @get('/card/get/unbilled/transactions')
  async getUnbilledTransactions(): Promise<any> {
    return await this.cardService.getUnbilledTransactions(this.requestId,
      this.authCardSessionPayload.partnerCifNo);
  }

  @get('/card/get/statement/{monthYear}')
  async getStatement(@param.path.string('monthYear') monthYear: string): Promise<any> {
    if (!moment(monthYear, 'MMYYYY').isValid()) {
      throw new ServiceError(new ErrorCode('E7764', 'invalid statement period. it should be like MMYYYY'));
    }

    return await this.cardService.getStatement(this.authCardSessionPayload, monthYear);
  }

  @get('/card/get/previous/statements/{monthYear}')
  async getPrevoisStatement(@param.path.string('monthYear') monthYear: string): Promise<any> {
    if (!moment(monthYear, 'MMYYYY').isValid()) {
      throw new ServiceError(new ErrorCode('E7764', 'invalid statement period. it should be like MMYYYY'));
    }

    return await this.cardService.getPreviousStatements(this.authCardSessionPayload, monthYear);
  }

  @post('/card/update/statement/date')
  async updateStatement(@requestBody(M2PCardUpdateStatementDateRequestBody)
  body: M2PCardUpdateStatementDateRequest): Promise<any> {
    return await this.cardService.updateStatementDate(this.requestId,
      this.authCardSessionPayload.partnerCifNo, body.statementDate);
  }

  @get('/card/get/billing_dates')
  async getBillingDates(): Promise<any> {
    return await this.cardService.getEligibleBillingDates(this.requestId,
      this.authCardSessionPayload.partnerCifNo);
  }

  @get('/card/download/statement/{monthYear}')
  async downloadStatement(@param.path.string('monthYear') monthYear: string): Promise<any> {
    if (!moment(monthYear, 'MMYYYY').isValid()) {
      throw new ServiceError(new ErrorCode('E7764', 'invalid statement period. it should be like MMYYYY'));
    }

    let result: { location: string, filePath: string, fileName: string } =
      await this.cardStatementService.downloadStatement(this.authCardSessionPayload, monthYear);

    this.response.header('Content-Disposition', `attachment; filename="${result.fileName}"`);

    // Create a read stream for the file
    const fileStream = createReadStream(result.filePath);

    // Set the content type
    this.response.contentType('application/octet-stream');

    // Pipe the file stream to the response
    fileStream.pipe(this.response);
    // return result;
  }
}