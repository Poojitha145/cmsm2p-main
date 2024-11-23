import { HttpRequest, HttpRequestMethod } from "../../../../core/http";
import { M2PApiDefaults } from "../../m2p-api.common";


/**
 * Federal Bank - Limit Check
 */
export interface M2PFederalBankLimitCheckResponseResult {
    approvedAmount: number;
    currency: string;
}