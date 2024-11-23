import { inject } from '@loopback/core';
import {
    BaseRoute, ErrorWriterOptions, FindRoute, Send,
    HttpErrors, InvokeMethod, LogError, ParseParams,
    Reject, RequestContext, RestBindings, SequenceHandler
} from '@loopback/rest';
import {
    AuthenticationBindings, AuthenticateFn,
    AUTHENTICATION_STRATEGY_NOT_FOUND,
    USER_PROFILE_NOT_FOUND
} from '@loopback/authentication';
import { uuid } from 'uuidv4';
import {
    AuthTokenPayload, CommonBindings, Logger, ServiceError
} from 'common-lib';
import { UserProfile } from '@loopback/security';
import { Bindings } from './models/bindings';
import { AuthCardSessionPayload } from './models/config.model';
import { MethodMetadata } from './decorators';
import { ApiMockData } from './resources/data/api-data';


const SequenceActions = RestBindings.SequenceActions;

interface ApiSuccessResponse {
    status: 'success';
    code?: string;
    message?: string;
    data: any
}

interface ApiErrorResponse {
    status: 'error';
    code?: string;
    error: {
        code?: string;
        message: string,
        details?: any;
    };
}

export class AppSequence implements SequenceHandler {

    constructor(
        @inject(RestBindings.Http.CONTEXT) private context: RequestContext,
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
        @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
        @inject(SequenceActions.SEND) public send: Send,
        @inject(SequenceActions.REJECT) public reject: Reject,
        @inject(RestBindings.SequenceActions.LOG_ERROR) protected logError: LogError,
        @inject(RestBindings.ERROR_WRITER_OPTIONS, { optional: true })
        protected errorWriterOptions: ErrorWriterOptions,
        @inject(AuthenticationBindings.AUTH_ACTION)
        protected authenticationRequest: AuthenticateFn) { }

    async handle(requestContext: RequestContext) {
        const requestId: string = uuid();
        // binding `requestId` so that it is available for injection
        requestContext.bind(Bindings.Request.ID).to(requestId);

        const { request, response } = requestContext;
        const object: any = {
            request: {
                id: requestId,
                // method: request.method,
                // originalUrl: request.originalUrl,
                // enable if needed
                // headers: request.headers,
                ip: request.socket.remoteAddress,
                // userAgent: request.headers['user-agent']
            },
            response: {}
        }

        try {

            // adding request id to request header
            request.headers['X-Request-ID'] = requestId;
            // adding request id to response header
            response.setHeader('X-Request-ID', requestId);
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');

            // finding route 
            const route: any = this.findRoute(request);

            // enables jwt authentication for protected endpoints.
            const userProfile: UserProfile | undefined =
                await this.authenticationRequest(request);
            if (userProfile) { // non protected endpoints
                const tokenPayload: AuthTokenPayload = userProfile.data;
                object.loginId = tokenPayload.userLoginId;
                requestContext.bind(CommonBindings.Model.AUTH_TOKEN_PAYLOAD).to(tokenPayload);

                const authCardSessionPayload: AuthCardSessionPayload = <AuthCardSessionPayload>{
                    requestId: requestId,
                    loginId: tokenPayload.userLoginId,
                    deviceId: tokenPayload.deviceId,
                    userLocalId: tokenPayload.user.userLocalId,
                    partnerId: tokenPayload.partner.partnerId,
                    userPartnerId: tokenPayload.partner.userPartnerId,
                    partnerCifNo: tokenPayload.partner.partnerCifNo
                };
                requestContext.bind(Bindings.Model.AUTH_CARD_SESSION_PAYLOAD).to(authCardSessionPayload);
            }

            // parsing request parameters
            let args: any[] = [];
            try {
                request.on('data', function (chunk: any) {
                    object.request.body = Buffer.from(chunk).toString();
                });
                // parsing request parameters
                args = await this.parseParams(request, route);
            } catch (e: any) {
                throw e;
            }

            // get method metadata
            // const methodMetadata: MethodMetadata | undefined =
            //     await this.getMethodMetadata(route, requestContext, args);
            // Logger.info(requestId, 'AppSequence.handle', 'method metadata', methodMetadata);


            const virtual = request.headers['virtual-data'];
            const result: any = <ApiSuccessResponse>{
                status: 'success'
            };

            if (route.path.startsWith('/explorer')) {
                const result: any = await this.invoke(route, args);
                this.send(response, result);
                return;
            }

            if (virtual && virtual === 'true') {
                result.data = this.getVirtualData(request.originalUrl);
                this.send(response, result);
            } else {
                result.data = await this.invoke(route, args);
                object.response.data = result;

                if (request.path.startsWith('/card/download/statement')) {
                    // response.setHeader('Content-Type', 'application/octet-stream');
                    // response.setHeader('Content-Disposition', 'attachment; filename="statement.pdf"');
                    // response.send(result.data);
                } else {
                    this.send(response, result);
                }
                // this.send(response, result);
            }
            Logger.info(requestId, 'AppSequence.handle', 'SUCCESS', object);
        } catch (e: any) {
            switch (e.code) {
                case AUTHENTICATION_STRATEGY_NOT_FOUND:
                case USER_PROFILE_NOT_FOUND:
                    Object.assign(e, { statusCode: 401 }) /* Unauthorized */
                    break;
                default:

                    break;
            }

            if (typeof e === 'string') {
                object.response = <ApiErrorResponse>{
                    status: 'error',
                    // code: '0',
                    error: {
                        message: e,
                        code: '0'
                    }
                }
            } else if (typeof e === 'object') {
                if (e instanceof ServiceError) {
                    object.response = <ApiErrorResponse>{
                        status: 'error',
                        // code: e.type.code,
                        error: {
                            message: e.type.description,
                            code: e.type.code
                        }
                    }

                } else if (e instanceof Error) {
                    object.response = <ApiErrorResponse>{
                        status: 'error',
                        // code: '0',
                        error: {
                            message: e.message,
                            code: '0'
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
                // code: '0',
                error: {
                    message: e,
                    code: '0'
                }
            }

            this.reject(requestContext, e);

            if (typeof e === 'string') {
                object.error = { message: e };
            } else if (typeof e === 'object') {
                object.error = {
                    name: e.name,
                    message: e.message,
                    stack: e.stack
                };
            } else {
                object.error = e;
                console.error(`Unknown error type while processing request - RequestId:[${object.id}]`, e);
            }

            /*if (e.statusCode === 422) {
                this.handle422Error(context, e);
                return;
            }*/
            this.reject(requestContext, e);
        } finally {
            if (object.error)
                Logger.error(requestId, 'AppSequence.handle', '-', object);
        }
    }

    async getMethodMetadata(route: BaseRoute, context: any, args: any[]): Promise<MethodMetadata | undefined> {
        try {
            // Create the invocation context
            // const invocationContext = await route.invoke(context);
            const invocationContext = await route.invokeHandler(context,
                args
            );
            // Retrieve method metadata
            const controller = invocationContext.target;
            const methodName = invocationContext.methodName;

            // Access method metadata using context.get
            const method = invocationContext.method;
            // const methodMetadata: MethodMetadata = this.reflector.getMetadata(
            //     'methodMetadata',
            //     method
            // );

            const methodMetadata: MethodMetadata = await this.context
                .get(`${controller.constructor.name}.methods.${methodName}.metadata`);
            return methodMetadata;
        } catch (e: any) {
            console.error(e)
            return undefined;
        }
    }

    handle422Error(context: RequestContext, httpError: HttpErrors.HttpError) {
        if (httpError.statusCode === 422) {
            const customizedMessage: any = 'My customized validation error message';

            const customizedProps: any = { details: httpError.details };
            if (this.errorWriterOptions?.debug) {
                customizedProps.stack = httpError.stack
            };

            const errorData = {
                statusCode: 422,
                message: customizedMessage,
                resolution: 'Contact your admin for troubleshooting.',
                code: 'VALIDATION_FAILED',
                ...customizedProps
            };

            context.response.status(200).send(errorData);

            // 4. log the error using RestBindings.SequenceActions.LOG_ERROR
            // this.logError(httpError, httpError.statusCode, context.request);

            // The error was handled
            return;
        }
    }

    getVirtualData(path: string): any {
        if (!ApiMockData[path]) {
            throw new HttpErrors.ServiceUnavailable('Mock data is not available');
        }
        return ApiMockData[path];
    }
}
