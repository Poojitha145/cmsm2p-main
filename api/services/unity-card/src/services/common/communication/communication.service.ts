import { BindingScope, inject, injectable } from "@loopback/core";
import { Bindings } from "../../../models/bindings";
import { CommonBindings, SmsRequest, SmsService } from "common-lib";

@injectable({ scope: BindingScope.SINGLETON, tags: Bindings.Service.COMMUNICATION_SERVICE })
export class CommunicationService {

    constructor(
        @inject(CommonBindings.Service.Communication.SMS_SRVICE)
        private smsService: SmsService) {

    }

    async sendSms(request: SmsRequest): Promise<any> {
        return await this.smsService.send(request);
    }
}