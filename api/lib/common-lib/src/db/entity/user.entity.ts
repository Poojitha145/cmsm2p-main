import { Entity, model, property } from '@loopback/repository';

export enum UserEntityStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACTIVATED = 'ACTIVATED'
}

@model({
  settings: {
    mysql: {
      table: 'user'
    }
  }
})
export class UserEntity extends Entity {

  @property({
    type: 'string',
    id: true,
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
      columnName: 'mobile_number',
      dataLength: 100,
    }
  })
  mobileNumber: string;

  @property({
    type: 'string',
    default: null,
    required: true,
    mysql: {
      columnName: 'display_name',
      dataLength: 100,
    }
  })
  displayName?: string;

  @property({
    type: 'string',
    required: false,
    mysql: {
      columnName: 'dob',
      dataLength: 20,
    }
  })
  dob?: string;

  @property({
    type: 'string',
    required: false,
    mysql: {
      columnName: 'email',
      dataLength: 100,
    }
  })
  email?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(UserEntityStatus),
    },
    default: UserEntityStatus.PENDING
  })
  status: UserEntityStatus;

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

  constructor(data?: Partial<UserEntity>) {
    super(data);
  }
}

export interface UserEntityRelations {
  // describe navigational properties here
}

export type UserEntityWithRelations = UserEntity & UserEntityRelations;
