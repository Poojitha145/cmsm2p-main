import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { WorkflowRequest, WorkflowRequestSchema } from "./onboarding.request";

/**
 * Verify Pan Workflow
 */
export const VerifyPanWorkflowRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['localUserId', 'workflowId', 'panNumber', 'firstName', 'lastName', 'dob'],
    properties: {
        workflowId: WorkflowRequestSchema.WorkflowId,
        localUserId: WorkflowRequestSchema.LocalUserId,
        panNumber: {
            type: 'string',
        },
        firstName: {
            type: 'string',
        },
        lastName: {
            type: 'string',
        },
        dob: {
            type: 'string',
        }
    }
};

export const VerifyPanWorkflowRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: VerifyPanWorkflowRequestSchema }
    }
}

export interface VerifyPanWorkflowRequest extends WorkflowRequest {
    panNumber: string;
    firstName: string;
    lastName: string;
    dob: string;
}