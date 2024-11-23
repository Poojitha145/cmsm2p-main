import axios, { AxiosInstance, AxiosResponse, CreateAxiosDefaults } from "axios";
import { RandomUtil } from "../util/random-util";
import { HttpErrorCodes, ServiceError } from "./error";

export interface HttpRequestDefaults extends CreateAxiosDefaults {

}

export enum HttpRequestMethod {
    Get = 'Get',
    Post = 'Post'
}

export interface HttpEncryptOptions {
    secretKey: string;
}

export enum HttpResponseType {
    Error = 'error',
    Success = 'success'
}

export interface HttpResponse<R> {
    type: HttpResponseType;
    status: number;
    statusText: string;
    headers: any;
    data: R;
}

export interface HttpSuccessResponse<R> extends HttpResponse<R> {
    type: HttpResponseType.Success;
}

export interface HttpErrorResponse<R> extends HttpResponse<R> {
    type: HttpResponseType.Error;
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

    getBody(): any {
        return {};
    }

    getQueryParameters(): string {
        return '';
    }

    getPath(): string {
        return this.path;
    }
}

export interface HttpRequestOptions {

}

export interface HttpOptions {
    useEncryption?: boolean;
    encryptOptions?: HttpEncryptOptions;
    defaults?: HttpRequestDefaults;
}

export const requestMap: any = {};

export abstract class HttpService {
    protected readonly axiosInstance!: AxiosInstance;
    protected readonly httpOptions!: HttpOptions;
    protected readonly defaultOptions = {
        validateStatus: (status: any) => {
            return status < 500; // Resolve only if the status code is less than 500
        }
    };

    constructor(options: HttpOptions) {
        this.httpOptions = options;
        this.axiosInstance = axios.create(options.defaults);
    }

    /**
     * 
     * @param request 
     * @param options 
     * @returns 
     */
    protected async call<R>(request: HttpRequest, options?: HttpRequestOptions):
        Promise<HttpResponse<R>> {
        if (request.method === HttpRequestMethod.Get) {
            return await this.callGet<R>(request);
        } else {
            return await this.callPost<R>(request);
        }
    }

    /**
     * Send a GET request
     * @param request 
     * @returns 
     */
    protected async callGet<R>(request: HttpRequest): Promise<HttpResponse<R>> {
        return new Promise<any>(async (resolve: any, reject: any) => {
            try {
                await this.axiosInstance.get(request.getPath() + this.getRequestQueryParameters(request),
                    Object.assign(this.defaultOptions, request.options))
                    .then((axiosResponse: AxiosResponse) => {
                        resolve(this.onSuccessResponse(request, axiosResponse));
                    }).catch((error: any) => {
                        if (error instanceof ServiceError) {
                            reject(error);
                        }

                        if (error.code === "ECONNREFUSED" || error.code === "ECONNABORTED") {
                            reject(new ServiceError(HttpErrorCodes.HTTP_CLIENT_RESPONSE_TIMEOUT_ERROR));
                        }

                        if (error.response) {
                            resolve(this.onErrorResponse(request, error.response));
                        }

                        reject(new ServiceError(HttpErrorCodes.HTTP_CLIENT_ERROR), error);
                    });
            } catch (e: any) {
                reject(new ServiceError(HttpErrorCodes.HTTP_REQUEST_ERROR), e.message);
            }
        });
    }

    /**
     * Send a POST request
     * @param request 
     * @returns 
     */
    protected async callPost<R>(request: HttpRequest): Promise<HttpResponse<R>> {
        return new Promise<any>(async (resolve: any, reject: any) => {
            try {
                await this.axiosInstance.post(request.getPath() + this.getRequestQueryParameters(request),
                    this.getRequestBody(request), Object.assign(this.defaultOptions, request.options))
                    .then((axiosResponse: AxiosResponse) => {
                        resolve(this.onSuccessResponse(request, axiosResponse));
                    }).catch((error: any) => {
                        console.log(error)
                        if (error instanceof ServiceError) {
                            reject(error);
                        }

                        if (error.code === "ECONNREFUSED" || error.code === "ECONNABORTED") {
                            reject(new ServiceError(HttpErrorCodes.HTTP_CLIENT_RESPONSE_TIMEOUT_ERROR));
                        }

                        if (error.response) {
                            resolve(this.onErrorResponse(request, error.response)); //TODO - need to check
                        }

                        reject(new ServiceError(HttpErrorCodes.HTTP_CLIENT_ERROR), error);
                    });

            } catch (e: any) {
                reject(new ServiceError(HttpErrorCodes.HTTP_REQUEST_ERROR), e.message);
            }
        });
    }

    /**
     * Get payload for request
     * @param request 
     * @returns 
     */
    protected getRequestBody(request: HttpRequest): any {
        return request.getBody();
    }

    /**
     * Get query parameters for request
     * @param request 
     * @returns 
     */
    protected getRequestQueryParameters(request: HttpRequest): any {
        return request.getQueryParameters();
    }

    /**
     * Handle success response
     * @param request 
     * @param response 
     * @returns 
     */
    protected onSuccessResponse(request: HttpRequest, response: AxiosResponse | any): any {
        return response.data;
    }

    /**
     * Handle error response
     * @param request 
     * @param response 
     * @returns 
     */
    protected onErrorResponse(request: HttpRequest, response: any): any {
        return response.data;
    }
}