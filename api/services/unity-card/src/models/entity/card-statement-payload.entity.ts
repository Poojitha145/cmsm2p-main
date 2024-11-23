import { Entity, model, property } from '@loopback/repository';
import { StatementModel, TransactionModel } from '../model/api.model';

@model({
  settings: {
    mysql: {
      table: 'card_statement_payload'
    }
  }
})
export class CardStatementPayloadEntity extends Entity {

  @property({
    type: 'string',
    id: true,
    required: true,
    mysql: {
      columnName: 'statement_id',
      dataLength: 50,
    }
  })
  statementId: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'user_partner_id',
      dataLength: 50,
    }
  })
  userPartnerId: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'statement_month_year',
      dataLength: 20,
    }
  })
  statementMonthYear: string;

  @property({
    type: 'object',
    required: true,
    mysql: {
      columnName: 'payload'
    }
  })
  payload: any;

  @property({
    type: 'date',
    required: false,
    mysql: {
      columnName: 'created_at'
    }
  })
  createdAt?: string;

  @property({
    type: 'date',
    required: false,
    mysql: {
      columnName: 'updated_at'
    }
  })
  updatedAt?: string;

  constructor(data?: Partial<CardStatementPayloadEntity>) {
    super(data);
  }
}
export interface CardStatementPayloadEntityRelations {
  // describe navigational properties here
}

export type UseCardStatementPayloadEntityWithRelations = CardStatementPayloadEntity & CardStatementPayloadEntityRelations;
