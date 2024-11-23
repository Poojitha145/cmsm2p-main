import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";

/**
 * Card Repayment Request 
 */
export const M2PCardRepaymentRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['businessEntityId', 'business', 'amount', 'transactionType', 'transactionOrigin',
        'productId', 'externalTransactionId', 'description', 'otherPartyId', 'otherPartyName'],
    properties: {
        businessEntityId: { type: 'string', nullable: false, minLength: 1, maxLength: 50 },
        business: { type: 'string', nullable: false, minLength: 1, maxLength: 30 },
        amount: { type: 'number', nullable: false },
        transactionType: { type: 'string', nullable: false, minLength: 1, maxLength: 30 },
        transactionOrigin: { type: 'string', nullable: false, minLength: 1, maxLength: 30 },
        productId: { type: 'string', nullable: false },
        externalTransactionId: { type: 'string', nullable: false, minLength: 1, maxLength: 50 },
        description: { type: 'string', nullable: false, minLength: 1, maxLength: 50 },
        otherPartyId: { type: 'string', nullable: false, minLength: 1, maxLength: 25 },
        otherPartyName: { type: 'string', nullable: false, minLength: 1, maxLength: 25 }
    }
};

export const M2PCardRepaymentRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to repay the loan amount once the monthly statement is generated for a customer',
    required: true,
    content: {
        'application/json': { schema: M2PCardRepaymentRequestSchema }
    }
}

export interface M2PCardRepaymentRequest {
    businessEntityId: string;
    business: string;
    amount: string;
    transactionType: string;
    transactionOrigin: string;
    productId: string;
    externalTransactionId: string;
    description: string;
    otherPartyId: string;
    otherPartyName: string;
}

