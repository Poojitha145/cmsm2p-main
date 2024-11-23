import { inject } from '@loopback/core';
import { Count, DefaultTransactionalRepository, Transaction } from '@loopback/repository';
import { CmsDataSource, DbErrorCodes, RandomUtil, ServiceError } from 'common-lib';
import { StatementEntity, StatementEntityPaymentStatus, StatementEntityRelations } from '../models/entity/statement.entity';
import { StatementModel } from '../models/model/api.model';

export class StatementRepository extends DefaultTransactionalRepository<
  StatementEntity,
  typeof StatementEntity.prototype.statementId,
  StatementEntityRelations> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(StatementEntity, dataSource);
  }

  /**
   * 
   * @param statement 
   * @param transaction 
   * @returns 
   */
  async createStatement(userLocalId: string, statement: StatementModel, transaction?: Transaction):
    Promise<StatementEntity> {
    try {
      let entity: StatementEntity = new StatementEntity();
      entity.statementId = RandomUtil.uuid();
      entity.cardId = '-';
      entity.userLocalId = userLocalId;
      entity.amount = statement.amount;
      entity.lastStatementBalance = statement.lastStatementBalance;
      entity.totalCreditAmount = statement.totalCreditAmount;
      entity.totalDebitAmount = statement.totalDebitAmount;
      entity.minDueAmount = statement.minimumDueAmount;
      entity.cashbackEarned = 0;
      entity.statementMonthYear = statement.statementMonthYear;
      entity.generatedAt = statement.statementDate;
      entity.dueOn = statement.statementDate; // TODO
      entity.statementFilePath = '-';
      entity.invoiceNumber = RandomUtil.generateBigNumber(12);
      entity.paymentStatus = StatementEntityPaymentStatus.UNPAID;
      entity.financeDetails = statement.finance;
      entity.purchaseDetails = statement.purchase;
      entity.emiDetails = statement.emi;
      entity.startDate = statement.startDate;

      return await this.create(entity, { transaction });
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }

  /**
   * 
   * @param userLocalId 
   * @param statementMonthYear 
   * @returns 
   */
  async getStatementByPeriod(userLocalId: string, statementMonthYear: string): Promise<StatementEntity | null> {
    try {
      let entity: StatementEntity | null = await this.findOne({
        where: {
          and: [
            { userLocalId: { eq: userLocalId } },
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

  /**
   * 
   * @param data 
   * @param statementId 
   * @returns 
   */
  async updateStatement(data: {}, statementId: string): Promise<boolean> {
    try {
      let count: Count = await this.updateAll(data, {
        statementId: statementId
      });
      return count.count > 0;
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }
}
