import { Entity, model, property } from '@loopback/repository';

export enum UserPartnerEntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

@model({
  settings: {
    mysql: {
      table: 'user_partner'
    }
  }
})
export class UserPartnerEntity extends Entity {

  @property({
    type: 'string',
    id: true,
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
      columnName: 'user_local_id',
      dataLength: 50,
    }
  })
  userLocalId: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'partner_id',
      dataLength: 50,
    }
  })
  partnerId: string;

  @property({
    type: 'string',
    default: null,
    required: true,
    mysql: {
      columnName: 'partner_cif_no',
      dataLength: 255,
    }
  })
  partnerCifNo: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(UserPartnerEntityStatus),
    },
    default: UserPartnerEntityStatus.ACTIVE
  })
  status: UserPartnerEntityStatus;

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

  constructor(data?: Partial<UserPartnerEntity>) {
    super(data);
  }
}

export interface UserPartnerEntityRelations {
  // describe navigational properties here
}

export type UserPartnerEntityWithRelations = UserPartnerEntity & UserPartnerEntityRelations;
