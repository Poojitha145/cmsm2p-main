import { randomUUID, randomInt } from 'crypto';
import { generate as generateOtp } from 'otp-generator';
import { xml2json, Options } from 'xml-js';
import { PhoneResult, phone as validatePhone } from 'phone';
import randomatic from 'randomatic';
import { Logger } from './logger';
import { maskJSON2 } from 'maskdata';
import moment, { Moment } from 'moment';

export namespace DataUtil {

    export function maskJson(json: any, keys: string[]): any {
        try {
            return maskJSON2(json, {
                stringMaskOptions: {
                    maskWith: '*',
                    maskAll: false
                },
                stringFields: keys
            });
        } catch (e: any) {
            Logger.error('-', 'DataUtil.maskJson', 'masking json', e, json);
        }
        return json;
    }
}

export namespace OtpUtil {

    export function generate6DigitOtp(): string {
        return generateOtp(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
    }

    export function generate4DigitOtp(): string {
        return generateOtp(4, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
    }
}

export namespace RandomUtil {

    export function uuid(): string {
        return randomUUID();
    }

    export function uuidWithoutHyphen(): string {
        return randomUUID().replace('-', '');
    }

    export function getString(pattern: 'aA0' | 'aA' | '0' = 'aA', length: number = 16): string {
        // return randomUUID().replace('-', '');
        return randomatic(pattern, length)
    }

    export function getInt(min: number, max: number): number {
        return randomInt(min, max);
    }
}

export namespace XmlUtil {

    export function toJson(xml: string, options?: Options.XML2JSON): any {
        return xml2json(xml, { alwaysArray: false, });
    }

    export function toJs(xml: string): any {

    }
}

export namespace Normalize {

    const phoneOptions: any = { country: 'IN' };

    export function phoneNumber(value: string): PhoneResult {
        return validatePhone(value, phoneOptions);
    }
}


export const DateFormat = {
    DD_MM_YYYY: 'DD-MM-YYYY',
    MM_DD_YYYY: 'MM-DD-YYYY'
}

export namespace DateUtil {

    export function getMoment(): Moment {
        return moment();
    }

    export function getDate(): Date {
        return moment().toDate();
    }

    export function add(duration: number, unit: 'days', date: Date | Moment | string | number = moment()): Date {
        return moment(date).add(duration, unit).toDate();
    }

    export function subtract(duration: number, unit: 'days', date: Date | Moment | string | number = moment()): Date {
        return moment(date).subtract(duration, unit).toDate();
    }

    export function format(date: Date | Moment | string | number, format: string): string {
        return moment(date).format(format);
    }
}