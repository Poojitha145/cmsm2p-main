import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { WorkflowRequest, WorkflowRequestSchema } from "./onboarding.request";

/**
 * EKYC Workflow
 */

/**
 * Create Ekyc Request
 */
export const CreateEkycSessionWorkflowRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['localUserId', 'workflowId'],
    properties: {
        workflowId: WorkflowRequestSchema.WorkflowId,
        localUserId: WorkflowRequestSchema.LocalUserId
    }
};

export const CreateEkycSessionWorkflowRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: CreateEkycSessionWorkflowRequestSchema }
    }
}

export interface CreateEkycSessionWorkflowRequest extends WorkflowRequest {

}

/**
 * Verify Ekyc Request
 */
export const VerifyEkycSessionWorkflowRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['localUserId', 'workflowId', 'sessionId'],
    properties: {
        workflowId: WorkflowRequestSchema.WorkflowId,
        localUserId: WorkflowRequestSchema.LocalUserId,
        sessionId: {
            type: 'string'
        }
    }
};

export const VerifyEkycSessionWorkflowRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: VerifyEkycSessionWorkflowRequestSchema }
    }
}

export interface VerifyEkycSessionWorkflowRequest extends WorkflowRequest {
    sessionId: string;
}