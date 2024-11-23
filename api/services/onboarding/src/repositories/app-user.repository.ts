import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { CmsDataSource } from '../datasources';
import { UserEntity, UserEntityRelations, UserEntityStatus } from '../models';
import { SerivceErrorCodes, ServiceError } from '../services/common/error/service.error';

export class UserRepository extends DefaultCrudRepository<
  UserEntity,
  typeof UserEntity.prototype.id,
  UserEntityRelations> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(UserEntity, dataSource);
  }

  async findUser(userLocalId: string): Promise<UserEntity> {
    try {
      const userEntity: UserEntity | null =
        await this.findOne({ where: { localUserId: userLocalId } });
      if (!userEntity) {
        throw new ServiceError(SerivceErrorCodes.USER_NOT_REGISTED);
      }
      return userEntity;
    } catch (e: any) {
      throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
    }
  }

  async isActivatedUser(userLocalId: string): Promise<boolean> {
    const userEntity: UserEntity = await this.findUser(userLocalId);
    return (userEntity && userEntity.status === UserEntityStatus.ACTIVATED);
  }
}
