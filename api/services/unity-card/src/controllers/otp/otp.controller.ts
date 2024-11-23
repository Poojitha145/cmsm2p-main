import { post, requestBody } from "@loopback/rest";
import { inject } from "@loopback/core";
import { GenerateOtpRequest, GenerateOtpRequestBody } from "./otp.request";
import { CommonBindings, Communication, ErrorCode, MessageTemplates, Normalize, RandomUtil, ServiceError, UserLoginRepository } from "common-lib";
import { Bindings } from "../../models/bindings";
import { OtpService } from "common-lib/dist/service/otp.service";
import { repository } from "@loopback/repository";
import { DbService } from "../../services/db.service";

export class OtpController {

  constructor(
    @inject(Bindings.Request.ID)
    private requestId: string,
    @inject(CommonBindings.Service.OTP_SERVICE)
    private otpService: OtpService,
    @inject(Bindings.Service.DB_SERVICE)
    private dbService: DbService,
    @repository(UserLoginRepository)
    private userLoginRepository: UserLoginRepository) {

  }

  @post('/otp/send')
  async send(@requestBody(GenerateOtpRequestBody) request: GenerateOtpRequest): Promise<any> {
    const mobileNumber: string = request.loginId ?
      await this.dbService.getMobileNumberByLoginId(request.loginId) :
      await this.dbService.getMobileNumberByLocalId(request.localId);

    if (request.template === 'RESET_MPIN') {
      const otp: string = RandomUtil.generateOtp(4);
      const message: string = MessageTemplates.Sms.RESET_MPIN_OTP.getMessage({ otp });

      return await this.otpService.sendOtp(this.requestId, mobileNumber,
        otp, message, Communication.ChannelType.Sms, MessageTemplates.Sms.RESET_MPIN_OTP.templateId);
    }

    return new ServiceError(new ErrorCode('O1001', 'can\' generate otp without any template type'));
  }

  @post('/otp/verify')
  async verify(@requestBody(GenerateOtpRequestBody) request: GenerateOtpRequest): Promise<any> {

  }
}
