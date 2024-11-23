import { BindingScope, injectable, service } from "@loopback/core";
import { FederalBankApiService } from "../../provider/bank/federal/federal-bank-api.service";
import { VerifyPanWorkflowRequest } from "../../../controllers/onboarding/request/pan-number-workflow.request";
import {
    FbApiGetEkycDetailsResponse, FbApiVerifyDDupeResponse,
    FbApiVerifyNameDobResponse, FbApiVerifyPanResponse,
    FbApiCifAckResponse,
    FbApiCifCreateResponse
} from "../../provider/bank/federal/federal-bank-api.response";
import { DocumentStatus, DocumentType, LoanWorkflow } from "./loan-workflow.model";
import { UserRepository } from "../../../repositories";
import { OtpService } from "../../communication/otp.service";
import { repository } from "@loopback/repository";
import { LoanType, LoanWorkflowState, LoanWorkflowStatus } from "../loan-workflow-enums";
import { UserEntity, UserEntityStatus } from "../../../models";
import { WorkflowEntity } from "../../../models/entity/workflow.entity";
import { LoanWorkflowRepository } from "../../../repositories/loan-workflow.repository";
import { SerivceErrorCodes, ServiceError } from "../../common/error/service.error";
import { RandomUtil, Normalize, DateUtil } from "../../core/util";
import { Logger } from "../../core/logger";
import { LoanWorkflowUtil } from "../../loan/workflow/finder/workflow-finder";
import { CreateUserRequest, UpdateDeviceInfoRequest, VerifyUserRequest, WorkflowRequest } from "../../../controllers/onboarding/request/onboarding.request";
import { VerifyPhoneWorkflowRequest } from "../../../controllers/onboarding/request/phone-number.request";
import { VerifyPhoneWorkflowResponse } from "../../../controllers/onboarding/response/phone-number.response";
import { VerifyOtpWorkflowRequest } from "../../../models/request/otp.request";
import { CreateUserResponse, UpdateDeviceInfoResponse, VerifyUserResponse, WorkflowResponse } from "../../../controllers/onboarding/response/onboarding.response";
import { ServiceBindings } from "../../core/binding-keys";
import { CreateEkycSessionWorkflowRequest, VerifyEkycSessionWorkflowRequest } from "../../../controllers/onboarding/request/ekyc-workflow.request";
import { PhoneResult } from "phone";
import { DDupeWorkflowRequest } from "../../../controllers/onboarding/request/ddupe-workflow.request";
import { WorkflowDocumentRepository } from "../../../repositories/workflow-document.repository";
import { WorkflowDocumentEntity } from "../../../models/entity/workflow-document.entity";
import { WorkflowDocumentService } from "../workflow-document.service";
import { AddPersonalInfoWorkflowRequest } from "../../../controllers/onboarding/request/personal-info-workflow.request";
import moment from "moment";
import { SetLimitWorkflowRequest } from "../../../controllers/onboarding/request/credit-limit-workflow.request";
import { M2PCardApiService } from "../../provider/m2p/m2p-card-api.service";
import { M2PFederalBankOnboardingApiService } from "../../provider/m2p/bank/federal/m2p-federal-bank-onboardinng-api.service";
import { M2PApiResponse, M2PRegisterUserResult } from "../../provider/m2p/m2p-api.response";
import { M2PFederalBankLimitCheckResponseResult } from "../../provider/m2p/bank/federal/m2p-federal-bank-onboarding-api.response";
import { NameDobWorkflowRequest } from "../../../controllers/onboarding/request/name-dob-workflow.request";
import { Communication } from "../../core/constant/communication.constants";
import { Verifier } from "../../core/constant/common.constant";
import { UserCifInfo } from "../../../models/user-cif-info";
import { LocalCMSApiService } from "../../local-cms-api.service";
import { M2PCardApiPhysicalRequest, M2PCardApiRegisterUserRequest } from "../../provider/m2p/m2p-card-api.request";
import { CardCustomerRepository } from "../../../repositories/card-customer.repository";
import { CardCustomerEntity } from "../../../models/entity/card-customer.entity";
import { CardDetailsEntity } from "../../../models/entity/card-details.entity";
import { CardDetailsRepository } from "../../../repositories/card-details.repository";

@injectable({ scope: BindingScope.SINGLETON, tags: ServiceBindings.FinableWorkflowService })
export class FinableWorkflowService {

    constructor(
        @service(OtpService)
        private otpService: OtpService,
        @service(M2PCardApiService)
        private m2pCardApiService: M2PCardApiService,
        @service(M2PFederalBankOnboardingApiService)
        private m2pFbOnboardingApiService: M2PFederalBankOnboardingApiService,
        @service(FederalBankApiService)
        private federalBankApiService: FederalBankApiService,
        @service(WorkflowDocumentService)
        private workflowDocumentService: WorkflowDocumentService,
        @service(LocalCMSApiService)
        private localCMSApiService: LocalCMSApiService,
        @repository(UserRepository)
        private appUserRepository: UserRepository,
        @repository(LoanWorkflowRepository)
        private loanWorkflowRepository: LoanWorkflowRepository,
        @repository(WorkflowDocumentRepository)
        private workflowDocumentRepository: WorkflowDocumentRepository,
        @repository(CardCustomerRepository)
        private cardCustomerRepository: CardCustomerRepository,
        @repository(CardDetailsRepository)
        private cardDetailsRepository: CardDetailsRepository) {

    }

    public async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
        let appUserEntity: UserEntity | null;
        try {
            appUserEntity = await this.appUserRepository
                .findOne({ where: { phoneNumber: request.phoneNumber } });
            if (appUserEntity) {

            }
        } catch (e: any) {
            Logger.error(request._id, 'WorkflowService.createUser', 'finding user by phone number', e);
            throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
        }

        if (!appUserEntity) {
            Logger.info(request._id, 'WorkflowService.createUser',
                'user not found', { phoneNumber: request.phoneNumber });
            // create new user
            appUserEntity = await this.appUserRepository.create({
                localUserId: RandomUtil.uuid(),
                phoneNumber: request.phoneNumber,
                status: UserEntityStatus.PENDING
            });
            Logger.info(request._id, 'WorkflowService.createUser',
                'user created', { phoneNumber: request.phoneNumber });
        }
        return <CreateUserResponse>{ localUserId: appUserEntity.localUserId }
    }

    public async verifyUser(request: VerifyUserRequest): Promise<VerifyUserResponse> {
        let appUserEntity: UserEntity | null;
        try {
            appUserEntity = await this.appUserRepository
                .findOne({ where: { phoneNumber: request.phoneNumber } });
        } catch (e: any) {
            Logger.error(request._id, 'WorkflowService.verifyUser', 'finding user by phone number', e);
            throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
        }
        if (appUserEntity) {
            return <VerifyUserResponse>{ localUserId: appUserEntity.localUserId }
        }
        throw new ServiceError(SerivceErrorCodes.USER_NOT_REGISTED);
    }

    public async updateDevice(request: UpdateDeviceInfoRequest): Promise<UpdateDeviceInfoResponse> {
        let appUserEntity: UserEntity | null;
        try {
            appUserEntity = await this.appUserRepository
                .findOne({ where: { phoneNumber: request.phoneNumber } });
        } catch (e: any) {
            Logger.error(request._id, 'WorkflowService.verifyUser', 'finding user by phone number', e);
            throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
        }
        if (appUserEntity) {
            return <UpdateDeviceInfoResponse>{ localUserId: appUserEntity.localUserId }
        }
        throw new ServiceError(SerivceErrorCodes.USER_NOT_REGISTED);
    }

    public async getWorkflow(requestId: string, localUserId: string,
        createOnNotFound: boolean = false): Promise<LoanWorkflow> {

        let workflow: LoanWorkflow | null =
            await this.getUserActiveWorkflow(requestId, localUserId);
        if (workflow) {
            return workflow
        }

        if (createOnNotFound) {
            // creating new workflow
            const loanWorkflowEntity: WorkflowEntity = new WorkflowEntity();
            loanWorkflowEntity.workflowId = RandomUtil.uuid();
            loanWorkflowEntity.userLocalId = localUserId;
            loanWorkflowEntity.workflowType = LoanType.CC;
            loanWorkflowEntity.workflowState = LoanWorkflowState.PHONE_NUMBER
            loanWorkflowEntity.workflowStatus = LoanWorkflowStatus.IN_PROGRESS;
            try {
                const newLoanWorkflowEntity: WorkflowEntity =
                    await this.loanWorkflowRepository.create(loanWorkflowEntity);
                Logger.info(requestId, 'Workflow.getWorkflow', 'new workflow is created', {
                    workflowId: newLoanWorkflowEntity.workflowId
                });
                return <LoanWorkflow>{
                    workflowId: newLoanWorkflowEntity.workflowId,
                    workflowState: newLoanWorkflowEntity.workflowState,
                    workflowStatus: newLoanWorkflowEntity.workflowStatus
                }
            } catch (e: any) {
                Logger.error(requestId, 'Workflow.getWorkflow',
                    'creating new workflow', e, loanWorkflowEntity);
                throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
            }
        }
        Logger.error(requestId, 'Workflow.getWorkflow',
            SerivceErrorCodes.WORKFLOW_NOT_FOUND.description, {});
        throw new ServiceError(SerivceErrorCodes.WORKFLOW_NOT_FOUND);
    }

    public async verifyPhone(request: VerifyPhoneWorkflowRequest):
        Promise<VerifyPhoneWorkflowResponse> {
        let appUserEntity: UserEntity | null;

        const phoneResult: PhoneResult = Normalize.phoneNumber(request.phoneNumber);
        if (!phoneResult.isValid || !phoneResult.phoneNumber) {
            Logger.info(request._id, 'WorkflowService.verifyPhoneNumber', 'invalid phone number (India)',
                { phoneNumber: request.phoneNumber });
            throw new ServiceError(SerivceErrorCodes.INVALID_FORMAT_PHONE_NUMBER, request.phoneNumber);
        }
        request.phoneNumber = phoneResult.phoneNumber;

        try {
            appUserEntity = await this.appUserRepository
                .findOne({ where: { phoneNumber: { eq: request.phoneNumber } } });
        } catch (e: any) {
            Logger.error(request._id, 'WorkflowService.verifyPhoneNumber', 'finding user by phone number', e);
            throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
        }

        // TODO - can remove creating user on phone verify
        if (!appUserEntity) {
            Logger.info(request._id, 'WorkflowService.verifyPhoneNumber',
                'user not found', { phoneNumber: request.phoneNumber });
            // create new user
            appUserEntity = await this.appUserRepository.create({
                localUserId: RandomUtil.uuid(),
                phoneNumber: request.phoneNumber,
                status: UserEntityStatus.PENDING
            });
            Logger.info(request._id, 'WorkflowService.verifyPhoneNumber',
                'user created', { phoneNumber: request.phoneNumber });
        }

        const workflow: LoanWorkflow = await this.getWorkflow(request._id,
            appUserEntity.localUserId, true);

        const otpId: string = await this.otpService.send(request._id,
            request.phoneNumber, Communication.ChannelType.Sms, (60 * 60 * 15));

        return <VerifyPhoneWorkflowResponse>{
            otpId: otpId,
            localUserId: appUserEntity.localUserId,
            workflowId: workflow.workflowId,
            workflowState: workflow.workflowState,
            workflowStatus: workflow.workflowStatus
        }
    }

    public async verifyOtp(request: VerifyOtpWorkflowRequest): Promise<WorkflowResponse> {
        request.workflowState = LoanWorkflowState.PHONE_NUMBER;
        const workflowEntity: WorkflowEntity =
            // await this.loanWorkflowRepository.getWorkflowById(request.workflowId);
            await this.verifyWorkflow(request);

        // verifing otp
        const verified: boolean = await this.otpService.verify(
            request._id, request.otpId, request.otp);

        const nextWorkflowState: LoanWorkflowState =
            LoanWorkflowUtil.nextWorkflow(workflowEntity.workflowState);

        try {
            const updatedWorkflow: LoanWorkflow =
                await this.loanWorkflowRepository.updateWorkflow(
                    workflowEntity.workflowId, nextWorkflowState);
            Logger.info(request._id, 'WorkflowService.verifyOtp',
                'updated workflow successfully', updatedWorkflow);
            return <WorkflowResponse>{
                localUserId: workflowEntity.userLocalId,
                workflowId: updatedWorkflow.workflowId,
                workflowState: updatedWorkflow.workflowState,
                workflowStatus: updatedWorkflow.workflowStatus
            };
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.verifyOtp',
                'updating workflow', e);
            throw e;
        }
    }

    public async verifyPan(request: VerifyPanWorkflowRequest):
        Promise<LoanWorkflow> {
        request.workflowState = LoanWorkflowState.PAN_NUMBER;

        const loanWorkflowEntity: WorkflowEntity =
            await this.verifyWorkflow(request);

        const fbApiVerifyPanResponse: FbApiVerifyPanResponse =
            await this.federalBankApiService.verifyPanNumber(request);

        // TODO: verify name and dob with response.   

        const nextWorkflowState: LoanWorkflowState =
            LoanWorkflowUtil.nextWorkflow(loanWorkflowEntity.workflowState);

        try {
            const updatedWorkflow: LoanWorkflow =
                await this.loanWorkflowRepository.updateWorkflow(
                    loanWorkflowEntity.workflowId, nextWorkflowState);

            // ddupe check
            try {
                let ddupeRequest: DDupeWorkflowRequest = <DDupeWorkflowRequest>{
                    _id: request._id,
                    localUserId: request.localUserId,
                    workflowId: updatedWorkflow.workflowId,
                    workflowState: updatedWorkflow.workflowState
                };
                Logger.info(request._id, 'WorkflowService.verifyPanNumber',
                    'forwarding request to ddupe check', ddupeRequest);
                return await this.verifyPanDDupe(ddupeRequest);
            } catch (e: any) {
                // ignore and return 
            }

            return updatedWorkflow;
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.verifyPanNumber',
                'updating workflow', e)
            throw e;
        }
    }

    public async verifyPanDDupe(request: WorkflowRequest):
        Promise<LoanWorkflow> {
        request.workflowState = LoanWorkflowState.PAN_DDUPE;
        const workflowEntity: WorkflowEntity =
            await this.verifyWorkflow(request);

        const ddupeRequest: DDupeWorkflowRequest = <DDupeWorkflowRequest>{
            _id: request._id,
            localUserId: workflowEntity.userLocalId,
            workflowId: workflowEntity.workflowId,
            workflowState: workflowEntity.workflowState
        };
        try {
            const fbApiVerifyPanResponse: FbApiVerifyPanResponse =
                await this.workflowDocumentRepository.getDocumentJson<FbApiVerifyPanResponse>
                    (workflowEntity.workflowId, DocumentType.PAN);
            if (fbApiVerifyPanResponse && fbApiVerifyPanResponse.panNumber) {
                ddupeRequest.panNumber = fbApiVerifyPanResponse.panNumber;
            } else {
                // TODO
            }
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.verifyPanDDupe',
                'failed getting workflow pan document', e,
                { workflowId: workflowEntity.workflowId, type: DocumentType.PAN });
            throw e;
        }

        Logger.info(request._id, 'WorkflowService.verifyPanDDupe',
            'verifing ddupe with pan details', ddupeRequest);
        const fbApiVerifyDDupeResponse: FbApiVerifyDDupeResponse =
            await this.federalBankApiService.ddupeCheck(ddupeRequest);

        const nextWorkflowState: LoanWorkflowState =
            LoanWorkflowUtil.nextWorkflow(workflowEntity.workflowState);

        try {
            return await this.loanWorkflowRepository.updateWorkflow(
                workflowEntity.workflowId, nextWorkflowState);
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.verifyPanDDupe',
                'updating workflow', e);
            throw e;
        }
    }

    public async addPersonalInfo(request: AddPersonalInfoWorkflowRequest):
        Promise<LoanWorkflow> {
        request.workflowState = LoanWorkflowState.PERSONAL_INFO;
        const workflowEntity: WorkflowEntity =
            await this.verifyWorkflow(request);

        // TODO verify input
        const workflowDocumentEntity: WorkflowDocumentEntity
            = new WorkflowDocumentEntity();
        workflowDocumentEntity.workflowDocumentId = RandomUtil.uuid();
        workflowDocumentEntity.userLocalId = request.localUserId;
        workflowDocumentEntity.workflowId = request.workflowId;
        workflowDocumentEntity.documentType = DocumentType.PERSONAL_INFO;
        workflowDocumentEntity.documentStatus = DocumentStatus.VERIFIED;
        workflowDocumentEntity.documentVerifier = Verifier.SELF;
        try {
            workflowDocumentEntity.documentDetails = JSON.stringify(request);
            workflowDocumentEntity.documentJson = request;
            workflowDocumentEntity.expiredAt = DateUtil.add(60, 'days').toString();
            await this.workflowDocumentRepository.create(workflowDocumentEntity);
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.addPersonalInfo',
                'failed adding workflow personal information', e, workflowDocumentEntity);
            throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
        }

        const nextWorkflowState: LoanWorkflowState =
            LoanWorkflowUtil.nextWorkflow(workflowEntity.workflowState);
        try {
            const updateWorkflow: LoanWorkflow = await this.loanWorkflowRepository
                .updateWorkflow(workflowEntity.workflowId, nextWorkflowState);
            Logger.info(request._id, 'WorkflowService.addPersonalInfo',
                'workflow updated', updateWorkflow);

            // forwarding to next workflow
            if (updateWorkflow.workflowState === LoanWorkflowState.LIMIT_CHECK) {
                try {
                    const nextWorkflowRequest: WorkflowRequest = {
                        _id: request._id,
                        workflowId: workflowEntity.workflowId,
                        localUserId: workflowEntity.userLocalId,
                        workflowState: updateWorkflow.workflowState
                    };
                    return await this.limitCheck(nextWorkflowRequest);
                } catch (e: any) {
                    Logger.error(request._id, 'WorkflowService.addPersonalInfo',
                        'getting next workflow response failed', e);
                }
            }
            return updateWorkflow;
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.addPersonalInfo',
                'update workflow state failed', e);
            throw e;
        }
    }

    public async cifCreationInfo(request: WorkflowRequest): Promise<LoanWorkflow> {
        request.workflowState = LoanWorkflowState.CIF;
        const workflowEntity: WorkflowEntity =
            await this.verifyWorkflow(request);

        const fbApiCifAckResponse: FbApiCifAckResponse =
            await this.federalBankApiService.createCif(request);

        const workflowDocumentEntity: WorkflowDocumentEntity
            = new WorkflowDocumentEntity();
        workflowDocumentEntity.workflowDocumentId = fbApiCifAckResponse.requestId;
        workflowDocumentEntity.userLocalId = request.localUserId;
        workflowDocumentEntity.workflowId = request.workflowId;
        workflowDocumentEntity.documentType = DocumentType.CIF_CREATION;
        workflowDocumentEntity.documentStatus = DocumentStatus.VERIFIED;
        workflowDocumentEntity.documentVerifier = 'FEDERAL_BANK';
        try {
            const userCifInfo: UserCifInfo = new UserCifInfo();
            userCifInfo.fbCifAckResponse = fbApiCifAckResponse;
            userCifInfo.requestId = fbApiCifAckResponse.requestId;
            workflowDocumentEntity.documentDetails = JSON.stringify(userCifInfo);
            workflowDocumentEntity.documentJson = userCifInfo;
            workflowDocumentEntity.expiredAt = moment().days(60).toString();
            await this.workflowDocumentRepository.create(workflowDocumentEntity);

        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.cifInfo',
                'failed creating workflow cif creation', e, workflowDocumentEntity);
            throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
        }

        const nextWorkflowState: LoanWorkflowState =
            LoanWorkflowUtil.nextWorkflow(workflowEntity.workflowState);
        try {
            const updateWorkflow: LoanWorkflow = await this.loanWorkflowRepository
                .updateWorkflow(workflowEntity.workflowId, nextWorkflowState);
            Logger.info(request._id, 'WorkflowService.cifInfo',
                'workflow updated', updateWorkflow);
            return updateWorkflow;
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.cifInfo',
                'update workflow state failed', e);
            throw e;
        }
    }

    /**
     * BRE
     * @param request 
     * @returns 
     */
    public async limitCheck(request: WorkflowRequest): Promise<LoanWorkflow> {
        request.workflowState = LoanWorkflowState.LIMIT_CHECK;
        const workflowEntity: WorkflowEntity =
            await this.verifyWorkflow(request);

        // TODO - verify ddupe with pan

        try {
            const documentsObject: any = await this.workflowDocumentRepository
                .getDocumentsObject(workflowEntity.workflowId);

            const fbApiVerifyPanResponse: FbApiVerifyPanResponse =
                documentsObject[DocumentType.PAN];

        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.breCheck',
                'failed getting workflow documents', e);
            throw e;
        }

        const m2pResponse: M2PApiResponse<M2PFederalBankLimitCheckResponseResult> =
            await this.m2pFbOnboardingApiService.limitCheck(request);



        const nextWorkflowState: LoanWorkflowState =
            LoanWorkflowUtil.nextWorkflow(workflowEntity.workflowState);
        // NOTE: - do not update the next workflow state to DB on (BRE) temp state
        return <LoanWorkflow>{
            workflowId: request.workflowId,
            workflowState: nextWorkflowState,
            workflowStatus: LoanWorkflowStatus.IN_PROGRESS
        }
    }

    public async setLimit(request: SetLimitWorkflowRequest):
        Promise<LoanWorkflow> {
        request.workflowState = LoanWorkflowState.LIMIT_CHECK;
        const workflowEntity: WorkflowEntity =
            await this.verifyWorkflow(request);

        // TODO verify input
        const workflowDocumentEntity: WorkflowDocumentEntity
            = new WorkflowDocumentEntity();
        workflowDocumentEntity.workflowDocumentId = RandomUtil.uuid();
        workflowDocumentEntity.userLocalId = request.localUserId;
        workflowDocumentEntity.workflowId = request.workflowId;
        workflowDocumentEntity.documentType = DocumentType.CREDIT_LIMIT;
        workflowDocumentEntity.documentStatus = DocumentStatus.VERIFIED;
        workflowDocumentEntity.documentVerifier = Verifier.APP;
        try {
            workflowDocumentEntity.documentDetails = JSON.stringify(request);
            workflowDocumentEntity.documentJson = request;
            workflowDocumentEntity.expiredAt = moment().days(60).toString();
            await this.workflowDocumentRepository.create(workflowDocumentEntity);
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.setLimit',
                'failed adding workflow personal information', e, workflowDocumentEntity);
            throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
        }

        const nextWorkflowState: LoanWorkflowState =
            LoanWorkflowUtil.nextWorkflow(LoanWorkflowState.CREDIT_LIMIT);
        try {
            const updateWorkflow: LoanWorkflow = await this.loanWorkflowRepository
                .updateWorkflow(workflowEntity.workflowId, nextWorkflowState);
            Logger.info(request._id, 'WorkflowService.setLimit',
                'workflow updated', updateWorkflow);
            return updateWorkflow;
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.setLimit',
                'update workflow state failed', e);
            throw e;
        }
    }

    public async createEkyc(request: CreateEkycSessionWorkflowRequest):
        Promise<string> {
        request.workflowState = LoanWorkflowState.EKYC;
        const workflowEntity: WorkflowEntity =
            await this.verifyWorkflow(request);

        const sessionId: string =
            await this.federalBankApiService.createEkycSessionId(request);

        const data: any = { sessionId: sessionId };
        const workflowDocumentEntity: WorkflowDocumentEntity
            = new WorkflowDocumentEntity();
        workflowDocumentEntity.workflowDocumentId = RandomUtil.uuid();
        workflowDocumentEntity.userLocalId = request.localUserId;
        workflowDocumentEntity.workflowId = request.workflowId;
        workflowDocumentEntity.documentType = DocumentType.EKYC_SESSION_ID;
        workflowDocumentEntity.documentStatus = DocumentStatus.VERIFIED;
        workflowDocumentEntity.documentVerifier = Verifier.FEDERAL_BANK;
        workflowDocumentEntity.documentDetails = JSON.stringify(data);
        workflowDocumentEntity.documentJson = data;
        workflowDocumentEntity.expiredAt = DateUtil.add(60, 'days').toString();
        try {
            await this.workflowDocumentRepository.create(workflowDocumentEntity);
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.createEkycSessionId',
                'failed adding workflow ekyc session id', e, workflowDocumentEntity);
            throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
        }
        return sessionId;

    }

    public async verifyEkyc(request: VerifyEkycSessionWorkflowRequest):
        Promise<LoanWorkflow> {

        request.workflowState = LoanWorkflowState.EKYC;
        const workflowEntity: WorkflowEntity =
            await this.verifyWorkflow(request);

        const fbApiGetEkycDetailsResponse: FbApiGetEkycDetailsResponse =
            await this.federalBankApiService.getEkycDetails(request._id, request.sessionId);
        const verified: boolean = this.isValidKycDetailsResponse(fbApiGetEkycDetailsResponse);
        const workflowDocumentEntity: WorkflowDocumentEntity
            = new WorkflowDocumentEntity();
        workflowDocumentEntity.workflowDocumentId = RandomUtil.uuid();
        workflowDocumentEntity.userLocalId = request.localUserId;
        workflowDocumentEntity.workflowId = request.workflowId;
        workflowDocumentEntity.documentType = DocumentType.EKYC;
        workflowDocumentEntity.documentVerifier = Verifier.FEDERAL_BANK;
        workflowDocumentEntity.expiredAt = moment().days(60).toString();
        workflowDocumentEntity.documentJson = fbApiGetEkycDetailsResponse;
        workflowDocumentEntity.documentStatus = verified ? DocumentStatus.VERIFIED : DocumentStatus.NOT_VERIFIED;
        try {
            workflowDocumentEntity.documentDetails = JSON.stringify(fbApiGetEkycDetailsResponse);
            await this.workflowDocumentRepository.create(workflowDocumentEntity);
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.verifyEkyc',
                'failed adding workflow ekyc', e, workflowDocumentEntity);
            throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
        }

        if (!verified) {
            throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
        }

        const nextWorkflowState: LoanWorkflowState =
            LoanWorkflowUtil.nextWorkflow(workflowEntity.workflowState);

        try {
            const updatedWorkflow: LoanWorkflow =
                await this.loanWorkflowRepository.updateWorkflow(
                    workflowEntity.workflowId, nextWorkflowState);
            return updatedWorkflow;
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.verifyEkyc',
                'updating workflow', e);
            throw e;
        }
    }

    public async verifyAadharDDupe(request: WorkflowRequest):
        Promise<LoanWorkflow> {
        request.workflowState = LoanWorkflowState.AADHAR_DDUPE;
        const workflowEntity: WorkflowEntity =
            await this.verifyWorkflow(request);

        const ddupeRequest: DDupeWorkflowRequest = <DDupeWorkflowRequest>{
            _id: request._id,
            localUserId: workflowEntity.userLocalId,
            workflowId: workflowEntity.workflowId,
            workflowState: workflowEntity.workflowState
        };
        try {
            const documentsObject: any =
                await this.workflowDocumentRepository.getDocumentsObject(workflowEntity.workflowId);

            const ekycSessionIdWorkflowDocumentEntity: WorkflowDocumentEntity =
                documentsObject[DocumentType.EKYC_SESSION_ID];
            const panWorkflowDocumentEntity: WorkflowDocumentEntity =
                documentsObject[DocumentType.PAN];

            if (!ekycSessionIdWorkflowDocumentEntity || !panWorkflowDocumentEntity) {
                throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
            }
            const fbApiVerifyPanResponse: FbApiVerifyPanResponse =
                <FbApiVerifyPanResponse>panWorkflowDocumentEntity.documentJson;

            if (fbApiVerifyPanResponse && fbApiVerifyPanResponse.panNumber) {
                ddupeRequest.panNumber = fbApiVerifyPanResponse.panNumber;
            } else {
                // TODO
            }

            if (ekycSessionIdWorkflowDocumentEntity.documentJson &&
                ekycSessionIdWorkflowDocumentEntity.documentJson.sessionId) {
                ddupeRequest.aadharNumber = ekycSessionIdWorkflowDocumentEntity.documentJson.sessionId;
            } else {
                // TODO
            }
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.verifyAadharDDupe',
                'failed getting workflow pan document', e,
                { workflowId: workflowEntity.workflowId, type: DocumentType.PAN });
            throw e;
        }

        Logger.info(request._id, 'WorkflowService.verifyAadharDDupe',
            'verifing ddupe with pan and aadhar details', ddupeRequest);
        const fbApiVerifyDDupeResponse: FbApiVerifyDDupeResponse =
            await this.federalBankApiService.ddupeCheck(ddupeRequest);

        const nextWorkflowState: LoanWorkflowState =
            LoanWorkflowUtil.nextWorkflow(workflowEntity.workflowState);

        try {
            return await this.loanWorkflowRepository.updateWorkflow(
                workflowEntity.workflowId, nextWorkflowState);
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.verifyAadharDDupe',
                'updating workflow', e);
            throw e;
        }
    }

    public async verifyNameDob(request: WorkflowRequest): Promise<LoanWorkflow> {
        request.workflowState = LoanWorkflowState.NAME_DOB_CHECK;
        const workflowEntity: WorkflowEntity =
            await this.verifyWorkflow(request);

        const nameDobWorkflowRequest: NameDobWorkflowRequest = <NameDobWorkflowRequest>{};

        const fbApiVerifyNameDobResponse: FbApiVerifyNameDobResponse =
            await this.federalBankApiService.verifyNameDob(nameDobWorkflowRequest);

        if (this.isValidNameDobResponse(fbApiVerifyNameDobResponse)) {

        }

        const documentsObject: any = await this.workflowDocumentRepository
            .getDocumentsObject(workflowEntity.workflowId);

        const nextWorkflowState: LoanWorkflowState =
            LoanWorkflowUtil.nextWorkflow(workflowEntity.workflowState, documentsObject);

        try {
            const updatedWorkflow: LoanWorkflow =
                await this.loanWorkflowRepository.updateWorkflow(
                    workflowEntity.workflowId, nextWorkflowState);

            // ddupe check
            try {
                let ddupeRequest: DDupeWorkflowRequest = <DDupeWorkflowRequest>{
                    _id: request._id,
                    localUserId: request.localUserId,
                    workflowId: updatedWorkflow.workflowId,
                    workflowState: updatedWorkflow.workflowState
                };
                Logger.info(request._id, 'WorkflowService.verifyNameDob',
                    'forwarding request to ddupe check', ddupeRequest);
                return await this.verifyPanDDupe(ddupeRequest);
            } catch (e: any) {
                // ignore and return 
            }

            return updatedWorkflow;
        } catch (e: any) {
            Logger.critical(request._id, 'WorkflowService.verifyNameDob',
                'updating workflow', e)
            throw e;
        }
    }

    public async processCifWebhook(event: string): Promise<any> {
        const cifCreateResponse: FbApiCifCreateResponse = this.buildCifCreateResponse(event);
        Logger.info(cifCreateResponse.requestId, 'WorkflowService.processWebhook',
            'Received Cif completion webhook', cifCreateResponse);

        let workflowDocumentEntity: WorkflowDocumentEntity | null;
        let localUserId: string = '';
        let workflowId: string = '';
        try {
            workflowDocumentEntity = await this.workflowDocumentRepository.findOne({ where: { documentId: cifCreateResponse.requestId } });
            const userCifInfo = <UserCifInfo>workflowDocumentEntity?.documentJson;
            userCifInfo.fbCifCompletionResponse = cifCreateResponse;
            if (workflowDocumentEntity) {
                workflowDocumentEntity.documentJson = userCifInfo;
                await this.workflowDocumentRepository.update(workflowDocumentEntity);
            }
            localUserId = workflowDocumentEntity?.userLocalId!;
            workflowId = workflowDocumentEntity?.workflowId!;
        }
        catch (e: any) {
            Logger.error(cifCreateResponse.requestId, 'WorkflowService.processWebhook',
                'Failed to fetch or update workflow document');
        }

        
        const workflow: WorkflowEntity | null = await this.loanWorkflowRepository.findOne({ where: { localUserId: localUserId, workflowId: workflowId } });

        const reqDocumentTypes: DocumentType[] = [DocumentType.PAN, DocumentType.PERSONAL_INFO, DocumentType.KYC];
        const workflowDocumentObject = await this.workflowDocumentRepository.getDocumentsObject(workflowId, reqDocumentTypes);
        const personalInfoDetails: AddPersonalInfoWorkflowRequest
            = <AddPersonalInfoWorkflowRequest>workflowDocumentObject[DocumentType.PERSONAL_INFO].documentJson;
        const panDetails: FbApiVerifyPanResponse = <FbApiVerifyPanResponse>workflowDocumentObject[DocumentType.PAN].documentJson;
        const kycDetails: FbApiGetEkycDetailsResponse = <FbApiGetEkycDetailsResponse>workflowDocumentObject[DocumentType.KYC].documentJson;

        const m2pRegisterUserResponse: M2PApiResponse<M2PRegisterUserResult>
            = await this.localCMSApiService.register(cifCreateResponse.customerId, personalInfoDetails, panDetails, kycDetails);

        const cardCustomerEntity: CardCustomerEntity = new CardCustomerEntity();
        cardCustomerEntity.localUserId = localUserId;
        cardCustomerEntity.kitNo = m2pRegisterUserResponse.result?.kitNo!;
        cardCustomerEntity.customerId = m2pRegisterUserResponse.result?.enityId!;
        // Todo: aliasName to be fetched from cardInfo
        try {
            await this.cardCustomerRepository.create(cardCustomerEntity);
        }
        catch (e: any) {
            Logger.error(cifCreateResponse.requestId, 'WorkflowService.processCifWebhook',
                'Failed to create card customer', e, cardCustomerEntity);
        }
    }

    public buildCifCreateResponse(xml: string): FbApiCifCreateResponse {
        try {
            const dom: Document = new DOMParser().parseFromString(xml, 'text/xml');
            const cifEnqRespCollection: HTMLCollectionOf<Element> =
                dom.getElementsByTagName('CifEnqResp');
            const cifEnqRespChildren: HTMLCollectionOf<Element> =
                cifEnqRespCollection[0].children;
            const response: any = {};
            for (let i = 0; i < cifEnqRespChildren.length; i++) {
                switch (cifEnqRespChildren[i].nodeName) {
                    case 'RequestId':
                        response.requestId = cifEnqRespChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'CustomerId':
                        response.customerId = cifEnqRespChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'CustomerName':
                        response.customerName = cifEnqRespChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'CifResponseCode':
                        response.cifResponseCode = cifEnqRespChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'CifResponseReason':
                        response.cifResponseReason = cifEnqRespChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'ResponseCode':
                        response.responseCode = cifEnqRespChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'ResponseReason':
                        response.responseReason = cifEnqRespChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'CifCreatedTime':
                        response.cifCreatedTime = cifEnqRespChildren[i].childNodes[0].nodeValue;
                        break;
                }
            }
            return <FbApiCifCreateResponse>response;
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.CIF_CREATION_RESPONSE_BUILD_ERROR, e.message);
        }
    }

    /**
     * 
     */
    private async getWorkflowDocuments(workflowId: string): Promise<any> {
        const documentsObject: any =
            await this.workflowDocumentRepository.getDocumentsObject(workflowId);

        const userInfoWorkflowDocumentEntity: WorkflowDocumentEntity =
            documentsObject[DocumentType.USER_INFO];
        const panWorkflowDocumentEntity: WorkflowDocumentEntity =
            documentsObject[DocumentType.PAN];

        if (!userInfoWorkflowDocumentEntity || !panWorkflowDocumentEntity) {
            throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
        }

        const userInfoDocument: any = userInfoWorkflowDocumentEntity.documentJson;
        const fbApiVerifyPanResponse: FbApiVerifyPanResponse =
            <FbApiVerifyPanResponse>panWorkflowDocumentEntity.documentJson;

        //     UserInfo userInfo = (UserInfo) gson.fromJson(userInfoDoc.getDocumentDetails(),
        //     WorkflowDocumentMapper.DOCUMENT_TYPE_CLASS_MAP.get(DocumentType.USER_INFORMATION));

        //     UserPANInfo userPANInfo = (UserPANInfo) gson.fromJson(userPanInfoDoc.getDocumentDetails(),
        //         WorkflowDocumentMapper.DOCUMENT_TYPE_CLASS_MAP.get(DocumentType.PAN));

        // if (StringUtils.isEmpty(userInfo.getUserPersonalInfo().getCustomerDob())
        //     || StringUtils.isEmpty(userPANInfo.getPanNumber())) {
        //     throw new IllegalArgumentException("Missing fields to build request");
        // }
    }

    private async verifyWorkflow(workflowRequest: WorkflowRequest): Promise<WorkflowEntity> {
        let loanWorkflowEntity: WorkflowEntity | null;
        try {
            loanWorkflowEntity = await this.loanWorkflowRepository.findOne({
                where: {
                    localUserId: workflowRequest.localUserId,
                    workflowId: workflowRequest.workflowId
                }
            });
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.DB_ERROR);
        }

        if (!loanWorkflowEntity) {
            throw new ServiceError(SerivceErrorCodes.WORKFLOW_NOT_FOUND);
        }

        if (loanWorkflowEntity.workflowState !== workflowRequest.workflowState) {
            throw new ServiceError(SerivceErrorCodes.WORKFLOW_OUT_OF_SYNC);
        }

        switch (loanWorkflowEntity.workflowStatus) {
            case LoanWorkflowStatus.COMPLETED:
                throw new ServiceError(SerivceErrorCodes.WORKFLOW_OUT_OF_SYNC);
            case LoanWorkflowStatus.REJECTED:
                throw new ServiceError(SerivceErrorCodes.WORKFLOW_OUT_OF_SYNC);
            case LoanWorkflowStatus.DISCARDED:
                throw new ServiceError(SerivceErrorCodes.WORKFLOW_OUT_OF_SYNC);
        }
        return loanWorkflowEntity;
    }

    private async checkWorkflowState(requestId: string, localUserId: string,
        workflowState: LoanWorkflowState): Promise<LoanWorkflow> {
        let loanWorkflow: LoanWorkflow =
            await this.getWorkflow(requestId, localUserId);
        if (loanWorkflow && loanWorkflow.workflowState !== workflowState) {
            throw new ServiceError(SerivceErrorCodes.WORKFLOW_OUT_OF_SYNC);
        }
        return loanWorkflow;
    }

    private async getUserActiveWorkflow(requestId: string, localUserId: string):
        Promise<LoanWorkflow | null> {
        let workflowEntity: WorkflowEntity | null =
            await this.loanWorkflowRepository.getUserActiveWorkflowByType(localUserId, LoanType.CC);
        if (!workflowEntity) {
            Logger.debug(requestId, 'WorkflowService.getUserActiveWorkflow', 'workflow not found', { localUserId });
            try {
                const appUserEntity: UserEntity | null =
                    await this.appUserRepository.findOne({ where: { localUserId: localUserId } });
                if (!appUserEntity) {
                    Logger.warn(requestId, 'WorkflowService.getUserActiveWorkflow', 'user not found', { localUserId });
                    throw new ServiceError(SerivceErrorCodes.USER_NOT_REGISTED);
                }
            } catch (e: any) {
                Logger.critical(requestId, 'WorkflowService.getUserActiveWorkflow', 'find user entity', { localUserId });
            }
            return null;
        }
        Logger.debug(requestId, 'WorkflowService.getUserActiveWorkflow', 'workflow found', {
            localUserId: localUserId,
            workflowId: workflowEntity.workflowId,
        })
        return <LoanWorkflow>{
            workflowId: workflowEntity.workflowId,
            workflowState: workflowEntity.workflowState,
            workflowStatus: workflowEntity.workflowStatus
        };
    }

    private isValidNameDobResponse(response: FbApiVerifyNameDobResponse): boolean {
        return (response && response.status === 'Y');
    }

    private isValidKycDetailsResponse(response: FbApiGetEkycDetailsResponse): boolean {
        return (response && response.Status === 'Y');
    }
}