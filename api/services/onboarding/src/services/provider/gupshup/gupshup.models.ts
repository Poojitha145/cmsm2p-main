import { HttpRequest, HttpRequestMethod } from "../../core/http";
import { RandomUtil } from "../../core/util";


export class GupshupSmsApiRequest extends HttpRequest {

    public readonly appId: string;
    public readonly source: string;
    public readonly destination: string;
    public readonly message: string;

    constructor(appId: string, source: string, destination: string, message: string) {
        super(RandomUtil.uuid(), '/sms/v1/message/:' + appId, HttpRequestMethod.Post);
        this.source = source;
        this.destination = destination;
        this.message = message;
    }

    getBody() {
        return {

        }
    }
}