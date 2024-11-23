import { repository } from '@loopback/repository';
import moment, { Moment } from 'moment';
import { BindingScope, injectable, service } from '@loopback/core';
import { ErrorCode, Logger, ServiceError } from '../core';
import { RandomUtil } from '../util';
import { OtpEntity, OtpRepository } from '../db';
import { CommonBindings } from '../model';
import { Communication, SmsErrorCodes, SmsRequest, SmsService } from './communication';
import { KaleryaApiService } from './communication/provider/kalerya-api.service';


export const OtpErrorCodes = {
  FAILED_TO_SEND_OTP: new ErrorCode('5000', 'Failed to send OTP. Please try again'),
  INVALID_OTP_ID: new ErrorCode('5001', 'OTP id not found'),
  INVALID_OTP: new ErrorCode('5002', 'Wrong OTP. Please try again'),
  CREATE_OTP_ATTEMPTS_EXCEEDED: new ErrorCode('5003', 'Max create OTP attempts exceeded in an interval'),
  MAX_OTP_ATTEMPTS_REACHED: new ErrorCode('5004', 'Max invalid OTP attempts exceeded'),
  OTP_EXPIRED: new ErrorCode('5005', 'OTP expired'),

  FAILED_TO_CREATE_OTP: new ErrorCode('5006', 'Failed to create OTP. Please try again'),
  FAILED_TO_SAVE_OTP: new ErrorCode('5007', 'Failed to save OTP. Please try again'),
  OTP_ALREADY_VERIFIED: new ErrorCode('5008', 'OTP is already verified'),
}

@injectable({ scope: BindingScope.SINGLETON, tags: CommonBindings.Service.OTP_SERVICE })
export class OtpService {

  constructor(
    @service(SmsService)
    private smsService: SmsService,
    @repository(OtpRepository)
    private readonly otpRepository: OtpRepository) { }

  /**
   * Generate's otp code and send a message via channel
   * @param requestId 
   * @param mobileNumber 
   * @param channelType 
   * @param expiredInSeconds 
   * @returns 
   */
  async sendOtp(requestId: string, mobileNumber: string, otp: string,
    message: string, channelType: Communication.ChannelType, templateId?: string,
    expiredInSeconds: number = 180): Promise<any> {

    Logger.info(requestId, 'OtpService.send', `sending ${channelType}`, message);

    if (channelType === Communication.ChannelType.Sms) {
      const request: SmsRequest = {
        id: requestId,
        to: mobileNumber,
        body: message,
        type: 'OTP',
        templateId: templateId
      };
      const result: any = await this.smsService.send(request);
      if (result && result.code && result.error?.body) {
        throw new ServiceError(SmsErrorCodes.SMS_UNDELIVERED);
      }
    } else {
      throw new ServiceError(new ErrorCode('15500', 'Unsupported communication channel'));
    }

    try {
      const otpEntity: OtpEntity = await this.otpRepository.createOtpEntity(mobileNumber, otp);
      return {
        otpId: otpEntity.otpId,
        otp: otp
      }
    } catch (e: any) {
      Logger.error(requestId, 'OtpService.send', e.message, e);
      throw new ServiceError(OtpErrorCodes.FAILED_TO_SAVE_OTP, e);
    }
  }

  /**
   * Verify otp code
   * @param requestId 
   * @param otpId 
   * @param otpCode 
   * @returns 
   */
  public async verifyOtp(requestId: string, otpId: string,
    otpCode: string): Promise<boolean> {
    let otpEntity: OtpEntity | null = await this.otpRepository.getOtpEntity(otpId);
    if (!otpEntity) {
      Logger.info(requestId, 'OtpService.verify',
        OtpErrorCodes.INVALID_OTP_ID.description);
      throw new ServiceError(OtpErrorCodes.INVALID_OTP_ID);
    }

    if (otpEntity.verified) {
      Logger.info(requestId, 'OtpService.verify',
        OtpErrorCodes.OTP_ALREADY_VERIFIED.description);
      throw new ServiceError(OtpErrorCodes.OTP_ALREADY_VERIFIED);
    }

    try {
      // update attempts
      this.otpRepository.updateAll({
        attempts: otpEntity.attempts + 1
      }, { otpId: otpId });
    } catch (e: any) {
      Logger.error(requestId, 'OtpService.verify', 'db - updating attempts', e);
    }

    const now: Moment = moment().utc();
    const expiredAt: Moment = moment(otpEntity.createdAt)
      .add(otpEntity.expiredInSeconds, 'seconds');
    Logger.info(requestId, 'OtpService.verify',
      'verifying', { now: now, expiredAt: expiredAt, attempts: otpEntity.attempts });

    if (now.isAfter(expiredAt)) {
      Logger.info(requestId, 'OtpService.verify',
        OtpErrorCodes.OTP_EXPIRED.description);
      throw new ServiceError(OtpErrorCodes.OTP_EXPIRED);
    }

    if (otpEntity.attempts > 5) {
      Logger.info(requestId, 'OtpService.verify',
        OtpErrorCodes.OTP_EXPIRED.description);
      throw new ServiceError(OtpErrorCodes.MAX_OTP_ATTEMPTS_REACHED);
    }

    // const code: string = Crypto.decrypt(otpEntity.code, this.secretKey);
    const code: string = otpEntity.code;
    if (code === otpCode) {
      try {
        this.otpRepository.updateAll({ verified: true }, { otpId: otpId });
      } catch (e: any) {
        Logger.error(requestId, 'OtpService.verify', 'db - updating verified', e);
      }
      Logger.info(requestId, 'OtpService.verify', 'OTP verified');
      return true;
    }

    Logger.info(requestId, 'OtpService.verify',
      OtpErrorCodes.INVALID_OTP.description);
    throw new ServiceError(OtpErrorCodes.INVALID_OTP);
  }
}