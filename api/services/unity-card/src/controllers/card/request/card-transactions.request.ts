import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { M2PApiRequestSchema } from "./card-common.request";

/**
 * Fetch Transactions 
 */
export const M2PCardGetTransactionsRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['fromDate', 'toDate'],
    properties: {
        fromDate: M2PApiRequestSchema.Date_YYYY_DD_MM,
        toDate: M2PApiRequestSchema.Date_YYYY_DD_MM,
        status: {
            type: 'string',
            enum: ['BILLED', 'UNBILLED']
        }
    }
};

export const M2PCardGetTransactionsRequestBody: Partial<RequestBodyObject> = {
    description: 'This API can be used to query transactions along with status of authorise/settled for a card',
    required: true,
    content: {
        'application/json': { schema: M2PCardGetTransactionsRequestSchema }
    }
}

export enum TransactionStatus {
    'BILLED',
    'UNBILLED'
}

export interface M2PCardGetTransactionsRequest {
    fromDate: string;
    toDate: string;
    status?: TransactionStatus
}
