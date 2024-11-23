import { HttpRequest, HttpRequestMethod } from "../../core/http";
import { KarzaApiDefaults } from "./karza-api.common";

export abstract class KarzaApiRequest extends HttpRequest {

    constructor(id: string, path: string, method: HttpRequestMethod,
        options: any = KarzaApiDefaults.RequestOptions) {
        super(id, path, method, options);
    }
}