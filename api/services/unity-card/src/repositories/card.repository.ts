import { inject } from '@loopback/core';
import { DefaultCrudRepository, Transaction } from '@loopback/repository';
import { CardEntity, CardEntityRelations } from '../models/entity/card.entity';
import { CmsDataSource, DbErrorCodes, RandomUtil, ServiceError } from 'common-lib';
import { CardModel } from '../models/model/api.model';

export class CardRepository extends DefaultCrudRepository<
  CardEntity,
  typeof CardEntity.prototype.cardId,
  CardEntityRelations> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(CardEntity, dataSource);
  }

  async getCards(userPartnerId: string): Promise<CardEntity[]> {
    try {
      let entities: CardEntity[] = await this.find({
        where: {
          and: [
            { userPartnerId: { eq: userPartnerId } }
          ]
        }
      });
      return entities;
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }

  async createCards(userLocalId: string, userPartnerId: string, cardModels: CardModel[],
    transaction?: Transaction): Promise<CardEntity[]> {
    try {
      const cardEntities: CardEntity[] = [];
      cardModels.forEach((cardModel: CardModel) => {
        const cardEntity: CardEntity = new CardEntity();
        cardEntity.cardId = RandomUtil.uuid();
        cardEntity.userLocalId = userLocalId;
        cardEntity.userPartnerId = userPartnerId;
        cardEntity.cardNumber = cardModel.kitNo;
        cardEntity.kitNumber = cardModel.kitNo;
        cardEntity.maskedCardNumber = cardModel.kitNo;
        cardEntity.kitNumber = cardModel.kitNo;
        cardEntity.kitNumber = cardModel.kitNo;

        cardEntities.push(cardEntity);
      });



      let entities: CardEntity[] = await this.createAll(cardEntities, { transaction });
      return entities;
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }

  async getCardEntities(userPartnerId: string): Promise<CardEntity[]> {
    try {
      let entities: CardEntity[] = await this.find({
        where: {
          and: [
            { userPartnerId: { eq: userPartnerId } }
          ]
        }
      });
      return entities;
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }

  async getCardEntity(cardId: string): Promise<CardEntity | null> {
    try {
      let entity: CardEntity | null = await this.findOne({
        where: {
          and: [
            { cardId: { eq: cardId } }
          ]
        }
      });
      return entity;
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }

  async getActiveCardEntity(cardId: string): Promise<CardEntity | null> {
    try {
      let entity: CardEntity | null = await this.findOne({
        where: {
          and: [
            { cardId: { eq: cardId } }
          ]
        }
      });
      return entity;
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }
}
