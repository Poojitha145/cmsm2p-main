import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";


/**
 * Generate OTP 
 */
export const GenerateOtpRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': {
            type: 'object',
            required: ['localId', 'template'],
            properties: {
                localId: { type: 'string', },
                template: { type: 'string', enum: ['RESET_MPIN'] }
            }
        }
    }
}

export interface GenerateOtpRequest {
    loginId: string;
    localId: string;
    template: string;
}