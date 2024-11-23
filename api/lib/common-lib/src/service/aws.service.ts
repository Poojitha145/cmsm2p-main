
import AWS from 'aws-sdk';
import stream from 'stream';
import { ApplicationError, ApplicationErrorCodes, Logger } from '../core';
import { PromiseResult } from 'aws-sdk/lib/request';

export interface SqsMessage {
    id: string;
    body: string;
}

/**
 * SQS Client
 */
export class SqsClient {
    public readonly name: string;
    private readonly sqs: AWS.SQS;
    private readonly queueUrl: string;
    private isRunning: boolean = false;
    private readonly options: { maxNumberOfMessages: number, waitTimeSeconds: number };

    constructor(name: string, queueUrl: string, options: {
        maxNumberOfMessages: number,
        waitTimeSeconds: number
    } = { maxNumberOfMessages: 10, waitTimeSeconds: 20 }) {
        this.name = name;
        this.sqs = new AWS.SQS();
        this.queueUrl = queueUrl;
        this.options = options;

        Logger.debug('#', 'SqsClient', 'initialized', { queue: this.name, url: this.queueUrl });
    }

    /**
     * Method to publish a message to the SQS queue
     * @param message 
     */
    async publish(requestId: string, message: string): Promise<void> {
        try {
            const request: AWS.SQS.Types.SendMessageRequest = {
                QueueUrl: this.queueUrl,
                MessageBody: message,
                MessageAttributes: { RequestId: { DataType: 'String', StringValue: requestId } }
            };
            // TODO - add attribute to message to get id
            const result: PromiseResult<AWS.SQS.SendMessageResult, AWS.AWSError>
                = await this.sqs.sendMessage(request).promise();
            Logger.debug(requestId, 'SqsClient.publish', 'sent message successfully',
                { queue: this.name, messageId: result.MessageId });
        } catch (e: any) {
            Logger.error(requestId, 'SqsClient.publish', 'sending message failed',
                e, { queue: this.name });
            throw e;
        }
    }

    /**
     * Method to subscribe and continuously receive messages from the SQS queue
     * @param callback 
     */
    async subscribe(callback: (message: AWS.SQS.Types.Message) => Promise<void>): Promise<void> {
        this.isRunning = true;
        let recentErrorAt: number = 0;

        while (this.isRunning) {
            try {
                const params: AWS.SQS.Types.ReceiveMessageRequest = {
                    QueueUrl: this.queueUrl,
                    // Maximum number of messages to retrieve (adjust as needed)
                    MaxNumberOfMessages: this.options.maxNumberOfMessages,
                    // Long-polling wait time (adjust as needed)
                    WaitTimeSeconds: this.options.waitTimeSeconds
                };

                const data: PromiseResult<AWS.SQS.ReceiveMessageResult, AWS.AWSError>
                    = await this.sqs.receiveMessage(params).promise();
                if (data.Messages) {
                    // Process received messages
                    for (const message of data.Messages) {
                        await callback(message);

                        // Delete the message from the queue once processed
                        if (message.ReceiptHandle) {
                            await this.deleteMessage(message);
                        }
                    }
                } else {
                    // Ignore...
                    // Logger.debug('#', 'SqsClient.subscribe', `no messages available queue: ${this.name}`);
                }
            } catch (e: any) {
                console.log(e)
                if (e.code === 'AWS.SimpleQueueService.NonExistentQueue') {
                    Logger.critical('#', 'SqsClient.subscribe', 'cannot subscribe to queue', e, { queue: this.name });
                    throw new ApplicationError(ApplicationErrorCodes.QUEUE_NOT_EXISTS, e);
                } else if (e.code === 'ConfigError') {
                    throw new ApplicationError(ApplicationErrorCodes.AWS_REGION_MISSING, e);
                }

                if (e.code === 'UnknownEndpoint' || e.originalError?.code === 'NetworkingError') {
                    if (Date.now() - recentErrorAt > 500) {
                        Logger.error('#', 'SqsClient.subscribe', 'receiving messages failed', e, { queue: this.name });
                    }
                    recentErrorAt = Date.now();
                } else {
                    Logger.error('#', 'SqsClient.subscribe', 'receiving messages failed', e, { queue: this.name });
                }
            }
        }
    }

    /**
     * Method to unsubscribe - stop receiving messages from the SQS queue
     */
    unsubscribe(): void {
        this.isRunning = false;
    }

    /**
     * Method to delete a message from the SQS queue
     * @param receiptHandle 
     */
    private async deleteMessage(message: AWS.SQS.Message): Promise<void> {
        if (!message.ReceiptHandle) return;
        try {
            const params: AWS.SQS.Types.DeleteMessageRequest = {
                QueueUrl: this.queueUrl,
                ReceiptHandle: message.ReceiptHandle
            };

            await this.sqs.deleteMessage(params).promise();

            let requestId: string | undefined = message.MessageAttributes?.['RequestId']?.StringValue;
            requestId = requestId ? requestId : '-';
            Logger.debug(requestId, 'SqsClient.deleteMessage',
                'message deleted successfully', { queue: this.name, messageId: message.MessageId });
        } catch (e: any) {
            Logger.error('#', 'SqsClient.deleteMessage',
                'deleting message failed', e, { queue: this.name, messageId: message.MessageId });
        }
    }
}

/**
 * S3 Client
 */
export class S3Client {
    private readonly s3: AWS.S3;

    constructor(
        private readonly s3Config: AWS.S3.Types.ClientConfiguration = {}
    ) {
        this.s3 = new AWS.S3(s3Config);
    }

    /**
     * to upload a fileto S3
     * @param bucketName 
     * @param key 
     * @param body 
     * @param options 
     * @returns 
     */
    async uploadFile(bucketName: string, key: string, body: Buffer,
        options?: AWS.S3.Types.PutObjectRequest): Promise<AWS.S3.ManagedUpload.SendData> {
        const params: AWS.S3.Types.PutObjectRequest = {
            Bucket: bucketName,
            Key: key,
            Body: body,
            ...options
        };

        return this.s3.upload(params).promise();
    }

    /**
     * to delete a file from S3
     * @param bucketName 
     * @param key 
     * @param body 
     * @param options 
     * @returns 
     */
    async deleteFile(bucketName: string, key: string, body: Buffer,
        options?: AWS.S3.Types.PutObjectRequest): Promise<PromiseResult<AWS.S3.DeleteObjectOutput, AWS.AWSError>> {
        const params: AWS.S3.Types.DeleteObjectRequest = {
            Bucket: bucketName,
            Key: key,
            ...options
        };

        return this.s3.deleteObject(params).promise();
    }

    /**
     * to get file information (object metadata) from S3
     * @param bucketName 
     * @param key 
     * @returns 
     */
    async getObjectInfo(bucketName: string, key: string): Promise<any> {
        try {
            const metadata: any = await this.s3.headObject({
                Bucket: bucketName,
                Key: key
            }).promise();
            const location: string = `https://${bucketName}.s3.amazonaws.com/${encodeURIComponent(key)}`;

            return {
                lastModified: metadata.LastModified,
                location: location,
                bucket: bucketName,
                key: key
            };
        } catch (e: any) {
            if (e.code === 'NotFound') {
                return null;
            }
            throw e;
        }
    }


    /**
     * to get file information (object metadata) from S3
     * @param bucketName 
     * @param key 
     * @returns 
     */
    getObjectStream(bucketName: string, key: string): stream.Readable {
        try {
            const stream: stream.Readable = this.s3.getObject({
                Bucket: bucketName,
                Key: key
            }).createReadStream();
            return stream;
        } catch (e: any) {
            throw e;
        }
    }
}

/**
 * S3 Client
 */
export class SecretsManagerClient {
    private readonly secretsManager: AWS.SecretsManager;

    constructor(region?: string) {
        this.secretsManager = new AWS.SecretsManager({ region: region });
    }

    /**
     * 
     * @param secretId 
     * @returns 
     */
    async getSecret(secretId: string): Promise<string | undefined> {
        try {
            const data: AWS.SecretsManager.GetSecretValueResponse = await this.secretsManager
                .getSecretValue({ SecretId: secretId }).promise();
            return data.SecretString;
        } catch (e: any) {
            throw e;
        }
    }
}
