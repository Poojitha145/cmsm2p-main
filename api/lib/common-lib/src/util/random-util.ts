import { randomUUID, randomBytes } from 'crypto';
import { generate } from 'otp-generator';

export namespace RandomUtil {

    export function uuid(): string {
        return randomUUID();
    }

    export function uuidWithoutHyphen(): string {
        return randomUUID().replace('-', '');
    }

    export function generateOtp(length: number = 4): string {
        return generate(length, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
    }

    export function generateBigNumber(length: number): string {
        let randomNumber = randomBytes(length).readBigUInt64BE(0);
        return randomNumber.toString().padStart(length, '0').slice(0, length);
    }
}