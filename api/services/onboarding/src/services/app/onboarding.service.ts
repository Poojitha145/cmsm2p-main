import { LoanWorkflow } from "../workflow/loan-workflow/loan-workflow.model";
import { LoanType, LoanWorkflowState, LoanWorkflowStatus } from "../workflow/loan-workflow-enums";
import { ServiceError, SerivceErrorCodes } from "../common/error/service.error";
import { repository } from "@loopback/repository";
import { UserRepository } from "../../repositories";
import { UserEntity, UserEntityStatus } from "../../models";
import { LoanWorkflowRepository } from "../../repositories/loan-workflow.repository";
import { WorkflowEntity } from "../../models/entity/workflow.entity";
import { RandomUtil } from "../core/util";
import { VerifyPhoneWorkflowRequest } from "../../controllers/onboarding/request/phone-number.request";
import { VerifyPhoneWorkflowResponse } from "../../controllers/onboarding/response/phone-number.response";
import { BindingScope, injectable, service } from "@loopback/core";
import { OtpService } from "../communication/otp.service";
import { ServiceBindings } from "../core/binding-keys";
import { Communication } from "../core/constant/communication.constants";

@injectable({ scope: BindingScope.SINGLETON, tags: ServiceBindings.OnboardingService })
export class OnboardingService {

    constructor(
        @service(OtpService)
        private otpService: OtpService,
        @repository(UserRepository)
        private appUserRepository: UserRepository,
        @repository(LoanWorkflowRepository)
        private loanWorkflowRepository: LoanWorkflowRepository) {

    }

    public async getActiveWorkflowByType(localUserId: string,
        loanType: LoanType): Promise<LoanWorkflow> {
        let workflowEntity: WorkflowEntity | null =
            await this.loanWorkflowRepository.getUserActiveWorkflowByType(localUserId, loanType);
        if (!workflowEntity) {
            throw new ServiceError(SerivceErrorCodes.WORKFLOW_NOT_FOUND);
        }
        return <LoanWorkflow>{
            workflowId: workflowEntity.workflowId,
            workflowState: workflowEntity.workflowState,
            workflowStatus: workflowEntity.workflowStatus
        };
    }

    public async verifyPhoneNumber(request: VerifyPhoneWorkflowRequest):
        Promise<VerifyPhoneWorkflowResponse> {
        let appUserEntity: UserEntity | null;
        let workflow: LoanWorkflow | null;
        try {
            appUserEntity = await this.appUserRepository
                .findOne({ where: { phoneNumber: request.phoneNumber } });

            if (!appUserEntity) {
                // create new user
                appUserEntity = await this.appUserRepository.create({
                    localUserId: RandomUtil.uuid(),
                    phoneNumber: request.phoneNumber,
                    status: UserEntityStatus.PENDING
                });
            }

            workflow = await this.getActiveWorkflowByType(
                appUserEntity.localUserId, LoanType.CC);

            if (!workflow) {
                // create new workflow for user
                workflow = await this.createWorkflow(appUserEntity.localUserId);
            }

            if (workflow.workflowStatus === LoanWorkflowStatus.COMPLETED) {
                const otpId: string = await this.otpService.send(
                    request._id, request.phoneNumber, Communication.ChannelType.Sms);
                return <VerifyPhoneWorkflowResponse>{
                    otpId: otpId,
                    localUserId: appUserEntity.localUserId
                }
            }
            workflow = this.getWorkflowWithStateCheck(appUserEntity.localUserId, LoanWorkflowState.PHONE_NUMBER);
        } catch (e: any) {

        }

        try {

        } catch (e: any) {
            // TODO - ignore            
        }

        try {
            // let user: any = this.getUserByPhoneNumber(request.phoneNumber);
            // if (!user) {
            //     user = this.createUserByPhoneNumber(request.phoneNumber);
            // }
            return <VerifyPhoneWorkflowResponse>{

            }
        } catch (error) {
            throw error;
        }
    }

    public async getAppUserIdByPhoneNumber(
        request: VerifyPhoneWorkflowRequest): Promise<string> {
        let appUserEntity: UserEntity | null;
        try {
            appUserEntity = await this.appUserRepository
                .findOne({ where: { phoneNumber: request.phoneNumber } });
            if (!appUserEntity) {
                appUserEntity = await this.appUserRepository.create({
                    localUserId: RandomUtil.uuid(),
                    phoneNumber: request.phoneNumber,
                });
                return appUserEntity.localUserId;
            }
        } catch (e: any) {

        }
        throw new ServiceError(SerivceErrorCodes.CIF_CREATION_RESPONSE_BUILD_ERROR); //TEMp
    }

    public getWorkflowWithStateCheck(localUserId: string,
        workflowState: LoanWorkflowState): LoanWorkflow {
        let workflow: LoanWorkflow = this.getActiveWorkflow(localUserId);
        if (!workflow) {
            // console.warn(`[RequestId: ${this.requestId}] - Workflow missing for the user, please create a new workflow for the user`);
            throw new ServiceError(SerivceErrorCodes.WORKFLOW_NOT_FOUND);
        }
        if (workflow.workflowState !== workflowState) {
            // console.warn(`[RequestId: ${this.requestId}] - Workflow out of sync for user, {workflow_id: ${workflow.workflowId}, workflowState: ${workflow.workflowState}, input_workflowState: ${workflowState}`);
            throw new ServiceError(SerivceErrorCodes.WORKFLOW_OUT_OF_SYNC);
        }
        return workflow;
    }

    public async getWorkflow(localUserId: string, loanType: LoanType, createOnNotFound: boolean = false): Promise<LoanWorkflow> {
        console.log()
        let appUserEntity: UserEntity = new UserEntity();
        appUserEntity.localUserId = RandomUtil.uuid();
        appUserEntity.phoneNumber = '9704912345';
        appUserEntity.email = 'praju@saven.in';
        appUserEntity.firstName = 'Saven';
        appUserEntity.lastName = 'Tech';
        appUserEntity.status = UserEntityStatus.PENDING;
        appUserEntity.createdAt = '02-02-2004';
        appUserEntity.updatedAt = '02-02-2004';
        // this.appUserInfoRepository.create(appUserInfo);

        let workflow: LoanWorkflow = await this.getActiveWorkflowByType(localUserId, loanType);
        if (!workflow) {
            console.debug(`Creating onboarding workflow for the user: ${localUserId}`);
            try {
                // create and save to db
            } catch (e: any) {
                throw new ServiceError(SerivceErrorCodes.INTERNAL_SERVER_ERROR);
            }
        }
        return workflow;
    }

    public async createWorkflow(localUserId: string): Promise<LoanWorkflow> {
        try {
            const workflowEntity: WorkflowEntity = new WorkflowEntity();
            workflowEntity.userLocalId = localUserId;
            workflowEntity.workflowId = RandomUtil.uuid();
            workflowEntity.workflowState = LoanWorkflowState.PHONE_NUMBER;
            workflowEntity.workflowStatus = LoanWorkflowStatus.IN_PROGRESS;
            workflowEntity.workflowType = LoanType.CC;
            let newEntity: WorkflowEntity =
                await this.loanWorkflowRepository.create(workflowEntity);
            return <LoanWorkflow>{
                workflowId: newEntity.workflowId,
                workflowState: newEntity.workflowState
            }
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.FAILED_WORKFLOW_CREATE, e.message);
        }
    }


    /**
     * 
     * @param localUserId 
     */
    public getActiveWorkflow(localUserId: string): any {
        try {

        } catch (e) {

        }
        throw new ServiceError(SerivceErrorCodes.USER_NOT_REGISTED);
    }

    private compareWorkflow(workflow: LoanWorkflow, workflowState: LoanWorkflowState): boolean {
        return false;
    }

    private createUserByPhoneNumber(phoneNumber: string): any {

    }

    private getUserActiveLoanWorkflow(localUserId: string): void {

    }
}