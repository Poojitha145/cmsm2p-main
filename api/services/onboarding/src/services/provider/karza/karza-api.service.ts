import {
    HttpRequest, HttpRequestMethod,
    HttpRequestOptions, HttpResponse, HttpService
} from '../../core/http';
import {
    SerivceErrorCodes, ServiceError
} from "../../common/error/service.error";

export abstract class karzaApiService extends HttpService {

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

    }

    protected async call<R>(request: HttpRequest,
        options?: HttpRequestOptions): Promise<R> {
        if (request.method === HttpRequestMethod.Get) {
            const response: HttpResponse<R> =
                await this.callGet<R>(request.path + request.getBody(), request.options);
            return <R>response.data;
        } else {
            const response: HttpResponse<R> =
                await this.callPost<R>(request.path, request.getBody(), request.options);
            return <R>response.data;
        }
    }

    async addCustomer(): Promise<any> {

    }

    async generateUserToken(): Promise<any> {

    }

    async generateSessionToken(): Promise<any> {

    }

    async generateVKYCSession(): Promise<any> {

    }
}