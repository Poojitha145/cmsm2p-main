import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { ApiRequest } from "../../../models/request/api.request";
import { LoanWorkflowState } from "../../../services/workflow/loan-workflow-enums";


/**
 * Workflow Request
 */
export const WorkflowRequestSchema = {
    WorkflowId: <SchemaObject | ReferenceObject>{
        type: 'string'
    },
    LocalUserId: <SchemaObject | ReferenceObject>{
        type: 'string'
    }
}

export const BaseWorkflowRequestSchema: SchemaObject | ReferenceObject = {
    description: '',
    required: ['workflowId', 'localUserId'],
    properties: {
        workflowId: {
            type: 'string'
        },
        localUserId: {
            type: 'string'
        }
    }
}

export const WorkflowRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: BaseWorkflowRequestSchema }
    }
}

export interface WorkflowRequest extends ApiRequest {
    localUserId: string;
    workflowId: string;
    workflowState?: LoanWorkflowState;
}

/**
 * Create User Request
 */
export const CreateUserRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['phoneNumber'],
    properties: {
        phoneNumber: {
            type: 'string',
        }
    }
}

export const CreateUserRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: CreateUserRequestSchema }
    }
}

export interface CreateUserRequest extends ApiRequest {
    phoneNumber: string;
}

/**
 * Verify User Request
 */
export const VerifyUserRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['phoneNumber'],
    properties: {
        phoneNumber: {
            type: 'string',
        }
    }
}

export const VerifyUserRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: VerifyUserRequestSchema }
    }
}

export interface VerifyUserRequest extends ApiRequest {
    phoneNumber: string;
}

/**
 * Verify User Request
 */
export const UpdateDeviceInfoRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['phoneNumber'],
    properties: {
        phoneNumber: {
            type: 'string',
        }
    }
}

export const UpdateDeviceInfoRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: UpdateDeviceInfoRequestSchema }
    }
}

export interface UpdateDeviceInfoRequest extends ApiRequest {
    phoneNumber: string;
}
