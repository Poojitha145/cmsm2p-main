import { BindingScope, injectable } from "@loopback/core";
import { DocumentStatus, DocumentType } from "./loan-workflow/loan-workflow.model";
import { repository } from "@loopback/repository";
import { LoanWorkflowRepository } from "../../repositories/loan-workflow.repository";
import { SerivceErrorCodes, ServiceError } from "../common/error/service.error";
import { RandomUtil, DateUtil } from "../core/util";
import { ServiceBindings } from "../core/binding-keys";
import { WorkflowDocumentRepository } from "../../repositories/workflow-document.repository";
import { WorkflowDocumentEntity } from "../../models/entity/workflow-document.entity";
import { Verifier } from "../core/constant/common.constant";
import { FbApiVerifyPanResponse } from "../provider/bank/federal/federal-bank-api.response";

@injectable({ scope: BindingScope.SINGLETON, tags: ServiceBindings.WorkflowDocumentService })
export class WorkflowDocumentService {

    constructor(
        @repository(LoanWorkflowRepository)
        private loanWorkflowRepository: LoanWorkflowRepository,
        @repository(WorkflowDocumentRepository)
        private workflowDocumentRepository: WorkflowDocumentRepository) {

    }

    async getPanDocument(workflowId: string): Promise<FbApiVerifyPanResponse> {
        const workflowDocumentEntity: WorkflowDocumentEntity | null =
            await this.workflowDocumentRepository.getDocument(workflowId, DocumentType.PAN);
        if (workflowDocumentEntity) {
            try {
                return <FbApiVerifyPanResponse>JSON.parse(workflowDocumentEntity.documentJson);
            } catch (e: any) {

            }
        }
        throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
    }

    async saveDocument(localUserId: string, workflowId: string, documentType: DocumentType,
        documentStatus: DocumentStatus, documentVerifier: Verifier,
        data: any, expiredInDays: number = 60): Promise<FbApiVerifyPanResponse> {
        const workflowDocumentEntity: WorkflowDocumentEntity
            = new WorkflowDocumentEntity();
        workflowDocumentEntity.workflowDocumentId = RandomUtil.uuid();
        workflowDocumentEntity.userLocalId = localUserId;
        workflowDocumentEntity.workflowId = workflowId;
        workflowDocumentEntity.documentType = documentType;
        workflowDocumentEntity.documentStatus = documentStatus;
        workflowDocumentEntity.documentDetails = JSON.stringify(data);
        workflowDocumentEntity.documentVerifier = documentVerifier;
        try {
            workflowDocumentEntity.documentJson = data;
            workflowDocumentEntity.expiredAt = DateUtil.add(expiredInDays, 'days').toString();
            await this.workflowDocumentRepository.create(workflowDocumentEntity);
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
        }

        throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
    }
}