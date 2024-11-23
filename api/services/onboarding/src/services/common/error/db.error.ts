import { ErrorType } from "./error";

export class DbError extends Error {
    type: ErrorType;
    data: any;

    constructor(type: ErrorType, data?: any) {
        super(type.description);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DbError);
        }
        this.name = DbError.name;
        this.type = type;
        this.data = data;
    }
}

export const DbErrorCodes = {

}