export namespace M2PConfig {
    export const Card = {
        BILLING_DATES : [
            {
                "billingDate": 4,
                "paymentDate": 22
            },
            {
                "billingDate": 7,
                "paymentDate": 25
            },
            {
                "billingDate": 15,
                "paymentDate": 3
            },
            {
                "billingDate": 20,
                "paymentDate": 8
            },
            {
                "billingDate": 25,
                "paymentDate": 13
            }
        ]
    }
}

export class M2PCardApiConfig {

    readonly apiUrl: string;
    readonly tenant: string;
    readonly authorization: string;
    readonly timeout: number = 15 * 1000; // milliseconds
    readonly retries: number = 0;
    readonly encrypt: boolean;
    readonly publicKeyFile: string;
    readonly privateKeyFile: string;
    readonly setPinEncyptionKey: string;

    constructor(object: any) {
        if (!object) object = {};
        this.apiUrl = object.apiUrl;
        this.tenant = object.tenant;
        this.authorization = object.authorization;
        this.timeout = object.timeout;
        this.retries = object.retries;
        this.encrypt = object.encrypt;
        this.publicKeyFile = object.publicKeyFile;
        this.privateKeyFile = object.privateKeyFile;
        this.setPinEncyptionKey = object.setPinEncyptionKey;
    }
}