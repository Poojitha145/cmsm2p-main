import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { M2PApiRequestSchema } from "./card-common.request";

/**
 * Card SetPreferences Request 
 */
export const M2PCardSetPrefernceRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: [],
    properties: {}
}

export const M2PCardSetPrefernceRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to set the prefernces in the card',
    required: true,
    content: {
        'application/json': { schema: M2PCardSetPrefernceRequestSchema }
    }
}

export interface M2PCardLimitConfigRequest {
    txnType: string;
    dailyLimitValue: string;
    dailyLimitCnt?: string;
    minAmount?: string;
    maxAmount?: string;
}

export interface M2PCardSetPreferncesRequest {
    domestic?: {
        limitConfigs: M2PCardLimitConfigRequest[];
        atm: boolean;
        pos: boolean;
        ecom: boolean;
        international: boolean;
        contactless: boolean;
    },
    international?: {
        limitConfigs: M2PCardLimitConfigRequest[];
        atm: boolean;
        pos: boolean;
        ecom: boolean;
        international: boolean;
        contactless: boolean;
    }
}

