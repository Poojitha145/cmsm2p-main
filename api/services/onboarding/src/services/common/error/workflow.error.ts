import { BaseError, ErrorType } from "./error";

export class WorkflowError extends BaseError {
    type: ErrorType;
    data: any;

    constructor(type: ErrorType, data?: any) {
        super(WorkflowError, type, data);
    }
}

export const WorkflowErrorCodes = {
    WORKFLOW_ERROR: new ErrorType(4000, 'Workflow error'),
    WORKFLOW_NOT_FOUND: new ErrorType(4001, 'Workflow not found'),
    WORKFLOW_OUT_OF_SYNC: new ErrorType(4002, 'Workflow out of sync for user'),
    WORKFLOW_NOT_ACTIVE: new ErrorType(4003, 'Workflow is not active'),
    WORKFLOW_EXPIRED: new ErrorType(4004, 'Workflow is expired'),
    WORKFLOW_DISABLED: new ErrorType(4005, 'Workflow is disabled'),
    WORKFLOW_REJECTED: new ErrorType(4006, 'Workflow is rejected'),
    WORKFLOW_STATE_NOT_FOUND: new ErrorType(4007, 'Workflow state not found'),
    WORKFLOW_UPDATE_FAILED: new ErrorType(4008, 'Failed to update Workflow state'),
    WORKFLOW_DOCUMENT_SAVE_FAILED: new ErrorType(4009, 'Failed to save workflow document'),
    WORKFLOW_DOCUMENT_NOT_FOUND: new ErrorType(4010, 'Workflow document not found'),
    WORKFLOW_DOCUMENT_READ_FAILED: new ErrorType(4011, 'Failed to read workflow document')
}