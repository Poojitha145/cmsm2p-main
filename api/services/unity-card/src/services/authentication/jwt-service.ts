import { securityId, UserProfile } from '@loopback/security';
import { scryptSync } from 'crypto';
import { promisify } from 'util';
import { HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/core';
import { CommonBindings, Crypto } from 'common-lib';
import { Bindings } from '../../models/bindings';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService {
    private readonly encrypt: boolean = true;
    private readonly secretKey: any;

    constructor(
        @inject(CommonBindings.Variable.TOKEN_SECRET)
        public readonly tokenSecret: string,
        @inject(CommonBindings.Variable.AUTH_TOKEN_EXPIRES_IN)
        public readonly authTokenExpiresIn: string) {
        this.secretKey = scryptSync(tokenSecret, 'salt', 32);
    }

    /**
     * Generate's encrypted jwt token
     * @param userPrincipal 
     * @returns 
     */
    async generateToken(userPrincipal: UserProfile): Promise<string> {
        if (!userPrincipal) {
            throw new HttpErrors.Unauthorized(
                'error generating token : user profile is null');
        }
        try {
            if (this.encrypt) {
                userPrincipal.data = JSON.stringify(userPrincipal.data);
                userPrincipal.data = Crypto.encrypt(userPrincipal.data, this.secretKey);
            }
            let token: string = await signAsync(userPrincipal, this.tokenSecret, {
                expiresIn: this.authTokenExpiresIn,
            });
            return token;
        } catch (e: any) {
            throw new HttpErrors.Unauthorized(`error generating token : ${e}`);
        }
    }

    /**
     *  
     * @param token 
     * @returns 
     */
    async verifyToken(token: string): Promise<UserProfile> {
        if (!token) {
            throw new HttpErrors.Unauthorized(
                `error verifying token : 'token' is null`);
        }

        try {
            const userProfile: UserProfile = await verifyAsync(token, this.tokenSecret);
            if (this.encrypt) {
                userProfile.data = Crypto.decrypt(userProfile.data, this.secretKey);
                userProfile.data = JSON.parse(userProfile.data);
            }
            return <UserProfile>Object.assign(
                { [securityId]: userProfile[securityId] },
                {
                    data: userProfile.data
                }
            );
        } catch (e: any) {
            throw new HttpErrors.Unauthorized(`error verifying token : ${e.message}`);
        }
    }
}