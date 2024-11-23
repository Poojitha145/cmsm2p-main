import { LoanWorkflow } from "../../../services/workflow/loan-workflow/loan-workflow.model";
import { WorkflowResponse } from "./onboarding.response";

/**
 * Verify Phone Number
 */
export interface VerifyPhoneWorkflowResponse extends WorkflowResponse {    
    otpId: string;
}