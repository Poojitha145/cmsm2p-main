import { inject, service } from "@loopback/core";
import { api, post, requestBody } from "@loopback/rest";
import { GetLoginDetailsRequest, GetLoginDetailsRequestBody, GetLoginDetailsRequestSchema, TempAccountRegisterRequest, TempAccountRegisterRequestBody } from "./account.request";
import { Bindings } from "../../models/bindings";
import { AccountService } from "../../services/account/account.service";


@api({ basePath: '/account' })
export class AccountController {

  constructor(
    @inject(Bindings.Request.ID)
    private requestId: string,
    @service()
    private accountService: AccountService) {

  }

  /**
   * To register a customer
   * (this is a temporary service till onboarding services are available)
   * @param request 
   * @returns 
   */
  @post('/temp/register/customer')
  async tempRegisterCustomer(@requestBody(TempAccountRegisterRequestBody) request: TempAccountRegisterRequest) {
    return await this.accountService.tempRegisterAccount(this.requestId, request);
  }

  /**
   * To get the login details on a registered mobile number.
   * @param request 
   * TODO - secure this service with encryped token 
   * (only partner can access)
   */
  @post('/get/login/details')
  async getLoginId(@requestBody(GetLoginDetailsRequestBody) request: GetLoginDetailsRequest) {
    return await this.accountService.getLoginDetails(this.requestId, request.mobileNumber, 'm2p');
  }
}
