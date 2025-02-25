export enum LoanType {
    CC = 'CC',
    PL = 'PL'
}

export enum LoanWorkflowState {
    PRE_APPLICATION = 'PRE_APPLICATION',
    PHONE_NUMBER = 'PHONE_NUMBER',
    PAN_NUMBER = 'PAN_NUMBER',
    PAN_DDUPE = 'PAN_DDUPE',
    AADHAR_DDUPE = 'AADHAR_DDUPE',
    PERSONAL_INFO = 'PERSONAL_INFO',
    LIMIT_CHECK = 'LIMIT_CHECK',
    CREDIT_LIMIT = 'CREDIT_LIMIT',
    EKYC = 'EKYC',
    NAME_DOB_CHECK = 'NAME_DOB_CHECK',
    VKYC = 'VKYC',
    SELFIE_CHECK = 'SELFIE_CHECK',
    CIF = 'CIF',
    CC_INSERT = 'CC_INSERT',
    M2P_REGISTER = 'M2P_REGISTERCC_INSERT',
    SIM_BIND = 'SIM_BIND',
    MPIN = 'MPIN',
    FINISHED = 'FINISHED'
}

export enum LoanWorkflowStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
    DISCARDED = 'DISCARDED'
}