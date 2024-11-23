import { ReferenceObject, SchemaObject } from "@loopback/rest";

export interface ApiSuccessResponseWithDataSchema<T> {
    status: 'success';
    data: T;

    type: 'object',
    required: ['status', 'data'],
    properties: {
        status: {
            type: 'string',
            nullable: false,

        },
        data: {
            type: 'object',
            nullable: false
        }
    }
}

export const ApiErrorStatusSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['status', 'code', 'error'],
    properties: {
        status: { type: 'string' },
        code: { type: 'string' },
        error: {
            type: 'object',
            required: ['message', 'code'],
            properties: {
                message: { type: 'string' },
                code: { type: 'string' },
                details: { type: 'string' }
            }
        }
    }
}

export const ApiSuccessStatusSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['status', 'data'],
    properties: {
        status: { type: 'string' },
        data: {
            type: 'object',
            required: ['message', 'code'],
            properties: {
                message: { type: 'string' },
                code: { type: 'string' },
                details: { type: 'string' }
            }
        }
    }
}

export interface ApiErrorResponseSchema {
    statusCode: number;
    code: string;
    error: {
        messge: string;
        code: string;
        details?: string;
    }
}

export const M2PApiRequestSchema = {
    PageNumber: <SchemaObject | ReferenceObject>{
        type: 'integer',
        minimum: 0,
        default: 0
    },

    PageSize: <SchemaObject | ReferenceObject>{
        type: 'integer',
        minimum: 1,
        default: 10
    },

    Date_YYYY_DD_MM: <SchemaObject | ReferenceObject>{
        type: 'string',
        format: 'date'
        // pattern: '^\d{4}-\d{2}-\d{2}$'
    },

    Boolean: <SchemaObject | ReferenceObject>{
        type: 'boolean'
    },

    Address: <SchemaObject | ReferenceObject>{
        type: 'array',
        nullable: false,
        minItems: 1,
        items: {
            type: 'object',
            nullable: false,
            properties: {
                title: { type: 'string', nullable: false, minLength: 1, maxLength: 30 },
                address1: { type: 'string', nullable: false, minLength: 1, maxLength: 30 },
                address2: { type: 'string', nullable: false, minLength: 1, maxLength: 30 },
                city: { type: 'string', nullable: false, minLength: 1, maxLength: 20 },
                state: { type: 'string', nullable: false, minLength: 1, maxLength: 20 },
                country: { type: 'string', nullable: false, minLength: 1, maxLength: 20 },
                pinCode: { type: 'string', nullable: false, minLength: 1, maxLength: 15 },
                fourthLine: { type: 'string', nullable: false, minLength: 1, maxLength: 30 }
            },
            required: ['title', 'address1', 'address2', 'city', 'state', 'country', 'pinCode', 'fourthLine'],
        }
    },
};

export const M2PApiResponseSchema = {

    getSuccesStatus200Schema(schema: any): SchemaObject | ReferenceObject {
        return {};
    }
}

export interface M2PEncryptedData {
    token: string;
    body: string;
    entity: string;
    refNo: string;
    key: string;
}
