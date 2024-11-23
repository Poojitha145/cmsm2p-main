export class ErrorType {
    readonly code: number;
    readonly description: string;

    constructor(code: number, description: string) {
        this.code = code;
        this.description = description;
    }
}

export class BaseError extends Error {
    type: ErrorType;
    data: any;

    constructor(classT: Function, type: ErrorType, data?: any) {
        super(type.description);

        this.name = classT.name;
        this.type = type;
        this.data = data;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, classT);
        }
    }
}

export const ErrorCodes = {
    // Http
    HTTP_CLIENT_CONNECTION_TIMEOUT_ERROR: new ErrorType(1101, 'Http client connection timeout'),
    HTTP_CLIENT_RESPONSE_TIMEOUT_ERROR: new ErrorType(1102, 'Http client response timeout'),
    HTTP_REQUEST_ERROR: new ErrorType(1102, 'Http client response timeout'),
    HTTP_REQUEST_ENCRYPTION_ERROR: new ErrorType(1102, 'Http request encryption error'),
    HTTP_RESPONSE_DECRYPTION_ERROR: new ErrorType(1102, 'Http response decryption error'),
}