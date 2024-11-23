import { Entity, model, property } from '@loopback/repository';

export enum UserLoginEntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

@model({
  settings: {
    mysql: {
      table: 'user_login'
    }
  }
})
export class UserLoginEntity extends Entity {

  @property({
    type: 'string',
    id: true,
    required: true,
    mysql: {
      columnName: 'user_login_id',
      dataLength: 50,
    }
  })
  userLoginId: string;

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
    default: null,
    required: true,
    mysql: {
      columnName: 'login_pin',
      dataLength: 255,
    }
  })
  loginPin: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
    mysql: {
      columnName: 'failed_attempts',
      default: 0
    }
  })
  failedAttempts: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(UserLoginEntityStatus),
    },
    default: UserLoginEntityStatus.ACTIVE
  })
  status: UserLoginEntityStatus;

  @property({
    type: 'date',
    required: false,
    mysql: {
      columnName: 'login_pin_verified_at'
    }
  })
  loginPinVerifiedAt?: string;

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

  constructor(data?: Partial<UserLoginEntity>) {
    super(data);
  }
}

export interface UserLoginEntityRelations {
  // describe navigational properties here
}

export type UserLoginEntityWithRelations = UserLoginEntity & UserLoginEntityRelations;
