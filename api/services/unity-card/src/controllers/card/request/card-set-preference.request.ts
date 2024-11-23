import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { M2PApiRequestSchema } from "./card-common.request";

/**
 * Card SetPreferences Request 
 */
export const M2PCardSetPrefernceRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['domestic'],
    properties: {
        limitConfigs: {
            type: 'object',
            properties: {
                txnType: { type: 'string' },
                dailyLimitValue: { type: 'string', nullable: false },
                dailyLimitCnt: { type: 'string', nullable: false },
                minAmount: { type: 'string' },
                maxAmount: { type: 'string' },
            },
        },
        atm: { type: 'boolean' },
        pos: { type: 'boolean' },
        ecom: { type: 'boolean' },
        international: { type: 'boolean' },
    }
};

export const M2PCardSetPrefernceRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to set the prefernces in the card',
    required: true,
    content: {
        'application/json': { schema: M2PCardSetPrefernceRequestSchema }
    }
}

export interface M2PCardSetPreferncesRequest {
    domestic: {
        atm: boolean;
        pos: boolean;
        ecom: boolean;
        international: boolean;
        contactless: boolean;
        limitConfigs: {
            txnType: string;
            dailyLimitValue: string;
        }[];
    },
    international?: {
        atm: boolean;
        pos: boolean;
        ecom: boolean;
        international: boolean;
        contactless: boolean;
        limitConfigs: {
            txnType: string;
            dailyLimitValue: string;
        }[];
    }
}

