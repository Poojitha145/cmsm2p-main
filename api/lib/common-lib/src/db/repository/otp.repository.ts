import { inject } from '@loopback/core';
import { DefaultTransactionalRepository, Transaction } from '@loopback/repository';
import { OtpEntity, OtpEntityRelations } from '../entity/otp.entity';
import { CmsDataSource } from '../datasource/cms.datasource';
import { RandomUtil } from '../../util/random-util';
import { DbErrorHandler, ServiceError } from '../../core/error';

export class OtpRepository extends DefaultTransactionalRepository
  <OtpEntity, typeof OtpEntity.prototype.otpId, OtpEntityRelations> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(OtpEntity, dataSource);
  }

  async createOtpEntity(mobileNumber: string, code: string,
    expiredInSeconds: number = 60, transaction?: Transaction): Promise<OtpEntity> {
    try {
      let entity: OtpEntity = new OtpEntity();
      entity.otpId = RandomUtil.uuid();
      entity.mobileNumber = mobileNumber;
      entity.code = code;
      entity.expiredInSeconds = expiredInSeconds;
      entity = await this.create(entity, { transaction: transaction });
      return entity;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }

  async getOtpEntity(otpId: string): Promise<OtpEntity | null> {
    try {
      let object: OtpEntity | null = await this.findOne({
        where: {
          and: [
            { otpId: { eq: otpId } }
          ]
        }
      });
      return object;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }
}
