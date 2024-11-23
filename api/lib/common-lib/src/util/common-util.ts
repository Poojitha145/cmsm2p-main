import phone, { PhoneResult } from "phone";
import { ServiceError, ServiceErrorCodes } from "../core/error";

export class ObjectHelper {
    public static getValue(object: any, key: string): any {
        if (object[key] === undefined) {
            throw new Error(`property ${key} does not exists`);
        }

        return object[key];
    }

    public static getDefaultValue(object: any, key: string, defaultValue?: any): any {
        return object[key] || defaultValue;
    }
}

export function isNullOrUndefined(value: any): boolean {
    return (value === null || value === undefined);
}

export function isNotNullAndNotUndefined(value: any): boolean {
    return (value !== null && value !== undefined)
}

export function isNull(value: any): boolean {
    if (value === null) {
        return true;
    }
    return false;
}

export function toInteger(value: any): boolean {

    return (value == parseInt(value));
}

export function isInteger(value: any): boolean {
    return (value == parseInt(value));
}

export namespace Normalize {

    const phoneOptions: any = { country: 'IN' };

    export function phoneNumber(value: string): PhoneResult {
        const phoneResult: PhoneResult = phone(value, phoneOptions);
        if (!phoneResult.isValid || !phoneResult.phoneNumber) {
            throw new ServiceError(ServiceErrorCodes.INVALID_MOBILE_NUMBER, value);
        }
        return phoneResult;
    }
}