import { Application, Component, CoreBindings, LifeCycleObserver, inject, lifeCycleObserver } from "@loopback/core";
import { AwsService } from "./aws.service";
import { Bindings } from "../../../models/bindings";
import { Logger, RandomUtil, SqsMessage } from "common-lib";
import { M2PNotificationService } from "../../partner/m2p/m2p-notification.service";
import { CommunicationService } from "../communication/communication.service";

@lifeCycleObserver('aws-sqs-component')
export class AwsSqsComponent implements LifeCycleObserver {

    constructor(
        @inject(Bindings.Service.AWS_SERVICE)
        private awsService: AwsService,
        @inject(Bindings.Service.M2P_NOTIFICATION_SERVICE)
        private notificationService: M2PNotificationService,
        @inject(Bindings.Service.COMMUNICATION_SERVICE)
        private communicationService: CommunicationService) {

    }

    // Start the SQS consumer when the application starts
    async start(): Promise<void> {
        // notification messages handler
        this.awsService.notificationQueue.subscribe(async (message: AWS.SQS.Types.Message) => {
            let requestId: string | undefined = message.MessageAttributes?.['RequestId']?.StringValue;
            requestId = (requestId) ? requestId : '-';

            if (!message.Body) {
                Logger.warn(requestId, 'AwsSqsComponent.start.subscribe',
                    `notification message body is undefined - id: ${message.MessageId}`);
                return;
            }
            try {
                const body: any = JSON.parse(message.Body);
                this.notificationService.handleEvent(requestId, body);
                Logger.debug(requestId, 'AwsSqsComponent.start.subscribe',
                    `notification message processed successfully - id: ${message.MessageId}`);
            } catch (e: any) {
                Logger.error(requestId, 'AwsSqsComponent.start.subscribe',
                    `notification message processed successfully - id: ${message.MessageId}`);
                throw e;
            }
        });
        Logger.debug('#', 'AwsSqsComponent.start.subscribe', 'subscribed successfully for notification messages');

        // communication messages handler
        this.awsService.communicationQueue.subscribe(async (message: AWS.SQS.Types.Message) => {
            let requestId: string | undefined = message.MessageAttributes?.['RequestId']?.StringValue;
            requestId = (requestId) ? requestId : '-';
            if (!message.Body) {
                Logger.warn(requestId, 'AwsSqsComponent.start.subscribe',
                    `communication message body is undefined - id: ${message.MessageId}`);
                return;
            }
            try {
                const body: any = JSON.parse(message.Body);
                if (body.channel === 'SMS') {
                    this.communicationService.sendSms(body.request)
                }
                else {
                    Logger.warn(requestId, 'AwsSqsComponent.start.subscribe',
                        `unsupported communication channel - id: ${message.MessageId}`);
                }
                Logger.debug(requestId, 'AwsSqsComponent.start.subscribe',
                    `communication message processed successfully - id: ${message.MessageId}`);
            } catch (e: any) {
                Logger.error('#', 'AwsSqsComponent.start.subscribe',
                    `communication message processed successfully - id: ${message.MessageId}`);
                throw e;
            }
        });
        Logger.debug('#', 'AwsSqsComponent.start.subscribe', 'subscribed successfully for communication messages');
    }

    // Stop the SQS consumer when the application stops
    async stop(): Promise<void> {
        try {

        } catch (e: any) {

        }
        this.awsService.notificationQueue.unsubscribe();
        this.awsService.communicationQueue.unsubscribe();
        Logger.debug('#', 'AwsSqsComponent.stop', 'unsubscribed successfully from notification messages');
    }
}