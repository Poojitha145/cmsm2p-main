import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";

/**
 * Card Lock-UnLock Request 
 */
export const M2PCardLockUnlockRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['kitNo', 'reason'],
    properties: {
        kitNo: { type: 'string', nullable: false },
        reason: { type: 'string', nullable: false }
    }
};

export const M2PCardLockUnlockRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to lock and unlock card',
    required: true,
    content: {
        'application/json': { schema: M2PCardLockUnlockRequestSchema }
    }
}

export interface M2PCardLockUnLockRequest {
    kitNo: string;
    reason: string;
}

/**
 * Card Block Request 
 */
export const M2PCardBlockRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['kitNo', 'reason'],
    properties: {
        kitNo: { type: 'string', nullable: false },
        reason: { type: 'string', nullable: false }
    }
};

export const M2PCardBlockRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to block card',
    required: true,
    content: {
        'application/json': { schema: M2PCardLockUnlockRequestSchema }
    }
}

export interface M2PCardBlockRequest {
    kitNo: string;
    reason: string;
}
