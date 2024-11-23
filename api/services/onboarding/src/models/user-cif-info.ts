import { FbApiCifAckResponse, FbApiCifCreateResponse } from "../services/provider/bank/federal/federal-bank-api.response";

export class UserCifInfo {
    requestId: string;
    fbCifCompletionResponse: FbApiCifCreateResponse;
    fbCifAckResponse: FbApiCifAckResponse;
}