import { Entity, model, property } from "@loopback/repository";

@model({
    settings: {
        mysql: {
            table: 'card_details'
        }
    }
})
export class CardDetailsEntity extends Entity {
    @property(
        {
            type: 'string',
            required: true,
            mysql: {
                columnName: 'card_id'
            }
        }
    )
    cardId: string;

    @property(
        {
            type: 'string',
            required: true,
            mysql: {
                columnName: 'masked_card_number'
            }
        }
    )
    maskedCardNumber: string;

    @property(
        {
            type: 'string',
            required: true,
            mysql: {
                columnName: 'name_on_card'
            }
        }
    )
    nameOnCard: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'card_expiry'
        }
    })
    cardExpiry: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'card_limit'
        }
    })
    cardLimit: string;

    @property({
        type:'string',
        required: true,
        mysql: {
            columnName: 'local_user_id'
        }
    })
    localUserId: string;

    @property({
        type: 'boolean',
        required: true,
        mysql: {
            columnName: 'is_pin_set'
        }
    })
    isPinSet: boolean;
}

export interface CardDetailsEntityRelations {}