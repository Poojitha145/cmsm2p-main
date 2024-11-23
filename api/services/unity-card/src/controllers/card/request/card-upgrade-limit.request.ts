import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";

/**
 * Card Upgrade Limit Request 
 */
export const M2PCardUpgradeLimitRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['amount'],
    properties: {
      amount: { type: 'number', nullable: false }
    }
};

export const M2PCardUpgradeLimitRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to upgrade the limit and upgrade the limit',
    required: true,
    content: {
        'application/json': { schema: M2PCardUpgradeLimitRequestSchema }
    }
}

export interface M2PCardUpgradeLimitRequest {
    amount: number;
}

