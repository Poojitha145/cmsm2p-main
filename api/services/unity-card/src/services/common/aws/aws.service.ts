import { BindingScope, inject, injectable } from "@loopback/core";
import { Bindings } from "../../../models/bindings";
import { S3Client, SqsClient } from "common-lib";

export interface AwsConfig {
    region: string;
    profile: string;

    notificationQueueUrl: string;
    communicationQueueUrl: string;

    maxNumberOfMessagesQueue?: number;
    waitTimeSecondsQueue?: number;
}

@injectable({ scope: BindingScope.SINGLETON, tags: Bindings.Service.AWS_SERVICE })
export class AwsService {
    public readonly S3: S3Client;
    public readonly notificationQueue: SqsClient;
    public readonly communicationQueue: SqsClient;

    constructor(
        @inject(Bindings.Config.AWS_CONFIG)
        private awsConfig: AwsConfig) {
        this.S3 = new S3Client();
        this.notificationQueue = new SqsClient('NotificationQueue',
            awsConfig.notificationQueueUrl);
        this.communicationQueue = new SqsClient('CommunicationQueue',
            awsConfig.communicationQueueUrl);
    }
}