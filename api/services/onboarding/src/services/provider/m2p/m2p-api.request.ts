import { HttpRequest, HttpRequestMethod } from "../../core/http";
import { M2PApiDefaults } from "./m2p-api.common";

export abstract class M2PApiRequest extends HttpRequest {

    public readonly entityId: string;

    constructor(id: string, path: string, method: HttpRequestMethod,
        options: any = M2PApiDefaults.RequestOptions, entityId: string) {
        super(id, path, method, options);
        this.entityId = entityId;
    }
}