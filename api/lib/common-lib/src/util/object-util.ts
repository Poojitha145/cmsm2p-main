export class ObjectUtil {

    public static create<T>(type: new (args?: any) => T, args?: any): T {
        return new type(args);
    }

    public static test(type: any): any {
        return ObjectUtil.create(type);
    }

    public static getValue(object: any, key: string, defaultValue?: any): any {
        if (object && typeof object === 'object') {
            return object[key];
        }
        return defaultValue;
    }
}