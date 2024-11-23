import { inject } from "@loopback/core";
import { api, post, requestBody } from "@loopback/rest";
import { authenticate } from "@loopback/authentication";
import { GenerateTokenRequest, GenerateTokenRequestBody } from "./token.request";
import { AuthTokenPayload, CommonBindings, TokenService } from "common-lib";
import { Bindings } from "../../models/bindings";
import { UserService } from "../../services/user/user.service";

export namespace TokenActionType {
  export const Card = {
    CARD_LOCK: 'card_lock',
    CARD_UNLOCK: 'card_unlock',
    CARD_BLOCK: 'card_block',
    CARD_CLOSE: 'card_close',
    CARD_FREEZE: 'card_freeze',
  }
}

@api({ basePath: '/token' })
@authenticate("jwt")
export class TokenController {

  constructor(
    @inject(CommonBindings.Service.TOKEN_SERVICE)
    private tokenService: TokenService,
    @inject(Bindings.Service.USER_SERVICE)
    private userService: UserService,
    @inject(CommonBindings.Model.AUTH_TOKEN_PAYLOAD)
    private authTokenPayload: AuthTokenPayload,
    @inject(Bindings.Request.ID)
    private requestId: string) {

  }

  @post('/generate')
  async generate(@requestBody(GenerateTokenRequestBody) body: GenerateTokenRequest) {
    await this.userService.verifyLoginPin(this.requestId, body.pin,
      this.authTokenPayload.userLoginId);
    const token: string = await this.tokenService.generateActionToken(body.action, this.authTokenPayload);
    return { token };
  }
}
