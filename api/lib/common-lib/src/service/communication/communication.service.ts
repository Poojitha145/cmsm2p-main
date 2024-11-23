import { BindingScope, inject, injectable } from "@loopback/core";
import { ErrorCode, Logger } from "../../core";
import { CommonBindings } from "../../model";
import { KaleryaApiConfig, KaleryaApiService } from "./provider/kalerya-api.service";

export namespace Communication {
    export enum ChannelType {
        Sms = 'Sms',
        Email = 'Email',
        WhatsApp = 'WhatsApp',
        Push = 'Push'
    }
}

export const SmsErrorCodes = {
    SMS_UNDELIVERED: new ErrorCode('5100', 'Failed to send SMS. Please try again'),
    SMS_NOT_SENT: new ErrorCode('5100', 'Message cannot be sent'),
}


export abstract class CommunicationChannel<T> {

    constructor() { }

    abstract send(request: T): Promise<void>;
}

export interface SmsRequest {
    id: string;
    to: string;
    type: 'OTP' | 'MKT' | 'TXN' | 'DEFAULT';
    body: string;
    templateId?: string
}

@injectable({
    scope: BindingScope.SINGLETON, tags: CommonBindings.Service.Communication.SMS_SRVICE
})
export class SmsService extends CommunicationChannel<SmsRequest> {

    private readonly kaleryaApiService: KaleryaApiService;

    constructor(@inject(CommonBindings.Config.KALERYA_API_CONFIG)
    private kaleryaApiConfig: KaleryaApiConfig) {
        super();

        this.kaleryaApiService = new KaleryaApiService(kaleryaApiConfig);
    }

    override async send(request: SmsRequest): Promise<any> {
        try {
            let result: any;

            if (request.type === 'OTP' && request.templateId) {
                result = await this.kaleryaApiService.sendOtpSms(request.id, request.to,
                    request.body, request.templateId);
            } else {
                result = await this.kaleryaApiService.sendSms(request.id, request.to,
                    request.body, request.type, request.templateId);
            }
            console.log('@@@@@@@@@', result)
            Logger.debug(request.id, 'SmsService.send', 'sent sms successfully', result);
        } catch (e: any) {
            Logger.error(request.id, 'SmsService.send', 'unable to send sms', e, request);
            throw e;
        }


    }
}