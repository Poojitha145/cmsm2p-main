import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";

/**
 * Card Set Pin
 */
export const M2PCardSetPinRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['pin', 'kitNo', 'expiryDate', 'dob'],
    properties: {
        pin: { type: 'string', nullable: false, minLength: 1 },
        kitNo: { type: 'string', nullable: false, minLength: 1, maxLength: 16 },
        expiryDate: { type: 'string', nullable: false, minLength: 4, maxLength: 4 },
        dob: { type: 'string', nullable: false, minLength: 8, maxLength: 8 },
    }
};

export const M2PCardSetPinRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to set the pin using the customer’s credentials.',
    required: true,
    content: {
        'application/json': { schema: M2PCardSetPinRequestSchema }
    }
}

export interface M2PCardSetPinRequest {
    kitNo: string;
    expiryDate: string;
    dob: string;
    pin: string;
}