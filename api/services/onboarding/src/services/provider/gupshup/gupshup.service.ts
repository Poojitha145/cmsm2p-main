import { BindingScope, inject, injectable } from "@loopback/core";
import { HttpService } from "../../core/http";
import { ConfigBindings, ServiceBindings } from "../../core/binding-keys";
import { FederalBankApiConfig } from "../bank/federal/federal-bank-api.config";
import { GupshupSmsApiRequest } from "./gupshup.models";

@injectable({ scope: BindingScope.SINGLETON, tags: ServiceBindings.GupshupSmsService })
export class GupshupSmsService extends HttpService {

    constructor(
        @inject(ConfigBindings.FederalBankConfig)
        private federalBankConfig: FederalBankApiConfig) {

        super({
            useEncryption: false,
            defaults: {
                baseURL: federalBankConfig.apiUrlConfig.baseUrl,
                headers: {
                    'apikey': '',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },
            encryptOptions: {
                secretKey: ''
            }
        });
    }

    public async send(source: string, destination: string,
        message: string): Promise<boolean> {

        const request: GupshupSmsApiRequest =
            new GupshupSmsApiRequest('', source, destination, message);
        await this.call(request, {});

        return false;
    }
}