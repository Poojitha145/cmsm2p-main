import { inject } from '@loopback/core';
import { DefaultTransactionalRepository, Transaction } from '@loopback/repository';
import { UserEntity, UserEntityRelations, UserEntityStatus } from '../entity/user.entity';
import { CmsDataSource } from '../datasource/cms.datasource';
import { RandomUtil } from '../../util/random-util';
import { DbErrorHandler, ServiceError, ServiceErrorCodes } from '../../core/error';

export class UserRepository extends DefaultTransactionalRepository<
  UserEntity,
  typeof UserEntity.prototype.userLocalId,
  UserEntityRelations> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(UserEntity, dataSource);
  }

  async createUserEntity(mobileNumber: string, displayName: string,
    email: string, dob: string, transaction?: Transaction): Promise<UserEntity> {
    try {
      let entity: UserEntity = new UserEntity();
      entity.userLocalId = RandomUtil.uuid();
      entity.mobileNumber = mobileNumber;
      entity.displayName = displayName;
      entity.email = email;
      entity.dob = dob;
      entity = await this.create(entity, { transaction: transaction });
      return entity;
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ServiceError(ServiceErrorCodes.MOBILE_NUMBER_ALREADY_REGISTERED);
      }
      DbErrorHandler.handle(e);
    }
  }

  async getActiveUserEntity(mobileNumber: string): Promise<UserEntity | null> {
    try {
      let object: UserEntity | null = await this.findOne({
        where: {
          and: [
            { mobileNumber: { eq: mobileNumber } },
            { status: { eq: UserEntityStatus.ACTIVATED } }
          ]
        },
        order: ['createdAt DESC']
      });
      return object;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }

  async getActiveUserEntityById(userLocalId: string): Promise<UserEntity | null> {
    try {
      let object: UserEntity | null = await this.findOne({
        where: {
          and: [
            { userLocalId: { eq: userLocalId } },
            { status: { eq: UserEntityStatus.ACTIVATED } }
          ]
        },
        order: ['createdAt DESC']
      });
      return object;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }

  async getUserEntity(mobileNumber: string): Promise<UserEntity | null> {
    try {
      let object: UserEntity | null = await this.findOne({
        where: {
          and: [
            { mobileNumber: { eq: mobileNumber } }
          ]
        },
        order: ['createdAt DESC']
      });
      return object;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }
}
