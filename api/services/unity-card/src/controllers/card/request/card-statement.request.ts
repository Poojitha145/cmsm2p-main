import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";

/**
 * Card Update Statement Date Request 
 */
export const M2PCardUpdateStatementDateRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['statementDate'],
    properties: {
        statementDate: { type: 'number', nullable: false, minimum: 1, maximum: 31 }
    }
};

export const M2PCardUpdateStatementDateRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to update the statement date for a given customer',
    required: true,
    content: {
        'application/json': { schema: M2PCardUpdateStatementDateRequestSchema }
    }
}

export interface M2PCardUpdateStatementDateRequest {
    statementDate: string;
}
