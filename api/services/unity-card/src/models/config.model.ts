import { TokenPartnerPayload, TokenUserPayload } from "common-lib";

export interface AppConfig {
    
    DB_NAME: string;
    DB_CONNECTOR: string;
    DB_URL: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;

    TOKEN_SECRET: string;
    AUTH_TOKEN_EXPIRES_IN: string;
    ACTION_TOKEN_EXPIRES_IN: string;
    OTP_TOKEN_EXPIRES_IN: string;
    
    APP_TEMP_DIRECTORY: string;
    APP_ROOT_BUCKET:string;
    
    AWS_PROFILE: string;
    AWS_REGION: string;
    
    NOTIFICATION_QUEUE_URL: string;
    COMMUNICATION_QUEUE_URL: string;

    PARTNER_M2P_PUBLIC_KEY_PATH: string;
    PARTNER_M2P_PRIVATE_KEY_PATH: string;
    PARTNER_M2P_API_ENCRYPTED: boolean;
    PARTNER_M2P_CARD_API_URL: string;
    PARTNER_M2P_CARD_API_TIMEOUT: number;
    PARTNER_M2P_CARD_API_RETRIES: number;
    PARTNER_M2P_CARD_API_SET_PIN_ENCRYPTION_KEY: string;
    PARTNER_M2P_CARD_API_TENANT_ID: string;
    PARTNER_M2P_CARD_API_AUTHORIZATION: string;

    KALERYA_URL: string;
    KALERYA_API_KEY: string;
    KALERYA_SID: string;
    KALERYA_SENDER: string;
    KALERYA_CALLBACK_WEBHOOK: string;        
}

export interface CardSessionPayload {
    requestId: string;
    userLocalId: string;
    partnerId: string;
    userPartnerId: string;
    partnerCifNo: string;
}

export interface AuthCardSessionPayload extends CardSessionPayload {
    loginId: string;
    deviceId: string;
}

export interface SessionPayload {
    requestId: string;
    loginId: string;
    deviceId: string;
    userLocalId: string;
    userPayload: TokenUserPayload;
    partnerPayload: TokenPartnerPayload;
}