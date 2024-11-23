export class ConfigHelper {
    public static getProcessEnv(key: string): any {
        const value = process.env[key];
        if (value === undefined) {
            throw new Error(`env variable '${key}' not found`);
        }
        return value;
    }

    public static getDefaultProcessEnv(key: string, defaultValue: any): any {
        return process.env[key] || defaultValue;
    }
}

export class DirectoryHelper {

}