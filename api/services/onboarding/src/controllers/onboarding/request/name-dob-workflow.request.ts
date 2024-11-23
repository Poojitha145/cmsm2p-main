import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { WorkflowRequest, WorkflowRequestSchema } from "./onboarding.request";

/**
 * EKYC Workflow
 */
export const NameDobWorkflowRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['localUserId', 'workflowId'],
    properties: {
        workflowId: WorkflowRequestSchema.WorkflowId,
        localUserId: WorkflowRequestSchema.LocalUserId
    }
};

export const NameDobWorkflowRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: NameDobWorkflowRequestSchema }
    }
}

export interface NameDobWorkflowRequest extends WorkflowRequest {
    dob: string;
    name: string;
}