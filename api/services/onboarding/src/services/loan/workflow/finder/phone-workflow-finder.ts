import { LoanWorkflowModel } from "../../../workflow/loan-workflow/loan-workflow.model";
import { LoanWorkflowStatus, LoanWorkflowState } from "../../../workflow/loan-workflow-enums";
import { LoanWorkflowFinder, LoanWorkflowResult } from "./workflow-finder";

/**
 * Phone number workflow
 */
export interface PhoneNumberWokflowModel extends LoanWorkflowModel {
    phoneNumber: string;
}

export class PhoneNumberWokflowFinder implements LoanWorkflowFinder<PhoneNumberWokflowModel> {
    public readonly workflowType: LoanWorkflowState = LoanWorkflowState.PHONE_NUMBER;

    public find(workflowModel: LoanWorkflowModel): LoanWorkflowResult {
        let workflowStatus: LoanWorkflowStatus = LoanWorkflowStatus.COMPLETED;
        let nextWorkflowType: LoanWorkflowState = LoanWorkflowState.PHONE_NUMBER;
        return {
            workflowStatus: workflowStatus,
            nextWorkflowType: nextWorkflowType
        }
    }
}