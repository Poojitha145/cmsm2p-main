import { BindingKey } from "@loopback/core";
import { M2PCardApiConfig } from "../services/partner/m2p/card/m2p-card-api.config";
import { M2PCardService } from "../services/partner/m2p/card/m2p-card.service";
import { M2PCardApiService } from "../services/partner/m2p/card/m2p-card-api.service";
import { M2PEncryptDecryptService } from "../services/partner/m2p/m2p-encrypt-decrypt.service";
import { UserService } from "../services/user/user.service";
import { TokenService } from "@loopback/authentication";
import { AppConfig, AuthCardSessionPayload, CardSessionPayload, SessionPayload } from "./config.model";
import { DbService } from "../services/db.service";
import { M2PCardStatementService } from "../services/partner/m2p/card/m2p-card-statement.service";
import { AccountService } from "../services/account/account.service";
import { M2PNotificationService } from "../services/partner/m2p/m2p-notification.service";
import { AwsConfig, AwsService } from "../services/common/aws/aws.service";
import { CommunicationService } from "../services/common/communication/communication.service";

export namespace Bindings {
    export const Request = {
        ID: BindingKey.create<string>('Bindings.Request.ID')
    };

    export const Config = {
        APP_CONFIG: BindingKey.create<AppConfig>(
            'Bindings.Config.APP_CONFIG'),
        AWS_CONFIG: BindingKey.create<AwsConfig>(
            'Bindings.Config.AWS_CONFIG',
        )
    };

    export const Service = {
        JWT_SERVICE: BindingKey.create<TokenService>(
            'services.jwt.service'),
        M2P_CARD_SERVICE: BindingKey.create<M2PCardService>(
            'Bindings.Service.M2P_CARD_SERVICE'),
        M2P_CARD_API_SERVICE: BindingKey.create<M2PCardApiService>(
            'Bindings.Service.M2P_CARD_API_SERVICE'),
        M2P_ENCRYPT_DECRYPT_SERVICE: BindingKey.create<M2PEncryptDecryptService>(
            'Bindings.Service.M2P_ENCRYPT_DECRYPT_SERVICE'),
        USER_SERVICE: BindingKey.create<UserService>(
            'Bindings.Service.USER_SERVICE'),
        DB_SERVICE: BindingKey.create<DbService>(
            'Bindings.Service.DB_SERVICE'),
        M2P_CARD_STATEMENT_SERVICE: BindingKey.create<M2PCardStatementService>(
            'Bindings.Service.M2P_CARD_STATEMENT_SERVICE'),
        ACCOUNT_SERVICE: BindingKey.create<AccountService>(
            'Bindings.Service.ACCOUNT_SERVICE'),
        M2P_NOTIFICATION_SERVICE: BindingKey.create<M2PNotificationService>(
            'Bindings.Service.M2P_NOTIFICATION_SERVICE'),
        AWS_SERVICE: BindingKey.create<AwsService>(
            'Bindings.Service.AWS_SERVICE'),
        COMMUNICATION_SERVICE: BindingKey.create<CommunicationService>(
            'Bindings.Service.COMMUNICATION_SERVICE')
    };

    export const Variable = {
        M2P_CARD_API_CONFIG: BindingKey.create<M2PCardApiConfig>(
            'Bindings.Config.M2P_CARD_API_CONFIG')
    };

    export const Model = {
        CARD_SESSION_PAYLOAD: BindingKey.create<CardSessionPayload>(
            'Bindings.Model.CARD_SESSION_PAYLOAD'),
        AUTH_CARD_SESSION_PAYLOAD: BindingKey.create<AuthCardSessionPayload>(
            'Bindings.Model.AUTH_CARD_SESSION_PAYLOAD')
    };
}