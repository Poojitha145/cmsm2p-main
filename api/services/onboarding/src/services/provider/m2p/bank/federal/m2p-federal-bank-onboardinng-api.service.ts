import { BindingScope, injectable } from "@loopback/core";
import { ServiceBindings } from '../../../../core/binding-keys';
import { M2PApiService } from "../../m2p-api.service";
import { M2PFederalBankLimitCheckRequest } from "./m2p-federal-bank-onboarding-api.request";
import { M2PApiResponse } from "../../m2p-api.response";
import { M2PFederalBankLimitCheckResponseResult } from "./m2p-federal-bank-onboarding-api.response";
import { SerivceErrorCodes, ServiceError } from "../../../../common/error/service.error";
import { WorkflowDocumentEntity } from "../../../../../models/entity/workflow-document.entity";
import { DateUtil, RandomUtil } from "../../../../core/util";
import { WorkflowRequest } from "../../../../../controllers/onboarding/request/onboarding.request";
import { DocumentStatus, DocumentType } from "../../../../workflow/loan-workflow/loan-workflow.model";
import { LoanWorkflowRepository } from "../../../../../repositories/loan-workflow.repository";
import { WorkflowDocumentRepository } from "../../../../../repositories/workflow-document.repository";
import { repository } from "@loopback/repository";
import { Verifier } from "../../../../core/constant/common.constant";

@injectable({
    scope: BindingScope.SINGLETON,
    tags: ServiceBindings.M2PFederalBankOnboardingApiService
})
export class M2PFederalBankOnboardingApiService extends M2PApiService {

    constructor(
        @repository(LoanWorkflowRepository)
        private loanWorkflowRepository: LoanWorkflowRepository,
        @repository(WorkflowDocumentRepository)
        private workflowDocumentRepository: WorkflowDocumentRepository) {

        super();
    }

    /**
     * The Bureau of Credit Reference (BRE) performs an eligibility check 
     * on the Customer based on their credit history and financial behavior. 
     * This check helps determine the Customer's creditworthiness.
     */
    async limitCheck(request: WorkflowRequest):
        Promise<M2PApiResponse<M2PFederalBankLimitCheckResponseResult>> {

        const workflowDocumentEntity: WorkflowDocumentEntity
            = new WorkflowDocumentEntity();
        let m2pResponse: M2PApiResponse<M2PFederalBankLimitCheckResponseResult>;
        try {
            const m2pFederalBankLimitCheckRequest: M2PFederalBankLimitCheckRequest
                = new M2PFederalBankLimitCheckRequest(request._id, '');

            m2pResponse = await this.call<M2PApiResponse<M2PFederalBankLimitCheckResponseResult>>
                (m2pFederalBankLimitCheckRequest);

            workflowDocumentEntity.workflowDocumentId = RandomUtil.uuid();
            workflowDocumentEntity.userLocalId = request.localUserId;
            workflowDocumentEntity.workflowId = request.workflowId;
            workflowDocumentEntity.documentType = DocumentType.BRE;
            workflowDocumentEntity.documentStatus = DocumentStatus.VERIFIED;
            workflowDocumentEntity.documentVerifier = Verifier.M2P;

            // if (m2pResponse.result && !m2pResponse.exception &&
            // (typeof m2pResponse.result.approvedAmount === 'number')) {
            // RandomUtil.uuid(), 'FDPAISABAZCR040525'
            workflowDocumentEntity.documentDetails = JSON.stringify(m2pResponse.result);
            workflowDocumentEntity.documentJson = m2pResponse.result;
            workflowDocumentEntity.expiredAt = DateUtil.add(60, 'days').toString();
            await this.workflowDocumentRepository.create(workflowDocumentEntity);
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
        }
        // } else {
        //     throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
        // }
        return m2pResponse;
    }
}

/**
 

 if (m2pResponse.result && !m2pResponse.exception &&
            (typeof m2pResponse.result.approvedAmount === 'number')) {
            const workflowDocumentEntity: WorkflowDocumentEntity
                = new WorkflowDocumentEntity();
            workflowDocumentEntity.documentId = RandomUtil.uuid();
            workflowDocumentEntity.localUserId = request.localUserId;
            workflowDocumentEntity.workflowId = request.workflowId;
            workflowDocumentEntity.documentType = DocumentType.BRE;
            workflowDocumentEntity.documentStatus = DocumentStatus.VERIFIED;
            workflowDocumentEntity.documentVerifier = Verifier.M2P;
            workflowDocumentEntity.documentDetails = JSON.stringify(m2pResponse.result);
            workflowDocumentEntity.documentJson = m2pResponse.result;
            workflowDocumentEntity.expiredAt = moment().days(60).toString();
            try {
                await this.workflowDocumentRepository.create(workflowDocumentEntity);
            } catch (e: any) {
                Logger.critical(request._id, 'WorkflowService.addPersonalInfo',
                    'failed adding workflow personal information', e, workflowDocumentEntity);
                throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
            }
        } else {
            throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
        }

 * 
 */