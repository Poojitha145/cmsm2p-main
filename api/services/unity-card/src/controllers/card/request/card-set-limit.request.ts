import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { M2PApiRequestSchema } from "./card-common.request";

/**
 * Card Set Limit Request 
 */
export const M2PCardSetLimitRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['amount'],
    properties: {
      amount: { type: 'number', nullable: false }
    }
};

export const M2PCardSetLimitRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to set the limit',
    required: true,
    content: {
        'application/json': { schema: M2PCardSetLimitRequestSchema }
    }
}

export interface M2PCardSetLimitRequestModel {
    amount: number;
}

