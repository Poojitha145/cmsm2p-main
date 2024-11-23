import { inject } from '@loopback/core';
import { Count, DefaultTransactionalRepository, Transaction } from '@loopback/repository';
import { UserLoginEntity, UserLoginEntityRelations, UserLoginEntityStatus } from '../entity/user-login.entity';
import { CmsDataSource } from '../datasource/cms.datasource';
import { DbErrorHandler } from '../../core/error';
import { RandomUtil } from '../../util/random-util';

export class UserLoginRepository extends DefaultTransactionalRepository<
  UserLoginEntity,
  typeof UserLoginEntity.prototype.userLoginId,
  UserLoginEntityRelations> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(UserLoginEntity, dataSource);
  }

  async getUserLoginEntityById(userLoginId: string): Promise<UserLoginEntity | null> {
    try {
      let object: UserLoginEntity | null = await this.findOne({
        where: {
          and: [
            { userLoginId: { eq: userLoginId } }
          ]
        }
      });
      return object;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }

  async getActiveUserLoginEntity(userLocalId: string,
    userPartnerId: string): Promise<UserLoginEntity | null> {
    try {
      let object: UserLoginEntity | null = await this.findOne({
        where: {
          and: [
            { userLocalId: { eq: userLocalId } },
            { userPartnerId: { eq: userPartnerId } },
            { status: { eq: UserLoginEntityStatus.ACTIVE } }
          ]
        },
        order: ['createdAt DESC']
      });
      return object;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }

  async getRecent3Entities(userLocalId: string,
    userPartnerId: string): Promise<UserLoginEntity[]> {
    try {
      let objects: UserLoginEntity[] = await this.find({
        where: {
          and: [
            { userLocalId: { eq: userLocalId } },
            { userPartnerId: { eq: userPartnerId } },
            // { status: { eq: UserLoginEntityStatus.ACTIVE } }
          ]
        },
        limit: 3,
        order: ['createdAt DESC']
      });
      return objects;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }

  async createUserLoginEntity(userLocalId: string, userPartnerId: string,
    loginPin: string, transaction?: Transaction): Promise<UserLoginEntity> {
    try {
      const userLoginEntity: UserLoginEntity = new UserLoginEntity();
      userLoginEntity.userLoginId = RandomUtil.uuid();
      userLoginEntity.userLocalId = userLocalId;
      userLoginEntity.userPartnerId = userPartnerId;
      userLoginEntity.loginPin = loginPin; //TODO - encrypt
      userLoginEntity.status = UserLoginEntityStatus.ACTIVE;

      let object: UserLoginEntity = await this.create(userLoginEntity, { transaction: transaction });
      return object;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }

  async createMPin(userLocalId: string, userPartnerId: string,
    loginPin: string): Promise<UserLoginEntity> {
    try {
      const userLoginEntity: UserLoginEntity = new UserLoginEntity();
      userLoginEntity.userLoginId = RandomUtil.uuid();
      userLoginEntity.userLocalId = userLocalId;
      userLoginEntity.userPartnerId = userPartnerId;
      userLoginEntity.loginPin = loginPin; //TODO - encrypt
      userLoginEntity.status = UserLoginEntityStatus.ACTIVE;

      let object: UserLoginEntity = await this.create(userLoginEntity);
      return object;
    } catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }

  async inActiveUserLogin(userLoginId: string): Promise<boolean> {
    try {
      const count: Count = await this.updateAll({
        status: UserLoginEntityStatus.INACTIVE
      }, { userLoginId: userLoginId });
      return count.count > 0;
    }
    catch (e: any) {
      DbErrorHandler.handle(e);
    }
  }
}
