import { ErrorType } from "./error";

export class ServiceError extends Error {
    type: ErrorType;
    data: any;

    constructor(type: ErrorType, data?: any) {
        super(type.description);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServiceError);
        }
        this.name = "ServiceError";
        this.type = type;
        this.data = data;
    }
}

export const SerivceErrorCodes = {

    SERVICE_ERROR: new ErrorType(1000, 'Service error'),

    DB_ERROR: new ErrorType(1001, 'datebase error'),

    // Http
    HTTP_CLIENT_CONNECTION_TIMEOUT_ERROR: new ErrorType(1101, 'Http client connection timeout'),
    HTTP_CLIENT_RESPONSE_TIMEOUT_ERROR: new ErrorType(1102, 'Http client response timeout'),
    HTTP_REQUEST_ERROR: new ErrorType(1102, 'Http client response timeout'),
    HTTP_REQUEST_ENCRYPTION_ERROR: new ErrorType(1102, 'Http request encryption error'),
    HTTP_RESPONSE_DECRYPTION_ERROR: new ErrorType(1102, 'Http response decryption error'),

    // formats and validations
    INVALID_FORMAT_PHONE_NUMBER: new ErrorType(1102, 'Invalid phone number format'),

    INTERNAL_SERVER_ERROR: new ErrorType(52500, 'We\'re temporarily experiencing technical difficulties'),

    // Config
    CONFIG_READ_ERROR: new ErrorType(2001, 'Configuration read error'),
    SECRET_KEYS_LOAD_ERROR: new ErrorType(2002, 'Unable to load secret keys'),
    PUBLIC_PRIVATE_KEYS_READ_ERROR: new ErrorType(2003, 'Public/Private keys read error'),

    USER_NOT_REGISTED: new ErrorType(5000, 'User not registered'),
    PHONE_NUMBER_NOT_REGISTERED: new ErrorType(1050, 'Phone number not registered'),
    FAILED_WORKFLOW_CREATE: new ErrorType(4000, 'Can\'t create a new workflow'),
    WORKFLOW_NOT_FOUND: new ErrorType(4001, 'Workflow not found'),
    WORKFLOW_OUT_OF_SYNC: new ErrorType(4002, 'Workflow out of sync for user'),
    WORKFLOW_NOT_ACTIVE: new ErrorType(4002, 'Workflow is not in active status'),
    WORKFLOW_STATE_NOT_FOUND: new ErrorType(4002, 'Workflow state not found'),
    FAILED_WORKFLOW_UPDATE: new ErrorType(4009, 'Failed to update Workflow state'),
    FAILED_WORKFLOW_SAVE_DOCUMENT: new ErrorType(4005, 'Failed to save workflow document'),
    WORKFLOW_DOCUMENT_NOT_FOUND: new ErrorType(4007, 'Workflow document not found'),
    FAILED_TO_PARSE_WORKFLOW_DOCUMENT: new ErrorType(4006, 'Failed to parse workflow document'),

    VERIFY_PAN_RESPONSE_BUILD_ERROR: new ErrorType(4002, 'Failed to build verify PAN response'),
    INVALID_PAN_ERROR: new ErrorType(4002, 'Invalid PAN error'),
    FAILED_TO_VERIFY_PAN: new ErrorType(4002, 'Failed to verify PAN'),
    FAILED_TO_VERIFY_DDUPE: new ErrorType(4002, 'Failed to verify DDupe'),
    VERIFY_NAME_DOB_RESPONSE_BUILD_ERROR: new ErrorType(4002, 'Failed to build verify Name DOB response'),
    FAILED_NAME_DOB_VALIDATION_ERROR: new ErrorType(4002, 'Failed to verify Name DOB'),
    FAILED_CREATING_EKYC_SESSION_ERROR: new ErrorType(4002, 'Failed to create EKYC session'),
    DDUPE_RESPONSE_BUILD_ERROR: new ErrorType(4002, 'Failed to build ddupe details response'),
    GET_EKYC_DETAILS_RESPONSE_BUILD_ERROR: new ErrorType(4002, 'Failed to build EKYC details response'),
    CIF_ENQUIRY_RESPONSE_BUILD_ERROR: new ErrorType(4002, 'Failed to build CIF enquiry response'),
    CIF_CREATION_RESPONSE_BUILD_ERROR: new ErrorType(4002, 'Failed to build CIF creation response'),



    // Encrypt
    ENCRYPTION_ERROR: new ErrorType(7002, 'Error while encryption'),

    // OTP
    FAILED_TO_SEND_OTP: new ErrorType(5000, 'Failed to send OTP. Please try again'),
    INVALID_OTP_ID: new ErrorType(5001, 'OTP id not found'),
    INVALID_OTP: new ErrorType(5002, 'Wrong OTP. Please try again'),
    CREATE_OTP_ATTEMPTS_EXCEEDED: new ErrorType(5003, 'Max create OTP attempts exceeded in an interval'),
    MAX_OTP_ATTEMPTS_REACHED: new ErrorType(5004, 'Max invalid OTP attempts exceeded'),
    OTP_EXPIRED: new ErrorType(5005, 'OTP expired'),

    FAILED_TO_CREATE_OTP: new ErrorType(5006, 'Failed to create OTP. Please try again'),
    FAILED_TO_SAVE_OTP: new ErrorType(5007, 'Failed to save OTP. Please try again'),
    OTP_ALREADY_VERIFIED: new ErrorType(5008, 'OTP is already verified'),

    // Communication
    UNKNOWN_CHANNEL_TYPE_ERROR: new ErrorType(5010, 'Unknown channel type'),
    UNKNOWN_VENDOR_ERROR: new ErrorType(5010, 'Unknown vendor'),
    FAILED_TO_SEND_SMS_ERROR: new ErrorType(5011, 'Failed to send SMS. Please try again'),
    FAILED_TO_SEND_EMAIL_ERROR: new ErrorType(5012, 'Failed to send EMAIL. Please try again'),
}