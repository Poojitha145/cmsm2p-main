import { WorkflowDocumentEntity } from "../../../../models/entity/workflow-document.entity";
import { FbApiGetEkycDetailsResponse } from "../../../provider/bank/federal/federal-bank-api.response";
import { SerivceErrorCodes, ServiceError } from "../../../common/error/service.error";
import { LoanWorkflowStatus, LoanWorkflowState } from "../../../workflow/loan-workflow-enums";
import { DocumentType } from "../../../workflow/loan-workflow/loan-workflow.model";

export namespace LoanWorkflowUtil {
    export const nextWorkflow = (workflowState: LoanWorkflowState | string,
        documentsObject: any = undefined) => {
        switch (workflowState) {
            case LoanWorkflowState.PRE_APPLICATION:
                return LoanWorkflowState.PHONE_NUMBER;
            case LoanWorkflowState.PHONE_NUMBER:
                return LoanWorkflowState.PAN_NUMBER;
            case LoanWorkflowState.PAN_NUMBER:
                return LoanWorkflowState.PAN_DDUPE;
            case LoanWorkflowState.PAN_DDUPE:
                return LoanWorkflowState.PERSONAL_INFO;
            case LoanWorkflowState.PERSONAL_INFO:
                return LoanWorkflowState.LIMIT_CHECK;
            case LoanWorkflowState.LIMIT_CHECK:
                return LoanWorkflowState.CREDIT_LIMIT;
            case LoanWorkflowState.CREDIT_LIMIT:
                return LoanWorkflowState.EKYC;
            case LoanWorkflowState.EKYC:
                return LoanWorkflowState.AADHAR_DDUPE;
            case LoanWorkflowState.AADHAR_DDUPE:
                return LoanWorkflowState.NAME_DOB_CHECK;
            case LoanWorkflowState.NAME_DOB_CHECK:
                try {
                    let workflowDocumentEntity: WorkflowDocumentEntity = documentsObject[DocumentType.EKYC];
                    <FbApiGetEkycDetailsResponse>workflowDocumentEntity.documentJson;

                } catch (e: any) {
                    throw new ServiceError(SerivceErrorCodes.WORKFLOW_STATE_NOT_FOUND, {});
                }
                return LoanWorkflowState.VKYC;
            case LoanWorkflowState.VKYC:
                return LoanWorkflowState.SELFIE_CHECK;
            case LoanWorkflowState.SELFIE_CHECK:
                return LoanWorkflowState.CIF;
            case LoanWorkflowState.CIF:
                return LoanWorkflowState.CC_INSERT;
            case LoanWorkflowState.CC_INSERT:
                return LoanWorkflowState.M2P_REGISTER;
            case LoanWorkflowState.M2P_REGISTER:
                return LoanWorkflowState.SIM_BIND;
            case LoanWorkflowState.SIM_BIND:
                return LoanWorkflowState.FINISHED;
        }
        throw new ServiceError(SerivceErrorCodes.WORKFLOW_STATE_NOT_FOUND);
    }
}

export interface LoanWorkflowFinder<I> {
    workflowType: LoanWorkflowState;
    find(i: I): LoanWorkflowResult;
}

export interface LoanWorkflowResult {
    workflowStatus: LoanWorkflowStatus;
    nextWorkflowType: LoanWorkflowState;
    reason?: string;
}

