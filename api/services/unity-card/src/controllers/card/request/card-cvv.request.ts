import { OperationObject, ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { ApiErrorStatusSchema, ApiSuccessStatusSchema } from "./card-common.request";

/**
 * Card Get Cvv
 */
export const M2PCardGetCvvRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['kitNo', 'expiryDate', 'dob'],
    properties: {
        kitNo: { type: 'string', nullable: false, minLength: 1, maxLength: 16 },
        expiryDate: { type: 'string', nullable: false, minLength: 4, maxLength: 4 },
        dob: { type: 'string', nullable: false, minLength: 8, maxLength: 10 },
    }
};

export const M2PCardGetCvvRequestBody: RequestBodyObject = {
    description: 'This API is used to get cvv details of a card',
    required: true,
    content: {
        'application/json': { schema: M2PCardGetCvvRequestSchema }
    }
}

const GetCvvSuccessSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['status', 'data'],
    properties: {
        status: { type: 'string' },
        data: {
            type: 'object',
            required: ['cvv'],
            properties: {
                cvv: { type: 'string' }
            }
        }
    }
}

const GetCvvErrorSchemaExample: any = {
    status: 'error',
    code: 'SE',
    error: {
        message: 'Kit Not Assigned',
        code: 'Y2271'
    }
}

const GetCvvSuccessSchemaExample: any = {
    status: 'success',
    data: {
        cvv: '123'
    }
}



export interface M2PCardGetCvvRequest {
    kitNo: string;
    expiryDate: string;
    dob: string;
}

export interface M2PCardGetCvvResponse {
    kitNo: string;
    expiryDate: string;
    dob: string;
}

export const CardGetCvvOperationObject: OperationObject = {
    responses: {
        '200': {
            description: 'Success',
            content: {
                'application/json': {
                    schema: [ApiErrorStatusSchema, ApiSuccessStatusSchema],
                    example: [GetCvvErrorSchemaExample, GetCvvErrorSchemaExample]
                }
            }
        }
    },
    requestBody: M2PCardGetCvvRequestBody
}