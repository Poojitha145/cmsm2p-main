import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { M2PApiRequestSchema } from "./card-common.request";

/**
 * Physical Card Request 
 */
export const M2PCardPhysicalRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['kitNo', 'addressDto'],
    properties: {
        kitNo: { type: 'string', nullable: false, minLength: 1, maxLength: 16 },
        addressDto: {
            type: 'object',
            nullable: false,
            required: ['address'],
            properties: {
                address: M2PApiRequestSchema.Address
            }
        }
    }
}

export const M2PCardPhysicalRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to request a Physical Card',
    required: true,
    content: {
        'application/json': { schema: M2PCardPhysicalRequestSchema }
    }
}

export interface M2PCardAddressRequest {
    title: string,
    address1: string,
    address2: string,
    city: string,
    state: string,
    country: string,
    pinCode: string,
    fourthLine: string
}

export interface M2PCardPhysicalRequest {
    kitNo: string;
    addressDto: { address: M2PCardAddressRequest[] };
}
