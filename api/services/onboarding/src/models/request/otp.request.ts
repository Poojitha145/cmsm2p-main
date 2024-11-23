
import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { ApiRequest } from "./api.request";
import { WorkflowRequest, WorkflowRequestSchema } from "../../controllers/onboarding/request/onboarding.request";

/**
 * Generate OTP 
 */
export const GenerateOtpRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['phoneNumber'],
    properties: {
        panNumber: {
            type: 'string',
        }
    }
};

export const GenerateOtpRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: GenerateOtpRequestSchema }
    }
}

export interface GenerateOtpRequest {
    phoneNumber: string;
}

/**
 * Verify OTP 
 */
export const VerifyOtpWorkflowRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['localUserId', 'workflowId', 'otpId', 'otp'],
    properties: {
        workflowId: WorkflowRequestSchema.WorkflowId,
        localUserId: WorkflowRequestSchema.LocalUserId,
        otpId: {
            type: 'string',
        },
        otp: {
            type: 'string',
        }
    }
};

export const VerifyOtpWorkflowRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: VerifyOtpWorkflowRequestSchema }
    }
}

export interface VerifyOtpWorkflowRequest extends WorkflowRequest {
    otpId: string;
    otp: string;
}

