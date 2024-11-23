import { DefaultCrudRepository, Transaction } from '@loopback/repository';
import { inject } from '@loopback/core';
import { EventEntity, EventEntityRelations } from '../models/entity/event.entity';
import { CmsDataSource, DbErrorCodes, RandomUtil, ServiceError } from 'common-lib';

export class EventRepository extends DefaultCrudRepository<
  EventEntity,
  typeof EventEntity.prototype.eventId,
  EventEntityRelations> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(EventEntity, dataSource);
  }

  async createEvent(eventId: string, userLocalId: string, userPartnerId: string,
    payload: any, transaction?: Transaction): Promise<EventEntity> {
    try {
      payload.eventId = eventId;
      const entity: EventEntity = new EventEntity();
      entity.eventId = RandomUtil.uuid();
      entity.userLocalId = userLocalId;
      entity.userPartnerId = userPartnerId;
      entity.payload = payload;
      return await this.create(entity, { transaction });
    } catch (e: any) {
      throw new ServiceError(DbErrorCodes.DB_ERROR, e);
    }
  }
}