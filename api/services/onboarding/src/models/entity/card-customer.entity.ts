import { Entity, model, property } from "@loopback/repository";

@model({
    settings: {
      mysql: {
        table: 'card_customer'
      },
      hiddenProperties: ['id']
    }
})
export class CardCustomerEntity extends Entity {
    @property({
      type: 'number',
      id: true,
      generated: true,
    })
    id?: number;
  
    @property({
      type: 'string',
      required: true,
      mysql: {
        columnName: 'local_user_id',
        dataLength: 50,
      }
    })
    localUserId: string;

    @property({
      type: 'string',
      required: true,
      mysql: {
        columnName: 'customer_id',
        dataLength: 50,
      }
    })
    customerId: string;
  
    @property({
      type: 'string',
      default: null,
      required: false,
      mysql: {
        columnName: 'kit_no',
      }
    })
    kitNo: string;
  
    @property({
      type: 'string',
      required: true,
      mysql: {
        columnName: 'alias_name'
      }
    })
    aliasName: string;
  
    @property({
      type: 'date',
      required: false,
      default: new Date(),
      mysql: {
        columnName: 'created_at'
      }
    })
    createdAt?: string;
  
    @property({
      type: 'date',
      required: false,
      default: new Date(),
      mysql: {
        columnName: 'updated_at'
      }
    })
    updatedAt?: string;
  
    constructor(data?: Partial<CardCustomerEntity>) {
      super(data);
    }
  }

  export interface CardCustomerEntityRelations {}

  export type CardCustomerEntityWithRelations = CardCustomerEntity & CardCustomerEntityRelations