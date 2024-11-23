import { Entity, model, property } from '@loopback/repository';

export enum CardEntityStatus {
  ACTIVE = 'ACTIVE',
  REPLACED = 'REPLACED',
  LOCKED = 'LOCKED',
  BLOCKED = 'BLOCKED',
  HOTLISTED = 'HOTLISTED',
}

@model({
  settings: {
    mysql: {
      table: 'card'
    }
  }
})
export class CardEntity extends Entity {

  @property({
    type: 'string',
    id: true,
    required: true,
    mysql: {
      columnName: 'card_id',
      dataLength: 50,
    }
  })
  cardId: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'user_local_id',
      dataLength: 50,
    }
  })
  userLocalId: string;

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
      columnName: 'card_number',
      dataLength: 50,
    }
  })
  cardNumber: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'kit_number',
      dataLength: 50,
    }
  })
  kitNumber: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'masked_card_number',
      dataLength: 50,
    }
  })
  maskedCardNumber: string;

  @property({
    type: 'string',
    default: null,
    required: true,
    mysql: {
      columnName: 'name_on_card',
      dataLength: 100,
    }
  })
  nameOnCard?: string;

  @property({
    type: 'number',
    required: false,
    mysql: {
      columnName: 'card_limit',
    }
  })
  cardLimit: number;

  @property({
    type: 'number',
    required: false,
    mysql: {
      columnName: 'cash_limit',
    }
  })
  cashLimit: number;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'card_expiry',
      dataLength: 10,
    }
  })
  cardExpiry: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'card_type',
      dataLength: 50,
    }
  })
  cardType: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'network_type',
      dataLength: 50,
    }
  })
  networkType: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'card_state',
      dataLength: 50,
    }
  })
  cardState: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
    mysql: {
      columnName: 'is_pin_set',
      default: 0
    }
  })
  isPinSet: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(CardEntityStatus),
    }
  })
  status: CardEntityStatus;

  @property({
    type: 'date',
    required: false,
    mysql: {
      columnName: 'card_issue_date',
      default: null
    },
  })
  cardIssueDate?: string | null;

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

  constructor(data?: Partial<CardEntity>) {
    super(data);
  }
}

export interface CardEntityRelations {
  // describe navigational properties here
}

export type UseCardEntityWithRelations = CardEntity & CardEntityRelations;
