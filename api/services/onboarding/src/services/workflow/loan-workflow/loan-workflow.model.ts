import {
    LoanWorkflowState, LoanWorkflowStatus
} from "../loan-workflow-enums";

export interface LoanWorkflowModel {
    workflowType: LoanWorkflowState;
}

export interface LoanWorkflow {
    workflowId: string;
    workflowState: LoanWorkflowState;
    workflowStatus: LoanWorkflowStatus;
}

export enum DocumentStatus {
    VERIFIED = 'VERIFIED',
    NOT_VERIFIED = 'NOT_VERIFIED'
}

export enum DocumentType {
    PRE_APPLICATION_INFO = 'PRE_APPLICATION_INFO',
    PAN = 'PAN',
    DDUPE = 'DDUPE',
    EKYC_SESSION_ID = 'EKYC_SESSION_ID',
    EKYC = 'EKYC',
    KYC = 'KYC',
    BRE = 'BRE',
    VKYC = 'VKYC',
    SELFIE = 'SELFIE',
    USER_INFO = 'USER_INFO',
    PERSONAL_INFO = 'PERSONAL_INFO',
    CARD_INFO = 'CARD_INFO',
    BRE_REPORT = 'BRE_REPORT',
    CREDIT_LIMIT = 'CREDIT_LIMIT',
    CIF_CREATION = 'CIF_CREATION',
    CREDIT_REPORT = 'CREDIT_REPORT',
    REJECTION_REASON_DOC = 'REJECTION_REASON_DOC'
}