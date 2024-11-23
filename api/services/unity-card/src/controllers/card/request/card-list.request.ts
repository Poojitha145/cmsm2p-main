import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { M2PCardStatus } from "../../../services/partner/m2p/card/m2p-card.model";
import { CardType } from "../../../services/partner/m2p/card/card.model";


/**
 * Card List
 */
export interface M2PCardListRequest {
    entityId: string;
}


/**
 * Card Get List
 */
export const M2PCardGetListRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: [],
    properties: {
        status: { type: 'string', enum: Object.values(M2PCardStatus), default: 'ALLOCATED' },
        type: { type: 'string', enum: Object.values(CardType) }
    }
};

export const M2PCardGetListRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to get list of a card',
    required: true,
    content: {
        'application/json': { schema: M2PCardGetListRequestSchema }
    }
}

export interface M2PCardGetListRequest {
    status?: M2PCardStatus;
    type?: CardType;
}