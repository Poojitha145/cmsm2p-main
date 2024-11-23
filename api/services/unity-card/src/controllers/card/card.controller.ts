import { inject, intercept, service } from '@loopback/core';
import { get, post, requestBody } from '@loopback/rest';
import { authenticate } from '@loopback/authentication';
import { M2PCardSetPinRequest, M2PCardSetPinRequestBody } from './request/card-pin.request';
import { M2PCardRepaymentRequestBody, M2PCardRepaymentRequest } from './request/card-payment.request';
import { M2PCardPhysicalRequestBody, M2PCardPhysicalRequest } from './request/card-physical.request';
import { CardGetCvvOperationObject, M2PCardGetCvvRequest, M2PCardGetCvvRequestBody } from './request/card-cvv.request';
import { M2PCardSetLimitRequest, M2PCardSetLimitRequestBody } from './request/card-limit.request';
import { M2PCardSetPrefernceRequestBody, M2PCardSetPreferncesRequest } from './request/card-preference.request';
import { M2PCardUpgradeLimitRequest, M2PCardUpgradeLimitRequestBody } from './request/card-upgrade-limit.request';
import { M2PCardRegisterRequest, M2PRegisterUserRequestBody } from './request/card-m2p-register.request';
import { M2PCardService } from '../../services/partner/m2p/card/m2p-card.service';
import { Bindings } from '../../models/bindings';
import { M2PCardGetListRequest, M2PCardGetListRequestBody } from './request/card-list.request';
import { AuthCardSessionPayload, SessionPayload } from '../../models/config.model';
import { actionTokenMetadata } from '../../decorators';

@authenticate("jwt")
export class CardController {

  constructor(
    @inject(Bindings.Request.ID)
    private requestId: string,
    @inject(Bindings.Model.AUTH_CARD_SESSION_PAYLOAD)
    private authCardSessionPayload: AuthCardSessionPayload,
    @service() private cardService: M2PCardService) {

  }

  @get('/card/get/details')
  async getDetails(): Promise<any> {
    return await this.cardService.getDetails(this.requestId, this.authCardSessionPayload.partnerCifNo);
  }

  @get('/card/get/list')
  async getList(): Promise<any> {
    return await this.cardService.getList(this.authCardSessionPayload);
  }

  @post('/card/get/list')
  async getCustomList(@requestBody(M2PCardGetListRequestBody) body: M2PCardGetListRequest): Promise<any> {
    return await this.cardService.getList(this.authCardSessionPayload, body.status, body.type);
  }

  @get('/card/get/balance')
  async getBalance(): Promise<any> {
    return await this.cardService.getBalance(this.requestId, this.authCardSessionPayload.partnerCifNo);
  }

  @post('/card/set/pin')
  async setPin(@requestBody(M2PCardSetPinRequestBody) body: M2PCardSetPinRequest): Promise<any> {
    return await this.cardService.setPin(this.requestId, this.authCardSessionPayload.partnerCifNo, body);
  }

  // @intercept(AuthenticateActionToken)
  // @actionTokenMetadata({ actionType: 'card_get_cvv' })
  @post('/card/get/cvv', CardGetCvvOperationObject)
  async getCvv(body: M2PCardGetCvvRequest): Promise<any> {
    return await this.cardService.getCvv(this.requestId, this.authCardSessionPayload.partnerCifNo, body);
  }

  @get('/card/get/limit')
  async getLimit(): Promise<any> {
    return await this.cardService.getLimit(this.requestId, this.authCardSessionPayload.partnerCifNo);
  }

  @post('/card/set/limit')
  async setLimit(@requestBody(M2PCardSetLimitRequestBody)
  body: M2PCardSetLimitRequest): Promise<any> {
    return await this.cardService.setLimit(this.requestId, this.authCardSessionPayload.partnerCifNo, body.amount);
  }

  @post('/card/upgrade/limit')
  async setCreditLimit(@requestBody(M2PCardUpgradeLimitRequestBody)
  body: M2PCardUpgradeLimitRequest): Promise<any> {
    return await this.cardService.upgradeLimit(this.requestId, this.authCardSessionPayload.partnerCifNo, body.amount);
  }

  @get('/card/get/preference')
  async getPreference(): Promise<any> {
    return await this.cardService.getPreference(this.requestId, this.authCardSessionPayload.partnerCifNo);
  }

  @post('/card/set/preference',)
  async setPreference(@requestBody(M2PCardSetPrefernceRequestBody)
  body: M2PCardSetPreferncesRequest): Promise<any> {
    return await this.cardService.setPreference(this.requestId, this.authCardSessionPayload.partnerCifNo, body);
  }

  @get('/card/get/due')
  async getDue(): Promise<any> {
    return await this.cardService.getDue(this.requestId, this.authCardSessionPayload.partnerCifNo);
  }

  @post('/card/physical_request')
  async requestPhysicalCard(@requestBody(M2PCardPhysicalRequestBody) body: M2PCardPhysicalRequest): Promise<any> {
    return await this.cardService.requestPhysicalCard(this.requestId, this.authCardSessionPayload.partnerCifNo, body);
  }

  @post('/card/repayment')
  async repayment(@requestBody(M2PCardRepaymentRequestBody) body: M2PCardRepaymentRequest): Promise<any> {
    return await this.cardService.repayment(this.requestId, this.authCardSessionPayload.partnerCifNo, body);
  }

  @post('/register')
  async register(@requestBody(M2PRegisterUserRequestBody) body: M2PCardRegisterRequest): Promise<any> {
    return await this.cardService.register(this.requestId, this.authCardSessionPayload.partnerCifNo, body);
  }
}