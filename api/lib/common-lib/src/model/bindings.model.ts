import { BindingKey } from "@loopback/core";
import { TokenService } from "../service/token.service";
import { ActionTokenPayload, AuthTokenPayload, OtpTokenPayload } from "./token.model";
import { DataSourceConfig } from "../db";
import { OtpService } from "../service/otp.service";
import { KaleryaApiConfig, KaleryaApiService } from "../service/communication/provider/kalerya-api.service";
import { SmsService } from "../service";

/**
 * Binding keys
 */
export namespace CommonBindings {
    export const Config = {
        CMS_DATASOURCE_CONFIG: BindingKey.create<DataSourceConfig>(
            'CommonBindings.Config.CMS_DATASOURCE_CONFIG',
        ),
        KALERYA_API_CONFIG: BindingKey.create<KaleryaApiConfig>(
            'CommonBindings.Config.KALERYA_API_CONFIG',
        )
    };

    export const Service = {
        TOKEN_SERVICE: BindingKey.create<TokenService>(
            'CommonBindings.Service.TOKEN_SERVICE'
        ),
        OTP_SERVICE: BindingKey.create<OtpService>(
            'CommonBindings.Service.OTP_SERVICE'
        ),
        Communication: {
            SMS_SRVICE: BindingKey.create<SmsService>(
                'CommonBindings.Service.SMS_SRVICE'
            )
        }
    };

    export const Variable = {
        TOKEN_SECRET: BindingKey.create<string>(
            'CommonBindings.Variable.TOKEN_SECRET'
        ),
        AUTH_TOKEN_EXPIRES_IN: BindingKey.create<string>(
            'CommonBindings.Variable.AUTH_TOKEN_EXPIRES_IN'
        ),
        ACTION_TOKEN_EXPIRES_IN: BindingKey.create<string>(
            'CommonBindings.Variable.ACTION_TOKEN_EXPIRES_IN'
        ),
        OTP_TOKEN_EXPIRES_IN: BindingKey.create<string>(
            'CommonBindings.Variable.OTP_TOKEN_EXPIRES_IN'
        )
    };

    export const Model = {
        AUTH_TOKEN_PAYLOAD: BindingKey.create<AuthTokenPayload>(
            'CommonBindings.Model.AUTH_TOKEN_PAYLOAD'
        ),
        ACTION_TOKEN_PAYLOAD: BindingKey.create<ActionTokenPayload>(
            'CommonBindings.Model.ACTION_TOKEN_PAYLOAD'
        ),
        OPT_TOKEN_PAYLOAD: BindingKey.create<OtpTokenPayload>(
            'CommonBindings.Model.OPT_TOKEN_PAYLOAD'
        )
    }
}