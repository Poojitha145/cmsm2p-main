import {
    HttpRequest, HttpRequestMethod,
    HttpRequestOptions, HttpResponse, HttpService
} from '../../core/http';
import { RandomUtil } from "../../core/util";
import { SerivceErrorCodes, ServiceError } from "../../common/error/service.error";
import {
    CipherGCM, DecipherGCM, Sign, constants,
    createCipheriv, createDecipheriv, createSign,
    privateDecrypt, publicEncrypt, randomBytes
} from "crypto";

export interface M2PEncryptedRequest {
    entity: string;
    key: string;
    refNo: string;
    body: string;
    token: string;
}

export interface M2PDecryptedResponse {
    entity: string;
    data: any;
}

export abstract class M2PApiService extends HttpService {

    private readonly encrypt: boolean = true;
    private readonly userPrivateKey: string;
    private readonly m2pPublicKey: string;

    constructor() {
        super({
            useEncryption: true,
            defaults: {
                // baseURL: 'https://sit-secure.yappay.in/',
                baseURL: 'https://uat-federal-onboarding.m2pfintech.com',
                headers: {
                    common: {
                        'Authorization': 'YWRtaW46YWRtaW4=',
                        'TENANT': 'FDPAISABAZCR'
                    },
                    post: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/plain, application/json'
                    }
                },
                timeout: 60 * 1000
            },
            encryptOptions: {
                secretKey: ''
            }
        });

        try {
            // this.userPrivateKey = readFileSync(join(Config.Path.Resources, 'paisabazaar.com.pkcs8'), "utf8");
            // this.m2pPublicKey = readFileSync(join(Config.Path.Resources, 'm2psolutions_pub.cer'), "utf8");
        } catch (e: any) {
            console.log(e)
            throw new ServiceError(SerivceErrorCodes.PUBLIC_PRIVATE_KEYS_READ_ERROR, e.message);
        }
        this.encrypt = false;
    }

    protected async call<R>(request: HttpRequest,
        options?: HttpRequestOptions): Promise<R> {
        if (request.method === HttpRequestMethod.Get) {
            const response: HttpResponse<R> =
                await this.callGet<R>(request.path + request.getBody(), request.options);
            return <R>response.data;
        } else {
            const body: any = (this.encrypt) ? this.encryptRequestData(request) : request.getBody();
            const response: HttpResponse<R> =
                await this.callPost<R>(request.path, body, request.options);
            return <R>(this.encrypt) ? this.decryptResponseData<R>(response) : response.data;
        }
    }

    protected encryptRequestData(request: HttpRequest): any {
        try {
            const data: any = request.getBody();
            const refNo: string = RandomUtil.getString('0', 16);
            const sessionKeyByteBuffer: Buffer = randomBytes(32);
            const payload: string = (typeof data === 'string') ? data : JSON.stringify(data);
            const token: string = this.generateDigitalSignedToken(payload);
            const encryptedData = this.encryptData(payload, sessionKeyByteBuffer, refNo);
            const encryptedKey = this.encryptKey(sessionKeyByteBuffer);
            const encryptedEntity = this.encryptKey(Buffer.from('entityId'));
            return JSON.stringify({
                entity: encryptedEntity,
                key: encryptedKey,
                refNo,
                body: encryptedData,
                token,
            });
        }
        catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.HTTP_REQUEST_ENCRYPTION_ERROR, e.message);
        }
    }

    protected decryptResponseData<R>(response: HttpResponse<R>): any {
        try {
            const encryptedKey = Buffer.from(response.headers.key, 'base64');
            const encryptedEntity = Buffer.from(response.headers.entity, 'base64');
            const encryptedData = Buffer.from(<any>response.data, 'base64');
            const token = response.headers.hash;
            const refNo = response.headers.refNo;
            const sessionKey = this.decryptAndDecodeKey(encryptedKey);
            const entity: string = this.decryptAndDecodeKey(encryptedEntity).toString();
            let decryptedData: any = this.decryptBody(encryptedData, sessionKey, refNo);
            return JSON.parse(decryptedData);
        }
        catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.HTTP_RESPONSE_DECRYPTION_ERROR, e);
        }
    }

    private generateDigitalSignedToken(requestData: string): string {
        const sign: Sign = createSign('sha256');
        sign.update(requestData);
        return sign.sign(this.userPrivateKey, 'base64');
    }

    private encryptData(requestData: string, sessionKey: Buffer,
        messageRefNo: string): string {
        let cipher: CipherGCM = createCipheriv('aes-256-gcm',
            sessionKey, Buffer.from(messageRefNo), { authTagLength: 16 });
        cipher.setAutoPadding(false);
        const encrypted = Buffer.concat([cipher.update(requestData, 'utf8'),
        cipher.final(), cipher.getAuthTag()]);
        return encrypted.toString('base64');
    }

    private encryptKey(symmetricKey: Buffer): string {
        const encrypted: Buffer = publicEncrypt({
            key: this.m2pPublicKey,
            padding: constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        }, Buffer.from(symmetricKey));
        return encrypted.toString('base64');
    }

    private decryptAndDecodeKey(encryptedKey: Buffer): Buffer {
        let decryptedKey: Buffer = privateDecrypt({
            key: this.userPrivateKey,
            padding: constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, encryptedKey);
        return decryptedKey
    };

    private decryptBody(encryptedData: Buffer, sessionKey: Buffer,
        messageRefNo: string): string {
        const decipher: DecipherGCM = createDecipheriv('aes-256-gcm', sessionKey,
            Buffer.from(messageRefNo), { authTagLength: 16 });
        decipher.setAutoPadding(false);
        // Extract the authentication tag
        const authTag = encryptedData.slice(-16);
        // Extract the encrypted data
        const dataWithoutAuthTag = encryptedData.slice(0, -16);
        decipher.setAuthTag(authTag);
        const decrypted: Buffer = Buffer.concat([decipher.update(dataWithoutAuthTag),
        decipher.final()]);
        return decrypted.toString('utf-8');
    }
}