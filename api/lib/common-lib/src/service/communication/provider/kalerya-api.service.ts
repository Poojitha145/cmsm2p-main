import { BindingScope, inject, injectable } from "@loopback/core";
import { CommonBindings } from "../../../model";
import { HttpRequest, HttpRequestMethod, HttpService, Logger } from "../../../core";
import { AxiosResponse } from "axios";

export interface KaleryaApiConfig {
    URL: string;
    API_KEY: string;
    SID: string;
    SENDER: string;
    CALLBACK_WEBHOOK: string;
}

export class KaleryaSmsOtpRequest extends HttpRequest {
    to: string;
    body: string;
    sender: string;
    templateId: string;

    constructor(id: string) {
        super(id, '/messages', HttpRequestMethod.Post);
    }

    getBody(): any {
        return {
            to: this.to,
            body: this.body,
            type: 'OTP',
            sender: this.sender,
            template_id: this.templateId
        }
    }
}

export class KaleryaSmsRequest extends HttpRequest {
    to: string;
    body: string;
    sender: string;
    type: 'OTP' | 'TXN' | 'MKT' | 'DEFAULT';
    templateId?: string;

    constructor(id: string) {
        super(id, '/messages', HttpRequestMethod.Post);
    }

    getBody(): any {
        return {
            to: this.to,
            body: this.body,
            type: this.type ? this.type : 'DEFAULT',
            sender: this.sender,
            template_id: this.templateId
        }
    }
}

export class KaleryaApiService extends HttpService {

    constructor(
        private kaleryaApiConfig: KaleryaApiConfig) {
        super({});
        this.axiosInstance.defaults.baseURL = this.kaleryaApiConfig.URL + this.kaleryaApiConfig.SID;
        this.axiosInstance.defaults.headers['api-key'] = this.kaleryaApiConfig.API_KEY;
        this.axiosInstance.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    protected override getRequestBody(request: HttpRequest) {
        const body: any = request.getBody();
        Logger.info(request._requestId, 'KaleryaApiService.getRequestBody', 'Request body', body);
        return body;
    }

    protected override onSuccessResponse(request: HttpRequest,
        response: AxiosResponse<any, any>): any {
        const data: any = response.data;
        Logger.info(request._requestId, 'KaleryaApiService.onSuccessResponse', 'Response', data);
        return data;
    }

    protected override onErrorResponse(request: HttpRequest, response: any): any {
        const data: any = response.data;
        Logger.error(request._requestId, 'KaleryaApiService.onErrorResponse', 'Response error', data);
        return data;
    }

    async sendOtpSms(id: string, to: string, body: string, templateId: string): Promise<any> {
        const request: KaleryaSmsOtpRequest = new KaleryaSmsOtpRequest(id);
        request.to = to;
        request.body = body;
        request.sender = this.kaleryaApiConfig.SENDER;
        if (templateId) {
            request.templateId = templateId;
        }

        const result: any = await this.call(request);

        return result;
    }

    async sendSms(id: string, to: string, body: string,
        type: 'OTP' | 'TXN' | 'MKT' | 'DEFAULT', templateId?: string): Promise<any> {
        const request: KaleryaSmsRequest = new KaleryaSmsRequest(id);
        request.to = to;
        request.body = body;
        request.type = type;
        request.templateId = templateId;
        request.sender = this.kaleryaApiConfig.SENDER;

        const result: any = await this.call(request);

        return result;
    }
}