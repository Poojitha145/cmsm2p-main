import { inject, intercept, service } from '@loopback/core';
import { post, requestBody } from '@loopback/rest';
import { authenticate } from '@loopback/authentication';
import {
  M2PCardBlockRequest, M2PCardBlockRequestBody,
  M2PCardLockUnLockRequest, M2PCardLockUnlockRequestBody
} from './request/card-lock-unlock.request';
import { M2PCardReplaceRequest, M2PCardReplaceRequestBody } from './request/card-replace.request';
import { M2PCardService } from '../../services/partner/m2p/card/m2p-card.service';
import { AuthenticateActionToken } from '../../interceptor';
import { actionTokenMetadata } from '../../decorators';
import { Bindings } from '../../models/bindings';
import { AuthCardSessionPayload } from '../../models/config.model';

@authenticate("jwt")
export class CardActionController {

  constructor(
    @inject(Bindings.Request.ID)
    private requestId: string,
    @inject(Bindings.Model.AUTH_CARD_SESSION_PAYLOAD)
    private authCardSessionPayload: AuthCardSessionPayload,
    @service() private cardService: M2PCardService) {

  }

  // @intercept(AuthenticateActionToken)
  // @actionTokenMetadata({ actionType: 'card_lock' })
  @post('/card/lock')
  async lock(@requestBody(M2PCardLockUnlockRequestBody) body: M2PCardLockUnLockRequest): Promise<any> {
    return await this.cardService.lock(this.requestId, this.authCardSessionPayload.partnerCifNo, body);
  }

  // @intercept(AuthenticateActionToken)
  // @actionTokenMetadata({ actionType: 'card_unlock' })
  @post('/card/unlock')
  async unlock(@requestBody(M2PCardLockUnlockRequestBody) body: M2PCardLockUnLockRequest): Promise<any> {
    return await this.cardService.unlock(this.requestId, this.authCardSessionPayload.partnerCifNo, body);
  }

  // @intercept(AuthenticateActionToken)
  // @actionTokenMetadata({ actionType: 'card_replace' })
  @post('/card/replace')
  async replace(@requestBody(M2PCardReplaceRequestBody) body: M2PCardReplaceRequest): Promise<any> {
    return await this.cardService.replace(this.requestId, this.authCardSessionPayload.partnerCifNo, body);
  }

  // @intercept(AuthenticateActionToken)
  // @actionTokenMetadata({ actionType: 'card_freeze' })
  @post('/card/freeze')
  async freeze(@requestBody() body: any): Promise<any> {
    return await this.cardService.freeze(this.requestId, this.authCardSessionPayload.partnerCifNo, body);
  }

  // @intercept(AuthenticateActionToken)
  // @actionTokenMetadata({ actionType: 'card_close' })
  @post('/card/close')
  async close(@requestBody() body: any): Promise<any> {
    return await this.cardService.close(this.authCardSessionPayload, body);
  }

  @post('/card/block')
  async block(@requestBody(M2PCardBlockRequestBody) body: M2PCardBlockRequest): Promise<any> {
    return await this.cardService.block(this.requestId, this.authCardSessionPayload.partnerCifNo, body);
  }
}