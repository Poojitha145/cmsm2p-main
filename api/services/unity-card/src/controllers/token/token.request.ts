import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";

/**
 * Generate Token
 */
export const GenerateTokenRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['pin', 'action'],
    properties: {
        pin: { type: 'string', nullable: false, minLength: 4, maxLength: 4, default: '' },
        action: { type: 'string', nullable: false, default: '' },
    }
};

export const GenerateTokenRequestBody: Partial<RequestBodyObject> = {
    description: 'This api will token to access api services',
    required: true,
    content: {
        'application/json': { schema: GenerateTokenRequestSchema }
    }
}

export class GenerateTokenRequest {
    pin: string;
    action: string;

    constructor(object?: any) {
        if (object) {
            this.pin = object.pin;
            this.action = object.action;
        }
    }
}
