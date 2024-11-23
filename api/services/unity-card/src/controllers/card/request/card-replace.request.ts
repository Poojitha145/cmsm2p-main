import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { M2PApiRequestSchema } from "./card-common.request";

/**
 * Card Replace Request 
 */
export const M2PCardReplaceRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['oldKitNo'],
    properties: {
        newKitNo: { type: 'string', nullable: false },
        oldKitNo: { type: 'string', nullable: false }
    }
};

export const M2PCardReplaceRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to replace the card',
    required: true,
    content: {
        'application/json': { schema: M2PCardReplaceRequestSchema }
    }
}

export interface M2PCardReplaceRequest {
    newKitNo: string;
    oldKitNo: string;
}

