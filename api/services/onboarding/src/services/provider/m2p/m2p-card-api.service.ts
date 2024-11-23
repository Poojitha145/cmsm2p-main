import { BindingScope, injectable } from "@loopback/core";
import { ServiceBindings } from '../../core/binding-keys';
import { M2PApiService } from "./m2p-api.service";
import { M2pCardApiGetListRequest } from "./m2p-card-api.request";

@injectable({ scope: BindingScope.SINGLETON, tags: ServiceBindings.M2PCardApiService })
export class M2PCardApiService extends M2PApiService {

    constructor() {
        super();
    }

    /**
     * Fetch Card List
     */
    async getList(requestId: string, entityId: string): Promise<any> {
        const request: M2pCardApiGetListRequest
            = new M2pCardApiGetListRequest(requestId, entityId);
        const value: any = await this.call(request);
        console.log(value);
        return value
    }
}