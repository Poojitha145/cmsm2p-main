import { inject, service } from '@loopback/core';
import { api, post, requestBody } from '@loopback/rest';
import {
    VerifyPhoneWorkflowRequest,
    VerifyPhoneWorkflowRequestBody
} from './request/phone-number.request';
import {
    SetLimitWorkflowRequest,
    SetLimitWorkflowRequestBody
} from './request/credit-limit-workflow.request';
import {
    AddPersonalInfoWorkflowRequest,
    AddPersonalInfoWorkflowRequestBody
} from './request/personal-info-workflow.request';
import {
    VerifyPanWorkflowRequest,
    VerifyPanWorkflowRequestBody
} from './request/pan-number-workflow.request';
import {
    VerifyOtpWorkflowRequest,
    VerifyOtpWorkflowRequestBody
} from '../../models/request/otp.request';
import { FinableWorkflowService } from '../../services/workflow/loan-workflow/finable-workflow.service';
import { VerifyPhoneWorkflowResponse } from './response/phone-number.response';
import {
    CreateUserResponse,
    VerifyUserResponse,
    WorkflowResponse
} from './response/onboarding.response';
import { LoanWorkflow } from '../../services/workflow/loan-workflow/loan-workflow.model';
import { RequestBindings } from '../../services/core/binding-keys';
import { VerifyOtpResponse } from './response/otp.response';
import {
    CreateEkycSessionWorkflowRequest,
    CreateEkycSessionWorkflowRequestBody,
    VerifyEkycSessionWorkflowRequest,
    VerifyEkycSessionWorkflowRequestBody
} from './request/ekyc-workflow.request';
import {
    CreateUserRequest,
    CreateUserRequestBody,
    VerifyUserRequest,
    VerifyUserRequestBody,
    WorkflowRequest,
    WorkflowRequestBody
} from './request/onboarding.request';

@api({
    basePath: '/onboarding'
})
export class OnboardingController {

    constructor(
        @inject(RequestBindings.LocalUserId) private localUserId: string,
        @inject(RequestBindings.DeviceId) private deviceId: string,
        @inject(RequestBindings.RequestId) private requestId: string,
        @service(FinableWorkflowService) private workflowService: FinableWorkflowService
    ) {
    }

    @post('/create/user')
    async createUser(@requestBody(CreateUserRequestBody)
    request: CreateUserRequest): Promise<CreateUserResponse> {
        return await this.workflowService.createUser(request);
    }

    @post('/verify/user')
    async verifyUser(@requestBody(VerifyUserRequestBody)
    request: VerifyUserRequest): Promise<VerifyUserResponse> {
        return await this.workflowService.verifyUser(request);
    }

    /**
     * Getting user's current active workflow
     * @returns WorkflowResponse object
     */
    @post('/get/workflow')
    async getWorkflow(): Promise<WorkflowResponse> {
        const workflow: LoanWorkflow = await this.workflowService
            .getWorkflow(this.requestId, this.localUserId, true);
        return <WorkflowResponse>{
            workflowId: workflow.workflowId,
            workflowState: workflow.workflowState,
            workflowStatus: workflow.workflowStatus
        }
    }

    /**
     * Verify's phone number for a give workflow id
     * @param request 
     * @returns WorkflowResponse object
     */
    @post('/verify/phone')
    async verifyPhone(@requestBody(VerifyPhoneWorkflowRequestBody)
    request: VerifyPhoneWorkflowRequest): Promise<VerifyPhoneWorkflowResponse> {
        return await this.workflowService.verifyPhone(request);
    }

    /**
     * Verify's otp for a give workflow id
     * @param request 
     * @returns WorkflowResponse object
     */
    @post('/verify/otp')
    async verifyOtp(@requestBody(VerifyOtpWorkflowRequestBody) request: VerifyOtpWorkflowRequest):
        Promise<VerifyOtpResponse> {
        return await this.workflowService.verifyOtp(request);
    }

    /**
     * Verify's pan detais with pan number, firstname, lastname and dob for a give workflow id
     * @param request 
     * @returns WorkflowResponse object
     */
    @post('/verify/pan')
    async verifyPan(@requestBody(VerifyPanWorkflowRequestBody)
    request: VerifyPanWorkflowRequest): Promise<WorkflowResponse> {
        let workflow: LoanWorkflow =
            await this.workflowService.verifyPan(request);
        return <WorkflowResponse>{
            localUserId: request.localUserId,
            workflowId: workflow.workflowId,
            workflowState: workflow.workflowState,
            workflowStatus: workflow.workflowStatus
        }
    }

    /**
     * Check's if customer is alerady existing bank customer or not.
     * @param request 
     * @returns WorkflowResponse object
     */
    @post('/verify/pan/ddupe')
    async verifyPanDDupe(@requestBody(WorkflowRequestBody)
    request: WorkflowRequest): Promise<WorkflowResponse> {
        let workflow: LoanWorkflow =
            await this.workflowService.verifyPanDDupe(request);
        return <WorkflowResponse>{
            workflowId: workflow.workflowId,
            workflowState: workflow.workflowState,
            workflowStatus: workflow.workflowStatus
        }
    }

    @post('/add/personal_info')
    async addPersonalInfo(@requestBody(AddPersonalInfoWorkflowRequestBody)
    request: AddPersonalInfoWorkflowRequest): Promise<WorkflowResponse> {
        let workflow: LoanWorkflow =
            await this.workflowService.addPersonalInfo(request);
        return <WorkflowResponse>{
            workflowId: workflow.workflowId,
            workflowState: workflow.workflowState,
            workflowStatus: workflow.workflowStatus
        }
    }

    /**
     * The Bureau of Credit Reference (BRE) performs an eligibility check 
     * on the Customer based on their credit history and financial behavior. 
     * This check helps determine the Customer's creditworthiness.
     * @param request 
     * @returns 
     */
    @post('/limit/check')
    async limitCheck(@requestBody(WorkflowRequestBody)
    request: WorkflowRequest): Promise<WorkflowResponse> {
        let workflow: LoanWorkflow =
            await this.workflowService.limitCheck(request);
        return <WorkflowResponse>{
            workflowId: workflow.workflowId,
            workflowState: workflow.workflowState,
            workflowStatus: workflow.workflowStatus
        }
    }

    @post('/set/limit')
    async setLimit(@requestBody(SetLimitWorkflowRequestBody)
    request: SetLimitWorkflowRequest): Promise<WorkflowResponse> {
        let workflow: LoanWorkflow =
            await this.workflowService.setLimit(request);
        return <WorkflowResponse>{
            workflowId: workflow.workflowId,
            workflowState: workflow.workflowState,
            workflowStatus: workflow.workflowStatus
        }
    }

    @post('/create/ekyc/session')
    async createEkycSession(@requestBody(CreateEkycSessionWorkflowRequestBody)
    request: CreateEkycSessionWorkflowRequest): Promise<any> {
    }

    @post('/verify/ekyc/session')
    async verifyEkycSession(@requestBody(VerifyEkycSessionWorkflowRequestBody)
    request: VerifyEkycSessionWorkflowRequest): Promise<any> {
    }

    @post('/verify/aadhar/ddupe')
    async verifyAadharDDupe(@requestBody(WorkflowRequestBody)
    request: WorkflowRequest): Promise<WorkflowResponse> {
        let workflow: LoanWorkflow =
            await this.workflowService.verifyAadharDDupe(request);
        return <WorkflowResponse>{
            workflowId: workflow.workflowId,
            workflowState: workflow.workflowState,
            workflowStatus: workflow.workflowStatus
        }
    }

    @post('/verify/name/dob')
    async verifyNameDob(@requestBody(WorkflowRequestBody)
    request: WorkflowRequest): Promise<WorkflowResponse> {
        let workflow: LoanWorkflow =
            await this.workflowService.verifyNameDob(request);
        return <WorkflowResponse>{
            workflowId: workflow.workflowId,
            workflowState: workflow.workflowState,
            workflowStatus: workflow.workflowStatus
        }
    }
    
    @post('/cif/creation')
    async cifCreation(@requestBody(WorkflowRequestBody)
    request: WorkflowRequest): Promise<WorkflowResponse>{
        let workflow: LoanWorkflow =
        await this.workflowService.cifCreationInfo(request);
        return <WorkflowResponse>{
            workflowId: workflow.workflowId,
            workflowState: workflow.workflowState,
            workflowStatus: workflow.workflowStatus
        }
    }
}

