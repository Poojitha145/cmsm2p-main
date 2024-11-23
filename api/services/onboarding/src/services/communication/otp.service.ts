import { repository } from "@loopback/repository";
import { OtpRepository } from "../../repositories/otp.repository";
import { OtpEntity } from "../../models";
import { SerivceErrorCodes, ServiceError } from "../common/error/service.error";
import { OtpUtil, RandomUtil } from "../core/util";
import { BindingScope, injectable, service } from "@loopback/core";
import { SmsService } from "./sms.service";
import { ServiceBindings } from "../core/binding-keys";
import { Logger } from "../core/logger";
import { scryptSync } from "crypto";
import moment, { Moment } from "moment";
import { Communication } from "../core/constant/communication.constants";
import { Config } from "../core/constant/config.constants";

@injectable({ scope: BindingScope.SINGLETON, tags: ServiceBindings.OtpService })
export class OtpService {

    private readonly secretKey: any = scryptSync('CMS', 'salt', 32);

    constructor(
        @service(SmsService) private smsService: SmsService,
        @repository(OtpRepository) public otpRepository: OtpRepository) {
    }

    public async send(requestId: string, phoneNumber: string, channelType: Communication.ChannelType,
        expiredInSeconds: number = 180): Promise<string> {
        this.canCreateOtp(requestId, phoneNumber);

        const code: string = OtpUtil.generate6DigitOtp();
        let message: string = 'OTP - ' + code;
        Logger.info(requestId, 'OtpService.send', `sending ${channelType}`, message)
        if (channelType === Communication.ChannelType.Sms) {
            const status: boolean = await this.smsService.send('SavenCMS', phoneNumber,
                message, Communication.Vendor.Gupshup);
            Logger.info(requestId, 'OtpService.send', 'sent sms', message);
        } else {
            throw new ServiceError(SerivceErrorCodes.UNKNOWN_CHANNEL_TYPE_ERROR);
        }

        let otpEntity: OtpEntity = new OtpEntity();
        otpEntity.otpId = RandomUtil.uuid();
        try {
            otpEntity.code = code; // Crypto.encrypt(code, this.secretKey);
            otpEntity.mobileNumber = phoneNumber; // Crypto.encrypt(phoneNumber, this.secretKey);
            otpEntity.expiredInSeconds = expiredInSeconds;
            const newEntity: OtpEntity = await this.otpRepository.create(otpEntity);
            return newEntity.otpId;
        } catch (e: any) {
            Logger.error(requestId, 'OtpService.send', e.message, e);
            throw new ServiceError(SerivceErrorCodes.FAILED_TO_CREATE_OTP, e);
        }
    }

    public async verify(requestId: string, otpId: string,
        otpCode: string): Promise<boolean> {
        let otpEntity: OtpEntity | null;
        try {
            otpEntity = await this.otpRepository.findOne({ where: { otpId: otpId } });
        } catch (e: any) {
            Logger.error(requestId, 'OtpService.verify', 'db - finding otp with otpId', e);
            throw new ServiceError(SerivceErrorCodes.DB_ERROR);
        }
        if (!otpEntity) {
            Logger.info(requestId, 'OtpService.verify',
                SerivceErrorCodes.INVALID_OTP_ID.description);
            throw new ServiceError(SerivceErrorCodes.INVALID_OTP_ID);
        }

        if (otpEntity.verified) {
            Logger.info(requestId, 'OtpService.verify',
                SerivceErrorCodes.OTP_ALREADY_VERIFIED.description);
            throw new ServiceError(SerivceErrorCodes.OTP_ALREADY_VERIFIED);
        }

        try {
            // update attempts
            this.otpRepository.updateAll({
                attempts: otpEntity.attempts + 1
            }, { otpId: otpId });
        } catch (e: any) {
            Logger.error(requestId, 'OtpService.verify', 'db - updating attempts', e);
        }

        const now: Moment = moment().utc();
        const expiredAt: Moment = moment(otpEntity.createdAt)
            .add(otpEntity.expiredInSeconds, 'seconds');
        Logger.info(requestId, 'OtpService.verify',
            'verifying', { now: now, expiredAt: expiredAt, attempts: otpEntity.attempts });

        if (now.isAfter(expiredAt)) {
            Logger.info(requestId, 'OtpService.verify',
                SerivceErrorCodes.OTP_EXPIRED.description);
            throw new ServiceError(SerivceErrorCodes.OTP_EXPIRED);
        }

        if (otpEntity.attempts > 5) {
            Logger.info(requestId, 'OtpService.verify',
                SerivceErrorCodes.MAX_OTP_ATTEMPTS_REACHED.description);
            throw new ServiceError(SerivceErrorCodes.MAX_OTP_ATTEMPTS_REACHED);
        }

        // const code: string = Crypto.decrypt(otpEntity.code, this.secretKey);
        const code: string = otpEntity.code;
        if (code === otpCode) {
            try {
                this.otpRepository.updateAll({ verified: true }, { otpId: otpId });
            } catch (e: any) {
                Logger.error(requestId, 'OtpService.verify', 'db - updating verified', e);
            }
            Logger.info(requestId, 'OtpService.verify', 'OTP verified');
            return true;
        }

        Logger.info(requestId, 'OtpService.verify',
            SerivceErrorCodes.INVALID_OTP.description);
        throw new ServiceError(SerivceErrorCodes.INVALID_OTP);
    }

    private async canCreateOtp(requestId: string, phoneNumber: string): Promise<boolean> {
        try {
            let otpEntity: OtpEntity[] =
                await this.otpRepository.find({ where: { phoneNumber: phoneNumber, verified: false } });
            if (otpEntity.length > 0) {
                if (otpEntity.length >= Config.Otp.MaxCreateInInterval) {
                    Logger.info(requestId, 'OtpService.canCreateOtp',
                        SerivceErrorCodes.CREATE_OTP_ATTEMPTS_EXCEEDED.description);
                    throw new ServiceError(SerivceErrorCodes.CREATE_OTP_ATTEMPTS_EXCEEDED);
                }
            }
        } catch (e: any) {
            Logger.error(requestId, 'OtpService.canCreateOtp',
                SerivceErrorCodes.INTERNAL_SERVER_ERROR.description, e);
            throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
        }
        return true;
    }
}