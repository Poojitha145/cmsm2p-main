import { LoanWorkflowState, LoanWorkflowStatus } from "../../../services/workflow/loan-workflow-enums";

export interface WorkflowResponse {
    localUserId: string;
    workflowId: string;
    workflowState: LoanWorkflowState;
    workflowStatus: LoanWorkflowStatus;
}

export interface CreateUserResponse {
    localUserId: string;
}

export interface VerifyUserResponse {
    localUserId: string;
}

export interface UpdateDeviceInfoResponse {
    localUserId: string;
}