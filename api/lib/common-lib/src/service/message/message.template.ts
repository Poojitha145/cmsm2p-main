import MessageFormat = require("message-format");

export class MessageTemplate<T> {
    private readonly formatter: MessageFormat;
    public readonly templateId?: string;

    constructor(message: string, templateId?: string) {
        this.formatter = new MessageFormat(message);
        this.templateId = templateId;
    }

    public getMessage(args: T): string {
        return this.formatter.format(<any>args);
    }
}

export namespace MessageTemplates {
    export const Sms = {
        RESET_MPIN_OTP: new MessageTemplate<{ otp: string }>('Hi! Use OTP {otp} to complete setting up a new M-PIN for your Saven card. Saven Technologies Limited.', '1707171282273442262'),
        LOGIN_OTP: new MessageTemplate<{ otp: string, duration: string }>('Your OTP is {otp} for Saven app login. This OTP is valid for {duration}. Saven Technologies Limited.', '1707171282255368847'),
        PAYMENT_OTP: new MessageTemplate<{ otp: string, card: string }>('{otp} OTP to complete your payment securely for your credit card ending with {card}. This is valid for 10 minutes. Remember, never share your OTP. Saven Technologies Limited.', '1707171195653051484'),

        STATEMENT: new MessageTemplate<{ month: string, dueDate: string }>('Hi! Your Saven credit card statement for {month} is here. Check your statement on the app and pay by {dueDate}. Saven Technologies Limited.', '1707171276857525599'),
        TRANSACTION: new MessageTemplate<{ amount: string, merchant: string }>('Hi! Your trxn of Rs. {amount} at {merchant} on your Saven credit card was successful. Not you? Head to Saven support on the app. Saven Technologies Limited.', '1707171276883178716')                                                        
    };

    export const Email = {
    }
}