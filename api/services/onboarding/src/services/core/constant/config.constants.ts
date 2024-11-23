import path from "path";

export namespace Config {

    export const AppEnv: string = process.env.environment ? process.env.environment : 'dev';

    export const Path = {
        Resources: path.join(__dirname, '..', '..', 'resources', AppEnv)
    }



    export const SecretManager = {
        Region: 'us-east-2'
    }

    export const SecretKey = {
        CMS_DATASOURCE_PASSWORD: 'CMS_DATASOURCE_PASSWORD',
        FB_CLIENT_ID: 'FB_CLIENT_ID',
        FB_CLIENT_SECRET: 'FB_CLIENT_SECRET'
    }

    export const Logger = {
        Level: 'debug',
        Label: 'CMS'
    }

    export const Otp = {
        CreateIntervalInMinute: 1,
        ExpireInMinute: 1,
        MaxAttempts: 3,
        MaxCreateInInterval: 4,
    }
}