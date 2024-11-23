import { inject, service } from "@loopback/core";
import { api, post, get, requestBody, Response, RestBindings } from "@loopback/rest";
import { JWTService } from "../../services/authentication/jwt-service";
import { CreateMPinRequest, ResetMPinRequest, ResetMPinRequestBody, UserCreateRequest, UserCreateRequestBody, VerifyMPinRequest, VerifyMPinRequestBody } from "./user.request";
import { UserProfile } from '@loopback/security';
import { UserService } from "../../services/user/user.service";
import { Normalize, TokenPayload } from "common-lib";
import { Bindings } from "../../models/bindings";
import { M2PCardStatementService } from "../../services/partner/m2p/card/m2p-card-statement.service";
import stream from 'stream';

@api({
  basePath: '/user'
})
export class UserController {

  constructor(
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @service() private cardStatementService: M2PCardStatementService,
    @inject(Bindings.Request.ID)
    private requestId: string,
    @inject(Bindings.Service.JWT_SERVICE)
    public jwtService: JWTService,
    @inject(Bindings.Service.USER_SERVICE)
    public userService: UserService) {

  }

  // @post('/create')
  async create(@requestBody(UserCreateRequestBody) userCreateRequest: UserCreateRequest) {
    const result: any = await this.userService.createUser(userCreateRequest)
    return Promise.resolve(result);
  }

  // @post('/update')
  update(): any {

  }

  @post('/verify/mpin')
  async verifyMpin(@requestBody(VerifyMPinRequestBody) verifyMPinRequest: VerifyMPinRequest): Promise<any> {
    const tokenPayload: TokenPayload = await this.userService.verifyMPin(verifyMPinRequest);
    const userPrincipal: UserProfile = this.userService.convertToUserProfile(tokenPayload);
    const token = await this.jwtService.generateToken(userPrincipal);
    return { status: true, token: token };
  }

  // @post('/create/mpin')
  async createMpin(@requestBody(VerifyMPinRequestBody) body: CreateMPinRequest): Promise<boolean> {
    await this.userService.createMpin(body);
    return true;
  }

  @post('/reset/mpin')
  async resetMPin(@requestBody(ResetMPinRequestBody) requestBody: ResetMPinRequest) {
    return await this.userService.resetMPin(this.requestId, requestBody);
  }
}
