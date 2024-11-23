import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";

/**
 * User Create
 */
export const UserCreateRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['mobileNumber', 'displayName', 'email', 'dob'],
    properties: {
        mobileNumber: { type: 'string', nullable: false, minLength: 1, maxLength: 20, default: '+919700000000' },
        displayName: { type: 'string', nullable: false, minLength: 1, maxLength: 50, default: 'Saven QA' },
        email: { type: 'string', nullable: false, minLength: 1, maxLength: 50, default: 'qa@saven.in' },
        dob: { type: 'string', nullable: false, minLength: 1, maxLength: 20, default: '01-01-1990' }
    }
};

export const UserCreateRequestBody: Partial<RequestBodyObject> = {
    description: 'This api will create user account',
    required: true,
    content: {
        'application/json': { schema: UserCreateRequestSchema }
    }
}

export class UserCreateRequest {
    mobileNumber: string;
    displayName: string;
    email: string;
    dob: string;

    constructor(object?: any) {
        if (object) {
            this.mobileNumber = object.mobileNumber;
            this.displayName = object.displayName;
            this.email = object.email;
            this.dob = object.dob;
        }
    }
}

/**
 * User Login Create
 */
export const UserLoginCreateRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['mobileNumber', 'displayName', 'email', 'dob'],
    properties: {
        mobileNumber: { type: 'string', nullable: false, minLength: 1, maxLength: 20, default: '+919700000000' },
        displayName: { type: 'string', nullable: false, minLength: 1, maxLength: 50, default: 'Saven QA' },
        email: { type: 'string', nullable: false, minLength: 1, maxLength: 50, default: 'qa@saven.in' },
        dob: { type: 'string', nullable: false, minLength: 1, maxLength: 20, default: '01-01-1990' }
    }
};

export const UserLoginCreateRequestBody: Partial<RequestBodyObject> = {
    description: 'This api will create user account',
    required: true,
    content: {
        'application/json': { schema: UserCreateRequestSchema }
    }
}

export class UserLoginCreateRequest {
    mobileNumber: string;
    displayName: string;
    email: string;
    dob: string;

    constructor(object?: any) {
        if (object) {
            this.mobileNumber = object.mobileNumber;
            this.displayName = object.displayName;
            this.email = object.email;
            this.dob = object.dob;
        }
    }
}

/**
 * MPin
 */
export const VerifyMPinRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['mobileNumber', 'pin'],
    properties: {
        mobileNumber: { type: 'string', nullable: false, minLength: 1, maxLength: 20, default: '+919700000000' },
        pin: { type: 'string', nullable: false, minLength: 4, maxLength: 4, default: '1234' },
        // partnerId: { type: 'string', nullable: false, default: 'm2p' },
        // bankId: { type: 'string', nullable: false, default: 'federal' },
    }
};

export const VerifyMPinRequestBody: Partial<RequestBodyObject> = {
    description: 'This api will verify user mpin and generate access token',
    required: true,
    content: {
        'application/json': { schema: VerifyMPinRequestSchema }
    }
}

export class VerifyMPinRequest {
    mobileNumber: string;
    pin: string;
    // partner: string;
    // bank: string;

    constructor(object?: any) {
        if (object) {
            this.mobileNumber = object.mobileNumber;
            this.pin = object.pin;
            // this.partner = object.partner;
            // this.bank = object.bank;
        }
    }
}

export const CreateMPinRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['mobileNumber', 'pin'],
    properties: {
        mobileNumber: { type: 'string', nullable: false, minLength: 1, maxLength: 20 },
        pin: { type: 'string', nullable: false, minLength: 4, maxLength: 4 }
    }
};

export const CreateMPinRequestBody: Partial<RequestBodyObject> = {
    description: 'This api will verify user mpin and generate access token',
    required: true,
    content: {
        'application/json': { schema: VerifyMPinRequestSchema }
    }
}

export class CreateMPinRequest {
    mobileNumber: string;
    pin: string;

    constructor(object?: any) {
        if (object) {
            this.mobileNumber = object.mobileNumber;
            this.pin = object.pin;
        }
    }
}



/**
 * MPin Reset
 */
export const ResetMPinRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['localId', 'mobileNumber', 'partner', 'partialCardNo', 'expiryDate', 'pin', 'otpId', 'otp'],
    properties: {
        localId: { type: 'string', nullable: false, minLength: 1, maxLength: 50 },
        mobileNumber: { type: 'string', nullable: false, minLength: 1, maxLength: 20 },
        partner: { type: 'string', nullable: false, minLength: 1, maxLength: 20 },
        partialCardNo: { type: 'string', nullable: false, minLength: 4, maxLength: 4, default: '' },
        pin: { type: 'string', nullable: false, minLength: 4, maxLength: 4, default: '1234' },
        otpId: { type: 'string', nullable: false, default: '' },
        otp: { type: 'string', nullable: false, default: '' }
    }
};

export const ResetMPinRequestBody: Partial<RequestBodyObject> = {
    description: 'This api will reset user mpin and generate access token',
    required: true,
    content: {
        'application/json': { schema: ResetMPinRequestSchema }
    }
}

export class ResetMPinRequest {
    localId: string;
    mobileNumber: string;
    partner: string;
    partialCardNo: string;
    expiryDate: string;
    pin: string;
    otpId: string;
    otp: string;

    constructor(object?: any) {
        if (object) {
            this.localId = object.localId;
            this.mobileNumber = object.mobileNumber;
            this.partner = object.partner;
            this.partialCardNo = object.partialCardNo;
            this.expiryDate = object.expiryDate;
            this.pin = object.pin;
            this.otpId = object.otpId;
            this.otp = object.otp;
        }
    }
}
