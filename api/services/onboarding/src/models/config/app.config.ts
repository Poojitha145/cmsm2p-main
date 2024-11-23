import { FederalBankApiConfig } from "../../services/provider/bank/federal/federal-bank-api.config";
import { DataSourceConfig } from "./db.config";

export class AppConfig {

    public readonly cmsDataSourceConfig: DataSourceConfig;

    public readonly fBConfig: FederalBankApiConfig;

    constructor(object: any) {
        this.cmsDataSourceConfig = new DataSourceConfig(object.cmsDataSourceConfig);
        this.fBConfig = new FederalBankApiConfig(object.fbConfig);
    }
}