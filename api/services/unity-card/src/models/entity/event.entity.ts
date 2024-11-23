import { Entity, model, property } from "@loopback/repository";

@model({
    settings: {
        mysql: {
            table: 'event'
        }
    }
})
export class EventEntity extends Entity {
    @property({
        type: 'string',
        id: true,
        required: true,
        mysql: {
            columnName: 'event_id',
            dataLength: 50
        }
    })
    eventId: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'user_local_id',
            dataLength: 50
        }
    })
    userLocalId: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'user_partner_id',
            dataLength: 50
        }
    })
    userPartnerId: string;

    @property({
        type: 'json',
        required: false,
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

    constructor(data?: Partial<EventEntity>) {
        super(data);
    }
}

export interface EventEntityRelations {
    // describe navigational properties here
}

export type UseEventEntityWithRelations = EventEntity & EventEntityRelations;