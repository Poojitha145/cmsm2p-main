import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { WorkflowRequestSchema, WorkflowRequest } from "./onboarding.request";


/**
 * Credit Limit Workflow
 */
export const SetLimitWorkflowRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['workflowId', 'localUserId', 'amount'],
    properties: {
        workflowId: WorkflowRequestSchema.WorkflowId,
        localUserId: WorkflowRequestSchema.LocalUserId,
        amount: {
            type: 'number',
            minimum: 1
        }
    }
};

export const SetLimitWorkflowRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: SetLimitWorkflowRequestSchema }
    }
}

export interface SetLimitWorkflowRequest extends WorkflowRequest {
    amount: number;
}