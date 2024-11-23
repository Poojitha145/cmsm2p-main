import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";

/**
 * Account Registration
 */
export const TempAccountRegisterRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['mobileNumber', 'displayName', 'email', 'dob', 'entityId', 'mpin'],
    properties: {
        mobileNumber: { type: 'string', nullable: false, minLength: 1, maxLength: 20, default: '' },
        displayName: { type: 'string', nullable: false, minLength: 1, maxLength: 50, default: '' },
        email: { type: 'string', nullable: false, minLength: 1, maxLength: 50, default: '' },
        dob: { type: 'string', nullable: false, minLength: 1, maxLength: 20, default: '' },
        entityId: { type: 'string', nullable: false, minLength: 1, maxLength: 20, default: '' },
        mpin: { type: 'string', nullable: false, minLength: 1, maxLength: 4, default: '1234' },
    }
};

export const TempAccountRegisterRequestBody: Partial<RequestBodyObject> = {
    description: 'This api will register an account',
    required: true,
    content: {
        'application/json': { schema: TempAccountRegisterRequestSchema }
    }
}

export class TempAccountRegisterRequest {
    mobileNumber: string;
    displayName: string;
    email: string;
    dob: string;
    entityId: string;
    mpin: string;

    constructor(object?: any) {
        if (object) {
            this.mobileNumber = object.mobileNumber;
            this.displayName = object.displayName;
            this.email = object.email;
            this.dob = object.dob;
            this.entityId = object.entityId;
            this.mpin = object.mpin;
        }
    }
}


/**
 * Get Login Details
 */
export const GetLoginDetailsRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['mobileNumber'],
    properties: {
        mobileNumber: { type: 'string', nullable: false, minLength: 1, maxLength: 20, default: '' }
    }
};

export const GetLoginDetailsRequestBody: Partial<RequestBodyObject> = {
    description: 'This api will get the login details on a registered mobile number',
    required: true,
    content: {
        'application/json': { schema: GetLoginDetailsRequestSchema }
    }
}

export class GetLoginDetailsRequest {
    mobileNumber: string;

    constructor(object?: any) {
        if (object) {
            this.mobileNumber = object.mobileNumber;
        }
    }
}