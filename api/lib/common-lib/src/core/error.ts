//---------------------------------------------------------------------
// Error Code Definitions
//---------------------------------------------------------------------

export enum ErrorCodeType {
    Error = 'Error',
    Db = 'Db',
    Server = 'Server',
    Service = 'Service',
    Application = 'Application'
}

/**
 * Error Code
 */
export class ErrorCode {
    readonly type: string;
    readonly code: string;
    readonly description: string;

    constructor(code: string, description: string, type: ErrorCodeType = ErrorCodeType.Error) {
        this.code = code;
        this.description = description;
        this.type = type;
    }
}

/**
 * DB Error Code
 */
export class DbErrorCode extends ErrorCode {
    constructor(code: string, description: string) {
        super(code, description, ErrorCodeType.Db);
    }
}

/**
 * Service Error Code
 */
export class ServiceErrorCode extends ErrorCode {
    constructor(code: string, description: string) {
        super(code, description, ErrorCodeType.Service);
    }
}

/**
 * Server Error Code
 */
export class ServerErrorCode extends ErrorCode {
    constructor(code: string, description: string) {
        super(code, description, ErrorCodeType.Server);
    }
}

/**
 * Application Error Code
 */
export class ApplicationErrorCode extends ErrorCode {
    constructor(code: string, description: string) {
        super(code, description, ErrorCodeType.Application);
    }
}

//---------------------------------------------------------------------
// Error Class Definitions
//---------------------------------------------------------------------

/**
 * Base Error
 */
export abstract class BaseError extends Error {
    type: ErrorCode;
    data: any;

    constructor(name: string, type: ErrorCode, data?: any) {
        super(type.description);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServiceError);
        }

        this.name = name;
        this.type = type;
        this.data = data;
    }
}

/**
 * Service Error
 */
export class ServiceError extends BaseError {
    constructor(type: ServiceErrorCode, data?: any) {
        super('ServiceError', type, data);
    }
}

/**
 * Server Error
 */
export class ServerError extends BaseError {
    constructor(type: ErrorCode, data?: any) {
        super('ServerError', type, data);
    }
}

/**
 * Application Error
 */
export class ApplicationError extends BaseError {
    constructor(type: ErrorCode, data?: any) {
        super('ApplicationError', type, data);
    }
}

/**
 * DB Error
 */
export class DbError extends BaseError {
    constructor(type: DbErrorCode, data?: any) {
        super('DbError', type, data);
    }
}

//---------------------------------------------------------------------
// Error Codes Definitions
//---------------------------------------------------------------------
export const HttpErrorCodes = {
    HTTP_CLIENT_ERROR: new ErrorCode('HT100', 'Http client error.'),
    HTTP_CLIENT_CONNECTION_TIMEOUT_ERROR: new ErrorCode('HT101', 'Http client connection timeout.'),
    HTTP_CLIENT_RESPONSE_TIMEOUT_ERROR: new ErrorCode('HT102', 'Http client response timeout.'),
    HTTP_REQUEST_ERROR: new ErrorCode('HT103', 'Http client error.'),
    HTTP_REQUEST_ENCRYPTION_ERROR: new ErrorCode('HT104', 'Http request encryption error.'),
    HTTP_RESPONSE_DECRYPTION_ERROR: new ErrorCode('HT105', 'Http response decryption error.'),
};

export const ApplicationErrorCodes = {
    INTERNAL_SERVER_ERROR: new ErrorCode('AP100', 'Internal server error.'),
    QUEUE_NOT_EXISTS: new ErrorCode('AP101', 'Messaging queue not exists.'),
    AWS_REGION_MISSING: new ErrorCode('AP102', 'Missing region in aws config.'),
};

export const DbErrorCodes = {
    DB_ERROR: new DbErrorCode('DB100', 'Datebase error.'),
    ER_DUP_ENTRY: new DbErrorCode('DB101', 'Duplicate entry for a key.'),
    ER_NO_REFERENCED_ROW: new DbErrorCode('DB102', 'Foreign key constraint violation.'),
    ER_LOCK_WAIT_TIMEOUT: new DbErrorCode('DB103', ' Lock wait timeout exceeded; try restarting the transaction.'),
    ER_NO_SUCH_TABLE: new DbErrorCode('DB104', 'Table does not exist.'),
    ER_NO_SUCH_COLUMN: new DbErrorCode('DB105', 'Column does not exist.'),
    ER_NO_DEFAULT_FOR_FIELD: new DbErrorCode('DB106', 'Required field does not have a default value.'),
    ER_DATA_TOO_LONG: new DbErrorCode('DB107', 'Data too long for the column.'),
    ER_BAD_NULL_ERROR: new DbErrorCode('DB108', 'Null value in a column that requires a non-null value.'),
    ER_PARSE_ERROR: new DbErrorCode('DB109', 'Syntax error in SQL query.'),
    ER_TOO_MANY_CONNECTIONS: new DbErrorCode('DB110', 'Too many connections to the database.'),
    ER_ACCESS_DENIED_ERROR: new DbErrorCode('DB111', 'Access denied (user does not have the necessary permissions).'),
    ER_NOT_SUPPORTED_AUTH_MODE: new DbErrorCode('DB112', 'Unsupported authentication mode.')
};

export const ServiceErrorCodes = {
    INVALID_USER_ID: new ErrorCode('US100', 'invalid user id.'),
    INVALID_USER_LOGIN_ID: new ErrorCode('US101', 'Invalid user login id.'),
    MOBILE_NUMBER_NOT_REGISTERED: new ErrorCode('US102', 'Mobile number not registered.'),
    USER_ACCOUNT_IS_NOT_ACTIVATED: new ErrorCode('US103', 'User account is not activated.'),
    MOBILE_NUMBER_ALREADY_REGISTERED: new ErrorCode('US104', 'Mobile number is already registered.'),
    INVALID_MOBILE_NUMBER: new ErrorCode('US105', 'Invalid mobile number.'),

    PARTNER_API_NOT_AVAILABLE: new ErrorCode('PT100', 'Partner api is not available.'),
    PARTNER_DATA_NOT_FOUND: new ErrorCode('PT101', 'Partner data not found.'),
    PARTNER_DATA_INVALID: new ErrorCode('PT102', 'Partner data invalid.'),
    PARTNER_ENTITY_ID_ALREADY_REGISTERED: new ErrorCode('PT103', 'Partner entity id already registered.')    
};

export const Server = {
    INTERNAL_SERVER_ERROR: new ServerErrorCode('A0000', 'Internal server error.'),
    INTERNAL_SERVICE_ERROR: new ServerErrorCode('A0000', 'Internal service error.'),
    HTTP_CLIENT_RESPONSE_TIMEOUT_ERROR: new ServerErrorCode('H0011', 'Http client response timeout.'),
    HTTP_REQUEST_ERROR: new ServerErrorCode('H0012', 'Http client error.'),
    HTTP_REQUEST_ENCRYPTION_ERROR: new ServerErrorCode('H0013', 'Http request encryption error.'),
    HTTP_RESPONSE_DECRYPTION_ERROR: new ServerErrorCode('H0014', 'Http response decryption error.'),
};

export namespace DbErrorHandler {
    export function handle(e: any): never {
        if (e.code === 'ER_DUP_ENTRY') {
            throw new DbError(DbErrorCodes.ER_DUP_ENTRY, e);
        } else if (e.code === 'ER_NO_REFERENCED_ROW') {
            throw new DbError(DbErrorCodes.ER_NO_REFERENCED_ROW, e);
        } else {
            throw new DbError(DbErrorCodes.DB_ERROR, e);
        }
    }
}