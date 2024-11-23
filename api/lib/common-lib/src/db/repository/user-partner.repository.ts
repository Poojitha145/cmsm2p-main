import { inject } from '@loopback/core';
import { DefaultTransactionalRepository, Transaction } from '@loopback/repository';
import { UserPartnerEntity, UserPartnerEntityRelations, UserPartnerEntityStatus } from '../entity/user-partner.entity';
import { CmsDataSource } from '../datasource/cms.datasource';
import { DbErrorHandler, ServiceError, ServiceErrorCodes } from '../../core/error';
import { RandomUtil } from '../../util/random-util';


export class UserPartnerRepository extends DefaultTransactionalRepository<
  UserPartnerEntity,
  typeof UserPartnerEntity.prototype.userPartnerId,
  UserPartnerEntityRelations> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(UserPartnerEntity, dataSource);
  }

  async getUserPartnerEntityById(userPartnerId: string): Promise<UserPartnerEntity | null> {
    try {
      let object: UserPartnerEntity | null = await this.findOne({
        where: {
          and: [
            { userPartnerId: { eq: userPartnerId } }
          ]
        }
      });
      return object;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }

  async getActiveUserPartnerEntity(userLocalId: string,
    partnerId: string): Promise<UserPartnerEntity | null> {
    try {
      let object: UserPartnerEntity | null = await this.findOne({
        where: {
          and: [
            { userLocalId: { eq: userLocalId } },
            { partnerId: { eq: partnerId } },
            { status: { eq: UserPartnerEntityStatus.ACTIVE } }
          ]
        },
        order: ['createdAt DESC']
      });
      return object;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }

  async createUserPartnerEntity(userLocalId: string, partnerId: string,
    partnerCifNo: string, transaction?: Transaction): Promise<UserPartnerEntity> {
    try {
      const entity: UserPartnerEntity = new UserPartnerEntity();
      entity.userPartnerId = RandomUtil.uuid();
      entity.userLocalId = userLocalId;
      entity.partnerId = partnerId;
      entity.partnerCifNo = partnerCifNo; //TODO - encrypt
      entity.status = UserPartnerEntityStatus.ACTIVE;

      let object: UserPartnerEntity = await this.create(entity, { transaction: transaction });
      return object;
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ServiceError(ServiceErrorCodes.PARTNER_ENTITY_ID_ALREADY_REGISTERED);
      }
      DbErrorHandler.handle(e);
    }
  }

  async getPartnerEntityByCifNoAndPartnerId(partnerCifNo: string, partnerId: string,
    status: UserPartnerEntityStatus = UserPartnerEntityStatus.ACTIVE):
    Promise<UserPartnerEntity | null> {
    try {
      let object: UserPartnerEntity | null = await this.findOne({
        where: {
          and: [
            { partnerCifNo: { eq: partnerCifNo } },
            { partnerId: { eq: partnerId } },
            { status: { eq: status } }
          ]
        },
        order: ['createdAt DESC']
      });
      return object;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }

  async getPartnerEntityByCifNoAndPartnerId(partnerCifNo: string, partnerId: string,
    status: UserPartnerEntityStatus = UserPartnerEntityStatus.ACTIVE):
    Promise<UserPartnerEntity | null> {
    try {
      let object: UserPartnerEntity | null = await this.findOne({
        where: {
          and: [
            { partnerCifNo: { eq: partnerCifNo } },
            { partnerId: { eq: partnerId } },
            { status: { eq: status } }
          ]
        },
        order: ['createdAt DESC']
      });
      return object;
    } catch (e: any) {
      throw new ServiceError(DBErrorCode.DB_ERROR, e);
    }
  }
}
