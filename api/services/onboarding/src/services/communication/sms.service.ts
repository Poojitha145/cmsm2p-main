import { BindingScope, injectable, service } from "@loopback/core";
import { SerivceErrorCodes, ServiceError } from "../common/error/service.error";
import { ServiceBindings } from "../core/binding-keys";
import { GupshupSmsService } from "../provider/gupshup/gupshup.service";
import { Communication } from "../core/constant/communication.constants";

@injectable({ scope: BindingScope.SINGLETON, tags: ServiceBindings.SmsService })
export class SmsService {

    constructor(
        @service(GupshupSmsService)
        private gupshupSmsService: GupshupSmsService) {
    }

    public async send(source: string, destination: string,
        message: string, vendor: Communication.Vendor): Promise<boolean> {
        switch (vendor) {
            case Communication.Vendor.Gupshup:
                await this.gupshupSmsService.send(source, destination, message);
                return true;
            default:
                throw new ServiceError(SerivceErrorCodes.UNKNOWN_VENDOR_ERROR);
        }
    }
}