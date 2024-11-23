import { inject } from '@loopback/context';
import {
    ErrorWriterOptions,
    FindRoute, HttpErrors, InvokeMethod, LogError, ParseParams,
    Reject, RequestContext, RestBindings,
    Send, SequenceHandler,
} from '@loopback/rest';
import { RequestHeaderKeys } from './common/global.constants';
import { RequestBindings } from './services/core/binding-keys';
import { RandomUtil } from './services/core/util';
import { Logger } from './services/core/logger';
import { ServiceError } from './services/common/error/service.error';

const SequenceActions = RestBindings.SequenceActions;

interface ApiSuccessResponse {
    status: 'success';
    code?: number;
    message?: string;
    data: any
}

interface ApiErrorResponse {
    status: 'error';
    code?: number;
    error: {
        code?: number;
        message: string,
        details?: any;
    };
}

export class AppSequence implements SequenceHandler {
    constructor(
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
        @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
        @inject(SequenceActions.SEND) public send: Send,
        @inject(SequenceActions.REJECT) public reject: Reject,
        @inject(RestBindings.SequenceActions.LOG_ERROR) protected logError: LogError,
        @inject(RestBindings.ERROR_WRITER_OPTIONS, { optional: true })
        protected errorWriterOptions: ErrorWriterOptions) {

    }

    async handle(requestContext: RequestContext) {
        const requestId: string = RandomUtil.uuid();
        // binding `requestId` so that it is available for injection
        requestContext.bind(RequestBindings.RequestId).to(requestId);

        const { request, response } = requestContext;
        const object: any = {
            id: requestId,
            // method: request.method,
            // originalUrl: request.originalUrl,
            // enable if needed
            // headers: request.headers,
            ip: request.socket.remoteAddress,
            isDevice: request.headers['user-agent']
        }
        try {
            // adding request id to request header
            request.headers[RequestHeaderKeys.X_REQUEST_ID] = requestId;
            // adding request id to response header
            response.setHeader(RequestHeaderKeys.X_REQUEST_ID, requestId);
            // to get the payload if schema validation failed
            request.on('data', function (chunk: any) {
                object.body = Buffer.from(chunk).toString();
            });

            const deviceId: any = '123456789'; // request.get(RequestHeaderKeys.X_DEVICE_ID);
            const localUserId: any = '2f868330-b96e-4d22-a20a-d8a19bb0aebf'; // request.get(RequestHeaderKeys.X_LOCAL_USER_ID);

            const route = this.findRoute(request);
            object.deviceId = deviceId;
            object.localUserId = localUserId;

            requestContext.bind(RequestBindings.LocalUserId).to(localUserId);
            requestContext.bind(RequestBindings.DeviceId).to(deviceId);

            let args: any[] = [];
            try {
                // parsing request parameters
                args = await this.parseParams(request, route);
                console.log("ARGUMENTS: " + JSON.stringify(args));
            } catch (e: any) {
                throw e;
            }

            const result = await this.invoke(route, args);

            this.send(response, result);
            Logger.info(requestId, 'AppSequence.handle', '-', object);
        } catch (e: any) {
            if (typeof e === 'string') {
                object.response = <ApiErrorResponse>{
                    status: 'error',
                    code: 0,
                    error: {
                        message: e,
                        code: 0
                    }
                }
            } else if (typeof e === 'object') {
                if (e instanceof ServiceError) {
                    object.response = <ApiErrorResponse>{
                        status: 'error',
                        code: e.type.code,
                        error: {
                            message: e.type.description,
                            code: e.type.code
                        }
                    }

                } else if (e instanceof Error) {
                    object.response = <ApiErrorResponse>{
                        status: 'error',
                        code: 0,
                        error: {
                            message: e.message,
                            code: 0
                        }
                    }

                }
            }

            if (object.response) {
                requestContext.response.status(200).send(object.response);
                Logger.error(requestId, 'AppSequence.handle', '-', e, object);
                return;
            }

            Logger.critical(requestId, 'AppSequence.handle', '-', e, object);
            object.response = <ApiErrorResponse>{
                status: 'error',
                code: 0,
                error: {
                    message: e,
                    code: 0
                }
            }

            this.reject(requestContext, e);
            Logger.error(requestId, 'AppSequence.handle', '-', e, object);
        } // finally { }
    }
}