
export class FederalBankApiUrlConfig {
    public readonly ekycUrl: string;
    public readonly ckycUrl: string;
    public readonly baseUrl: string;

    constructor(object: any) {
        this.ekycUrl = object.ekycUrl;
        this.ckycUrl = object.ckycUrl;
        this.baseUrl = object.baseUrl;
    }
}

export class FederalBankApiPathConfig {
    public readonly validatePan: string;
    public readonly validateNameDob: string;

    constructor(object: any) {
        this.validatePan = object.validatePan;
        this.validateNameDob = object.validateNameDob;
    }
}

export class FederalBankCifConfig {
    public readonly userAccessId: string;
    public readonly userAccessCode: string;
    public readonly senderCode: string;
    public readonly solId: string;

    constructor(object: any) {
        this.userAccessId = object.userAccessId;
        this.userAccessCode = object.userAccessCode;
        this.senderCode = object.senderCode;
        this.solId = object.solId;
    }
}

export class FederalBankCkycConfig {
    public readonly senderCode: string;
    public readonly accessID: string;
    public readonly accessCode: string;

    constructor(object: any) {
        this.senderCode = object.senderCode;
        this.accessID = object.accessID;
        this.accessCode = object.accessCode;
    }
}

export class FederalBankGenerateSessionConfig {
    public readonly securityToken: string;
    public readonly action: string;

    constructor(object: any) {
        this.securityToken = object.securityToken;
        this.action = object.action;
    }
}

export class FederalBankDedupeConfig {
    public readonly userId: string;

    constructor(object: any) {
        this.userId = object.userId;
    }
}

export class FederalBankPanValidationConfig {
    public readonly channelId: string;
    public readonly accessId: string;
    public readonly accessCode: string;
    public readonly apiPath: string;

    constructor(object: any) {
        this.channelId = object.channelId;
        this.accessId = object.accessId;
        this.accessCode = object.accessCode;
        this.apiPath = object.apiPath;
    }
}

export class FederalBankApiOnboardingConfig {
    public readonly url: string;

}

export class FederalBankApiConfig {
    public readonly clientId: string;
    public readonly clientSecret: string;
    public readonly certificatePath: string;
    public readonly certificatePassphrase: string;

    public readonly panValidationConfig: FederalBankPanValidationConfig;
    public readonly cifCreationConfig: FederalBankCifConfig

    public readonly apiUrlConfig: FederalBankApiUrlConfig;
    public readonly apiPathConfig: FederalBankApiPathConfig;

    public readonly ekycSecurityToken: string;
    public readonly ekycAction: string;

    constructor(object: any) {
        this.clientId = object.clientId;
        this.clientSecret = object.clientSecret;
        this.certificatePath = object.certificatePath;
        this.certificatePassphrase = object.certificatePassphrase;

        this.ekycSecurityToken = object.ekycSecurityToken;
        this.ekycAction = object.ekycAction;

        this.panValidationConfig = new FederalBankPanValidationConfig(object.panValidationConfig);

        this.apiUrlConfig = new FederalBankApiUrlConfig(object.apiUrlConfig);
        this.apiPathConfig = new FederalBankApiPathConfig(object.apiPathConfig);
    }
}