
import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { ApiRequest } from "../../../models/request/api.request";

/**
 * Verify Phone Number
 */
export const VerifyPhoneWorkflowRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['phoneNumber'],
    properties: {
        phoneNumber: {
            type: 'string',
        }
    }
};

export const VerifyPhoneWorkflowRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: VerifyPhoneWorkflowRequestSchema }
    }
}

export interface VerifyPhoneWorkflowRequest extends ApiRequest {
    phoneNumber: string;
}