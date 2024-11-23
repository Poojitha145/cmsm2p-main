import axios, { AxiosInstance, AxiosResponse, CreateAxiosDefaults } from "axios";
import { SerivceErrorCodes, ServiceError } from "../common/error/service.error";
import { RandomUtil } from "./util";

export interface HttpRequestDefaults extends CreateAxiosDefaults {

}

export enum HttpRequestMethod {
    Get = 'Get',
    Post = 'Post'
}

export interface HttpEncryptOptions {
    secretKey: string;
}

export abstract class HttpResponse<R> {

    public readonly type: 'error' | 'success';
    public readonly status: number;
    public readonly statusText: string;
    public readonly headers: any;
    public readonly data: R;

    constructor(type: 'error' | 'success', status: number,
        statusText: string, headers: any, data: R) {

        this.type = type;
        this.status = status;
        this.statusText, statusText;
        this.headers, headers;
        this.data = data;
    }
}

export class HttpSuccessResponse<R> extends HttpResponse<R> {

    constructor(status: number, statusText: string, headers: any, data: R) {
        super('success', status, statusText, headers, data);
    }
}

export class HttpErrorResponse<R> extends HttpResponse<R> {

    constructor(status: number, statusText: string, headers: any, data: R) {
        super('error', status, statusText, headers, data);
    }
}

export abstract class HttpRequest {
    public readonly _requestId: string;
    public readonly url: string;
    public readonly path: string;
    public readonly method: HttpRequestMethod;
    public readonly options: HttpRequestOptions;

    constructor(id: string, path: string, method: HttpRequestMethod = HttpRequestMethod.Get,
        options: HttpRequestOptions = {}) {
        this._requestId = id ? id : '_' + RandomUtil.uuid();
        this.path = path;
        this.method = method;
        this.options = options;
    }

    abstract getBody(): any;
}

export interface HttpRequestOptions {

}

export interface HttpOptions {
    useEncryption?: boolean;
    encryptOptions?: HttpEncryptOptions;
    defaults?: HttpRequestDefaults;
}

export abstract class HttpService {

    protected readonly axiosInstance!: AxiosInstance;
    protected readonly defaultOptions = {
        validateStatus: (status: any) => {
            return status < 500; // Resolve only if the status code is less than 500
        }
    };

    constructor(options: HttpOptions) {
        this.axiosInstance = axios.create(options.defaults);
    }

    protected async call<R>(request: HttpRequest, options?: HttpRequestOptions):
        Promise<HttpResponse<R>> {
        if (request.method === HttpRequestMethod.Get) {
            return await this.callGet<R>(request.path + request.getBody(), request.options);
        } else {
            return await this.callPost<R>(request.path, request.getBody(), request.options);
        }
    }

    protected async callGet<R>(path: string, options: any): Promise<HttpResponse<R>> {
        return new Promise<any>(async (resolve: any, reject: any) => {
            try {
                await this.axiosInstance.get(path, Object.assign(this.defaultOptions, options))
                    .then((axiosResponse: AxiosResponse) => {
                        const successResponse: HttpSuccessResponse<R> = new HttpSuccessResponse(
                            axiosResponse.status,
                            axiosResponse.statusText,
                            axiosResponse.headers,
                            axiosResponse.data
                        );
                        resolve(successResponse);
                    })
                    .catch((axiosError: any) => {
                        if (axiosError.code === "ECONNREFUSED" || axiosError.code === "ECONNABORTED") {
                            reject(new ServiceError(SerivceErrorCodes.HTTP_CLIENT_RESPONSE_TIMEOUT_ERROR));
                        }
                        if (axiosError.response) {
                            const errorResponse: HttpSuccessResponse<R> = new HttpSuccessResponse(
                                axiosError.response.status,
                                axiosError.response.statusText,
                                axiosError.response.headers,
                                axiosError.response.data
                            );
                            resolve(errorResponse);
                        }
                        reject(new ServiceError(SerivceErrorCodes.HTTP_CLIENT_RESPONSE_TIMEOUT_ERROR));
                    });

            } catch (e: any) {
                reject(new ServiceError(SerivceErrorCodes.HTTP_REQUEST_ERROR), e.message);
            }
        });
    }

    protected async callPost<R>(path: string, body: any, options: any): Promise<HttpResponse<R>> {
        return new Promise<any>(async (resolve: any, reject: any) => {
            try {
                await this.axiosInstance.post(path, body,
                    Object.assign(this.defaultOptions, options))
                    .then((axiosResponse: AxiosResponse) => {
                        const successResponse: HttpSuccessResponse<R> = new HttpSuccessResponse(
                            axiosResponse.status,
                            axiosResponse.statusText,
                            axiosResponse.headers,
                            axiosResponse.data
                        );
                        resolve(successResponse);
                    })
                    .catch((axiosError: any) => {
                        if (axiosError.code === "ECONNREFUSED" || axiosError.code === "ECONNABORTED") {
                            reject(new ServiceError(SerivceErrorCodes.HTTP_CLIENT_RESPONSE_TIMEOUT_ERROR));
                        }
                        if (axiosError.response) {
                            const errorResponse: HttpSuccessResponse<R> = new HttpSuccessResponse(
                                axiosError.response.status,
                                axiosError.response.statusText,
                                axiosError.response.headers,
                                axiosError.response.data
                            );
                            resolve(errorResponse);
                        }
                        reject(new ServiceError(SerivceErrorCodes.HTTP_CLIENT_RESPONSE_TIMEOUT_ERROR));
                    });

            } catch (e: any) {
                reject(new ServiceError(SerivceErrorCodes.HTTP_REQUEST_ERROR), e.message);
            }
        });
    }
}