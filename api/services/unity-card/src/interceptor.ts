import { Interceptor, MetadataInspector } from "@loopback/core";
import { HttpErrors, RestBindings } from "@loopback/rest";
import { ActionTokenMethodMetadata } from "./decorators";
import { ActionTokenPayload, AuthTokenPayload, CommonBindings, TokenService } from "common-lib";

/**
 * 
 * @param invocationCtx 
 * @param next 
 * @returns 
 */
export const AuthenticateActionToken: Interceptor = async (invocationCtx, next) => {
    
    const methodMetadata: ActionTokenMethodMetadata | undefined =
        MetadataInspector.getMethodMetadata('MethodDecorator.actionTokenDecorator',
            invocationCtx.targetClass.prototype, invocationCtx.methodName);
    if (methodMetadata) {
        let request: any;
        let tokenService: TokenService | undefined;
        try {
            request = await invocationCtx.get(
                RestBindings.Http.REQUEST, { optional: true });
            tokenService = await invocationCtx.get(
                CommonBindings.Service.TOKEN_SERVICE, { optional: true });
        } catch (e: any) {
            throw new HttpErrors.InternalServerError('TokenService is not available'); // TODO - Service Error
        }

        if (request && tokenService) {
            const actionToken: string = request.headers['action-token'];
            const target: any = invocationCtx.target;
            if (!actionToken) {
                throw new HttpErrors.Unauthorized('Header: action-token doesn\'t exist'); // TODO - Service Error
            }
            const authTokenPayload: AuthTokenPayload = target.authTokenPayload;
            if (!authTokenPayload) {
                throw new HttpErrors.Unauthorized('authenticated token data not available'); // TODO - Service Error
            }

            const actionTokenPayload: ActionTokenPayload =
                await tokenService.verifyActionToken(methodMetadata.actionType, actionToken);
            if (actionTokenPayload.authTokenId !== authTokenPayload.authTokenId) {
                throw new HttpErrors.Unauthorized('action token out of sync');
            }
            return await next();
        }
    } else {
        throw new HttpErrors.HttpError('action token metadata not defined');
    }

    throw new HttpErrors.Unauthorized('authenticated failed');
};
