import { inject } from "@loopback/core";
import { post, requestBody } from "@loopback/rest";
import { Bindings } from "../../models/bindings";
import { Logger } from "common-lib";
import { AwsService } from "../../services/common/aws/aws.service";

export class WebhookController {

    constructor(
        @inject(Bindings.Request.ID)
        private requestId: string,
        @inject(Bindings.Service.AWS_SERVICE)
        private awsService: AwsService) {

    }

    @post('/webhook/m2p/notification')
    m2pNotification(@requestBody() payload: any) {
        try {
            const message: string = (typeof payload === 'object') ?
                JSON.stringify(payload) : payload;
            this.awsService.notificationQueue.publish(this.requestId, message);
        } catch (e: any) {
            Logger.critical(this.requestId, 'WebhookController.m2pNotification', 'unable to handle event', e, payload);
            throw e;
        }
        return true;
    }
}