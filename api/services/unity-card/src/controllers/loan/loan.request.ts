import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";

export enum LoanRequestType {
    'SINGLE',
    'MULTIPLE',
    'ENTIRE_OUTSTANDING'
}

export interface Transaction {
    extTxnId: string;
    amount: string;
}

export interface M2PEmiPreviewLoanRequest {
    ruleId: string;
    loanRequestType: LoanRequestType;
    transactions: Transaction[];
}

const M2PEmiPreviewLoanRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['ruleId', 'requestType', 'transactions'],
    properties: {
        ruledId: { type: 'string' },
        loanRequestType: {
            type: 'string',
            enum: ['SINGLE', 'MULTIPLE', 'ENTIRE_OUTSTANDING']
        },
        transactions: {
            type: 'array',
            required: [],
            properties: {
                extTxnId: { type: 'string' },
                amount: { type: 'string' }
            }
        }
    }
}

export const M2PEmiPreviewLoanRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used ',
    required: true,
    content: {
        'application/json': { schema: M2PEmiPreviewLoanRequestSchema }
    }
}

const M2PEmiCreateLoanRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['tenure', 'loanRequestId'],
    properties: {
        tenure: { type: 'string' },
        loanRequestId: { type: 'string' }
    }
}

export const M2PEmiCreateLoanRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to convert transaction into loan',
    required: true,
    content: {
        'application/json': { schema: M2PEmiCreateLoanRequestSchema }
    }
}

export interface M2PEmiCreateLoanRequest {
    tenure: string;
    loanRequestId: string;
}