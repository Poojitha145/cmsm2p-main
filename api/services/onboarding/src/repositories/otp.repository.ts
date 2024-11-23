import { inject } from '@loopback/core';
import { DefaultCrudRepository, Where, WhereBuilder } from '@loopback/repository';
import { CmsDataSource } from '../datasources';
import { OtpEntity, OtpEntityRelations } from '../models';
import { SerivceErrorCodes, ServiceError } from '../services/common/error/service.error';
import moment from 'moment';
import { Config } from '../services/core/constant/config.constants';

export class OtpRepository extends DefaultCrudRepository<
  OtpEntity,
  typeof OtpEntity.prototype.id,
  OtpEntityRelations> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(OtpEntity, dataSource);
  }

  async saveOtp(otpEntity: OtpEntity): Promise<boolean> {
    if (otpEntity) {

    }
    throw new ServiceError(SerivceErrorCodes.FAILED_TO_SAVE_OTP);
  }

  async verifyOtp(otpId: string, otp: string): Promise<boolean> {
    try {
      let otpEntity: OtpEntity | null = await this.findOne({ where: { otpId: otpId } });
      if (!otpEntity) {
        throw new ServiceError(SerivceErrorCodes.INVALID_OTP_ID);
      } else {
        if (otpEntity.verified) {
          throw new ServiceError(SerivceErrorCodes.OTP_ALREADY_VERIFIED);
        }
        if (otpEntity.attempts > Config.Otp.MaxAttempts) {
          throw new ServiceError(SerivceErrorCodes.MAX_OTP_ATTEMPTS_REACHED);
        }
        let createdAt: number = moment(otpEntity.createdAt).date();
        if ((createdAt + (otpEntity.expiredInSeconds * 1000)) >= moment().date()) {
          throw new ServiceError(SerivceErrorCodes.OTP_EXPIRED);
        }
      }
    } catch (e: any) {
      throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
    }
    return true;
  }
}
