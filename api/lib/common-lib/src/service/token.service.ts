import { scryptSync } from 'crypto';
import { promisify } from 'util';
import { HttpErrors } from '@loopback/rest';
import { BindingScope, inject, injectable } from '@loopback/core';
import { Crypto } from '../core/crypto';
import { ActionTokenPayload, AuthTokenPayload, CommonBindings, TokenPayload, TokenType } from '../model';
import { RandomUtil } from '../util';
import { ErrorCode } from '../core';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);


export const TokenError = {
    FAILED_TO_SEND_OTP: new ErrorCode('5000', 'Failed to send OTP. Please try again'),
    INVALID_OTP_ID: new ErrorCode('5001', 'OTP id not found'),
    INVALID_OTP: new ErrorCode('5002', 'Wrong OTP. Please try again'),
    CREATE_OTP_ATTEMPTS_EXCEEDED: new ErrorCode('5003', 'Max create OTP attempts exceeded in an interval'),
    MAX_OTP_ATTEMPTS_REACHED: new ErrorCode('5004', 'Max invalid OTP attempts exceeded'),
    OTP_EXPIRED: new ErrorCode('5005', 'OTP expired'),

    FAILED_TO_CREATE_OTP: new ErrorCode('5006', 'Failed to create OTP. Please try again'),
    FAILED_TO_SAVE_OTP: new ErrorCode('5007', 'Failed to save OTP. Please try again'),
    OTP_ALREADY_VERIFIED: new ErrorCode('5008', 'OTP is already verified'),
}

@injectable({ scope: BindingScope.SINGLETON, tags: CommonBindings.Service.TOKEN_SERVICE })
export class TokenService {
    private readonly encrypt: boolean = true;
    private readonly secretKey: any;

    constructor(
        @inject(CommonBindings.Variable.TOKEN_SECRET)
        public readonly tokenSecret: string) {
        this.secretKey = scryptSync(tokenSecret, 'salt', 32);
    }

    /**
     * Generate's encrypted action token using AuthTokenPayload details
     * @param action 
     * @param authTokenPayload 
     * @returns 
     */
    async generateActionToken(action: string,
        authTokenPayload: AuthTokenPayload): Promise<string> {
        const actionTokenPayload: ActionTokenPayload = <ActionTokenPayload>Object.assign({
            actionTokenId: RandomUtil.uuid(),
            actionType: action
        }, authTokenPayload);
        return await this.generateToken(actionTokenPayload, '30s');
    }

    /**
     * Generate's encrypted token
     * @param data 
     * @param expiresIn 
     * @returns 
     */
    async generateToken(data: any, expiresIn: string): Promise<string> {
        try {
            data = JSON.stringify(data);
            if (this.encrypt) {
                data = Crypto.encrypt(data, this.secretKey);
            }
            let token: string = await signAsync({ data: data }, this.tokenSecret, {
                expiresIn: expiresIn
            });
            return token;
        } catch (e: any) {
            throw new HttpErrors.Unauthorized(`error generating token : ${e}`);
        }
    }

    /**
     * Verify encrypted action token
     * @param token 
     * @returns data
     */
    async verifyAuthToken(action: string, token: string): Promise<any> {
        const tokenPayload: TokenPayload = await this.verifyToken(token);
        if (tokenPayload.tokenType !== TokenType.Auth) {
            throw new HttpErrors.Unauthorized('invalid auth token type');
        }
        const authTokenPayload: AuthTokenPayload = <AuthTokenPayload>tokenPayload;
        return authTokenPayload;
    }

    /**
     * Verify encrypted action token
     * @param token 
     * @returns data
     */
    async verifyActionToken(action: string, token: string): Promise<any> {
        const tokenPayload: TokenPayload = await this.verifyToken(token);
        if (tokenPayload.tokenType !== TokenType.Action) {
            throw new HttpErrors.Unauthorized('invalid action token type');
        }
        const actionTokenPayload: ActionTokenPayload = <ActionTokenPayload>tokenPayload;
        if (!actionTokenPayload || actionTokenPayload.actionType !== action) {
            throw new HttpErrors.Unauthorized('action token not registered for this service');
        }
        return actionTokenPayload;
    }

    /**
     * Verify encrypted token
     * @param token 
     * @returns data
     */
    async verifyToken(token: string): Promise<any> {
        if (!token) {
            throw new HttpErrors.Unauthorized(
                `error verifying token : 'token' is null`);
        }
        try {
            const tokenData: any = await verifyAsync(token, this.tokenSecret);
            if (this.encrypt) {
                tokenData.data = Crypto.decrypt(tokenData.data, this.secretKey);
                tokenData.data = JSON.parse(tokenData.data);
            }
            return tokenData.data;
        } catch (e: any) {
            throw new HttpErrors.Unauthorized(`error verifying token : ${e.message}`);
        }
    }
}