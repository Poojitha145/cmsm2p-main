import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { M2PApiRequestSchema } from "./card-common.request";

/**
 * Card Set Limit Request 
 */
export const M2PCardSetLimitRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['amount'],
    properties: {
        amount: { type: 'number', nullable: false }   //Removed minimum value 1  minimum: 1
    }
};

export const M2PCardSetLimitRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to set the limit',
    required: true,
    content: {
        'application/json': { schema: M2PCardSetLimitRequestSchema }
    }
}

export interface M2PCardSetLimitRequest {
    amount: number;
}

