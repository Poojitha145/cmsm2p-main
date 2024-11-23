import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { WorkflowRequestSchema, WorkflowRequest } from "./onboarding.request";


/**
 * Onboarding Verify DDupe Workflow
 */
export const DDupeWorkflowRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['workflowId', 'localUserId'],
    properties: {
        workflowId: WorkflowRequestSchema.WorkflowId,
        localUserId: WorkflowRequestSchema.LocalUserId
    }
};

export const DDupeWorkflowRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: DDupeWorkflowRequestSchema }
    }
}

export interface DDupeWorkflowRequest extends WorkflowRequest {
    panNumber?: string;
    dob?: string;
    phoneNumber?: string;
    aadharNumber?: string;
}