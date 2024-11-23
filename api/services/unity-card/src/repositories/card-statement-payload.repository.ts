import { inject } from '@loopback/core';
import { Count, DefaultTransactionalRepository, Transaction } from '@loopback/repository';
import { CmsDataSource, DbErrorCodes, RandomUtil, ServiceError } from 'common-lib';
import { CardStatementPayloadEntity, CardStatementPayloadEntityRelations } from '../models/entity/card-statement-payload.entity';

export class CardStatementPayloadRepository extends DefaultTransactionalRepository<
  CardStatementPayloadEntity,
  typeof CardStatementPayloadEntity.prototype.statementId,
  CardStatementPayloadEntityRelations> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(CardStatementPayloadEntity, dataSource);
  }

  async createCardStatementPayload(userPartnerId: string, statementMonthYear:
    string, payload: any, transaction?: Transaction): Promise<CardStatementPayloadEntity> {
    try {
      let entity: CardStatementPayloadEntity = new CardStatementPayloadEntity();
      entity.statementId = RandomUtil.uuid();
      entity.userPartnerId = userPartnerId;
      entity.statementMonthYear = statementMonthYear;
      payload.statementId = entity.statementId;
      payload.invoiceNumber = RandomUtil.generateBigNumber(14);
      entity.payload = payload;
      return await this.create(entity, { transaction });
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }

  async getCardStatementPayload(userPartnerId: string, statementMonthYear: string):
    Promise<CardStatementPayloadEntity | null> {
    try {
      let entity: CardStatementPayloadEntity | null = await this.findOne({
        where: {
          and: [
            { userPartnerId: { eq: userPartnerId } },
            { statementMonthYear: { eq: statementMonthYear } }
          ]
        },
        order: ['createdAt DESC']
      });
      return entity;
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }

  async getCardPreviousStatementsPayload(userPartnerId: string, statementMonthYear: string):
    Promise<CardStatementPayloadEntity[]> {
    try {
      let entities: CardStatementPayloadEntity[] = await this.find({
        where: {
          and: [
            { userPartnerId: { eq: userPartnerId } },
            { statementMonthYear: { lt: statementMonthYear } }
          ]
        },
        // order: ['created_at DESC']
      });
      return entities;
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }

  async updateCardStatementPayload(statementId: string, paylod: any):
    Promise<boolean> {
    try {
      let count: Count = await this.updateAll({ payload: paylod }, {
        statementId: statementId
      });
      return count.count > 0;
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }
}
