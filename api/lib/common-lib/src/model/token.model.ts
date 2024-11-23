export interface TokenConfig {
    secretKey: string;
    authTokenDuration: string;
    actionTokenDuration: string;
    otpTokenDuration: string;
}

export enum TokenType {
    Auth = 'Auth',
    Action = 'Action',
    Otp = 'Otp',
    Open = 'Open'
}

export interface TokenPayload {
    tokenId: string;
    tokenType: TokenType;
    deviceId: string;
    userLoginId: string;
}

export interface TokenPartnerPayload {
    partnerId: string;
    userPartnerId: string;
    partnerCifNo: string;
}

export interface TokenUserPayload {
    userLocalId: string;
    displayName: string;
    mobileNumber?: string;
    dob?: string;
    email?: string;
}

export interface AuthTokenPayload extends TokenPayload {
    authTokenId: string;
    user: TokenUserPayload;
    partner: TokenPartnerPayload;
}

export interface ActionTokenPayload extends AuthTokenPayload {
    actionTokenId: string;
    actionType: string;
}

export interface OtpTokenPayload extends TokenPayload {
    otpTokenId: string;
    otpId: string;
    otp?: string;
    channel: string;
}