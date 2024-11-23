import { BindingScope, inject, injectable } from "@loopback/core";
import { ConfigBindings } from '../../../core/binding-keys';
import { HttpResponse, HttpService } from '../../../core/http';
import { FederalBankApiConfig } from './federal-bank-api.config';
import {
    FbApiCifCreateRequest,
    FbApiCifEnquiryRequest,
    FbApiGenerateEkycSessionRequest,
    FbApiGetEkycDetailsRequest,
    FbApiVerifyDDupeRequest,
    FbApiVerifyNameDobRequest,
    FbApiVerifyPanRequest
} from './federal-bank-api.request';
import {
    VerifyPanWorkflowRequest
} from '../../../../controllers/onboarding/request/pan-number-workflow.request';
import {
    FbApiCifAckResponse,
    FbApiCifCreateResponse,
    FbApiCifEnquiryResponse,
    FbApiGetEkycDetailsResponse,
    FbApiVerifyDDupeResponse,
    FbApiVerifyNameDobResponse, FbApiVerifyPanResponse
} from './federal-bank-api.response';
import { DOMParser } from 'xmldom';
import { SerivceErrorCodes, ServiceError } from '../../../common/error/service.error';
import { WorkflowDocumentEntity } from "../../../../models/entity/workflow-document.entity";
import { RandomUtil } from "../../../core/util";
import { DocumentStatus, DocumentType } from "../../../workflow/loan-workflow/loan-workflow.model";
import moment from "moment";
import { WorkflowDocumentRepository } from "../../../../repositories/workflow-document.repository";
import { repository } from "@loopback/repository";
import { CreateEkycSessionWorkflowRequest } from "../../../../controllers/onboarding/request/ekyc-workflow.request";
import { DDupeWorkflowRequest } from "../../../../controllers/onboarding/request/ddupe-workflow.request";
import { NameDobWorkflowRequest } from "../../../../controllers/onboarding/request/name-dob-workflow.request";
import { Verifier } from "../../../core/constant/common.constant";
import { WorkflowRequest } from "../../../../controllers/onboarding/request/onboarding.request";
import { AddPersonalInfoWorkflowRequest } from "../../../../controllers/onboarding/request/personal-info-workflow.request";
import { Logger } from "../../../core/logger";

@injectable({ scope: BindingScope.SINGLETON })
export class FederalBankApiService extends HttpService {

    private readonly DOC_EXPIRE_IN_DAYS: number = 60;

    constructor(
        @inject(ConfigBindings.FederalBankConfig)
        private federalBankApiConfig: FederalBankApiConfig,
        @repository(WorkflowDocumentRepository)
        private workflowDocumentRepository: WorkflowDocumentRepository) {
        super({
            useEncryption: false,
            defaults: {
                baseURL: federalBankApiConfig.apiUrlConfig.baseUrl,
                headers: {
                    common: {
                        'x-ibm-client-secret': federalBankApiConfig.clientSecret,
                        'x-ibm-client-id': federalBankApiConfig.clientId
                    },
                    post: {
                        'Content-Type': 'application/xml',
                        'Accept': 'text/plain, application/xml, application/json'
                    }
                }
            },
            encryptOptions: {
                secretKey: ''
            }
        });
    }

    public async verifyPanNumber(request: VerifyPanWorkflowRequest):
        Promise<FbApiVerifyPanResponse> {
        const fbApiRequest: FbApiVerifyPanRequest = new FbApiVerifyPanRequest(request._id);
        fbApiRequest.channelId = this.federalBankApiConfig.panValidationConfig.channelId;
        fbApiRequest.accessId = this.federalBankApiConfig.panValidationConfig.accessId;
        fbApiRequest.accessCode = this.federalBankApiConfig.panValidationConfig.accessCode;
        fbApiRequest.panNumber = request.panNumber;
        const response: HttpResponse<any> = await this.call(fbApiRequest);

        const fbApiVerifyPanResponse: FbApiVerifyPanResponse
            = this.buildVerifyPanResponse(response.data);
        const workflowDocumentEntity: WorkflowDocumentEntity
            = new WorkflowDocumentEntity();
        workflowDocumentEntity.workflowDocumentId = RandomUtil.uuid();
        workflowDocumentEntity.userLocalId = request.localUserId;
        workflowDocumentEntity.workflowId = request.workflowId;
        workflowDocumentEntity.documentType = DocumentType.PAN;
        workflowDocumentEntity.documentStatus = DocumentStatus.VERIFIED;
        workflowDocumentEntity.documentDetails = response.data;
        workflowDocumentEntity.documentVerifier = Verifier.FEDERAL_BANK;
        try {
            workflowDocumentEntity.documentJson = fbApiVerifyPanResponse;
            workflowDocumentEntity.expiredAt = moment().days(this.DOC_EXPIRE_IN_DAYS).toString();
            await this.workflowDocumentRepository.create(workflowDocumentEntity);
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
        }
        return fbApiVerifyPanResponse;
    }

    public async verifyNameDob(request: NameDobWorkflowRequest):
        Promise<FbApiVerifyNameDobResponse> {
        const fbApiRequest: FbApiVerifyNameDobRequest =
            new FbApiVerifyNameDobRequest(request._id);
        try {
            fbApiRequest.ekycTransactionId = '';
            fbApiRequest.dob = request.dob;
            fbApiRequest.name = request.name;
            const response: HttpResponse<any> = await this.call(fbApiRequest);
            return this.buildVerifyNameDobResponse(response.data);
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.VERIFY_NAME_DOB_RESPONSE_BUILD_ERROR);
        }
    }

    public async createEkycSessionId(request: CreateEkycSessionWorkflowRequest):
        Promise<string> {
        const fbApiRequest: FbApiGenerateEkycSessionRequest =
            new FbApiGenerateEkycSessionRequest(request._id);
        try {
            // TOOD: read tokens from config
            /**
             * TODO: need to check with fb
             * 1. validation is required ?
             * 2. limit ?            */

            fbApiRequest.securityToken = this.federalBankApiConfig.ekycSecurityToken;
            fbApiRequest.action = this.federalBankApiConfig.ekycAction;

            const httpResponse: HttpResponse<any> = await this.call(fbApiRequest);
            if (httpResponse.data && httpResponse.data.status === 'success') {
                return httpResponse.data.SessionId;
            }
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.FAILED_CREATING_EKYC_SESSION_ERROR, e);
        }
        throw new ServiceError(SerivceErrorCodes.FAILED_CREATING_EKYC_SESSION_ERROR);
    }

    public async getEkycDetails(requestId: string, transactionId: string):
        Promise<FbApiGetEkycDetailsResponse> {
        const fbApiRequest: FbApiGetEkycDetailsRequest =
            new FbApiGetEkycDetailsRequest(requestId);
        fbApiRequest.transactionId = transactionId;
        fbApiRequest.securityToken = '9fb90aa2fcd562b6937f3341e7f34984adbc108941034e3410e004a682fabf0d';
        fbApiRequest.action = 'vihofatu';

        const httpResponse: HttpResponse<any> = await this.call(fbApiRequest);

        return this.buildGetEkycDetailsResponse(httpResponse.data);
    }

    public async createCif(request: WorkflowRequest): Promise<FbApiCifAckResponse> {
        let personalDetails: AddPersonalInfoWorkflowRequest;
        let panDetails: FbApiVerifyPanResponse;
        let ekycDetails: FbApiGetEkycDetailsResponse;

        try {
            const documentsObject = await this.workflowDocumentRepository
                .getDocumentsObject(request.workflowId);
            const personalInfoWorkflowDocumentEntity: WorkflowDocumentEntity
                = documentsObject[DocumentType.PERSONAL_INFO];
            const panWorkflowDocumentEntity: WorkflowDocumentEntity
                = documentsObject[DocumentType.PAN];
            const ekycWorkflowDocumentEntity: WorkflowDocumentEntity = documentsObject[DocumentType.KYC];
            if (!personalInfoWorkflowDocumentEntity || !panWorkflowDocumentEntity || !ekycWorkflowDocumentEntity) {
                throw new ServiceError(SerivceErrorCodes.WORKFLOW_DOCUMENT_NOT_FOUND);
            }
            personalDetails = <AddPersonalInfoWorkflowRequest>personalInfoWorkflowDocumentEntity.documentJson;
            panDetails = <FbApiVerifyPanResponse>panWorkflowDocumentEntity.documentJson;
            ekycDetails = <FbApiGetEkycDetailsResponse>ekycWorkflowDocumentEntity.documentJson;
        } catch (e: any) {
            Logger.critical(request._id, 'FederalBankApiService.createCif',
                'Failed getting documents', e);
            throw e;
        }

        let fbApiCifRequest: FbApiCifCreateRequest =
            new FbApiCifCreateRequest(request._id);
        fbApiCifRequest.userAccessId = this.federalBankApiConfig.cifCreationConfig.userAccessId;
        fbApiCifRequest.userAccessCode = this.federalBankApiConfig.cifCreationConfig.userAccessCode;
        fbApiCifRequest.senderCode = this.federalBankApiConfig.cifCreationConfig.senderCode;
        fbApiCifRequest.requestId = this.generateCreateCifRequestId();
        fbApiCifRequest.solId = this.federalBankApiConfig.cifCreationConfig.solId;
        fbApiCifRequest.title = panDetails.title;
        fbApiCifRequest.firstName = panDetails.firstName;
        fbApiCifRequest.middleName = personalDetails.middleName;
        fbApiCifRequest.lastName = panDetails.lastName;
        fbApiCifRequest.fatherName = personalDetails.fatherName;
        fbApiCifRequest.motherName = personalDetails.motherName;
        const dob: string = ekycDetails.KycDetails.dob
        fbApiCifRequest.dob = dob;
        fbApiCifRequest.gender = ekycDetails.KycDetails.gender;
        fbApiCifRequest.maritalStatus = personalDetails.maritalStatus;
        fbApiCifRequest.panNo = panDetails.panNumber;
        fbApiCifRequest.mobile = ekycDetails.KycDetails.phone;
        fbApiCifRequest.email = personalDetails.email;
        fbApiCifRequest.minor = personalDetails.minor;
        fbApiCifRequest.houseNmePr = personalDetails.communicationAddr.houseNo;
        fbApiCifRequest.PlacePr = personalDetails.communicationAddr.place;
        fbApiCifRequest.cityPr = personalDetails.communicationAddr.city;
        fbApiCifRequest.statePr = personalDetails.communicationAddr.state;
        fbApiCifRequest.ctryPr = personalDetails.communicationAddr.ctry;
        fbApiCifRequest.pinPr = personalDetails.communicationAddr.pincode;
        fbApiCifRequest.houseNmePm = ekycDetails.KycDetails.houseno;
        fbApiCifRequest.placePm = personalDetails.permanentAddr.place;
        fbApiCifRequest.cityPm = personalDetails.permanentAddr.city;
        fbApiCifRequest.statePm = personalDetails.permanentAddr.state;
        fbApiCifRequest.ctryPm = personalDetails.permanentAddr.ctry;
        fbApiCifRequest.PinPm = personalDetails.permanentAddr.pincode;
        fbApiCifRequest.caSamePa = personalDetails.caSamePa ? 'Y' : 'N';
        fbApiCifRequest.qualification = personalDetails.qualification;
        fbApiCifRequest.annualIncome = personalDetails.annualIncome;
        fbApiCifRequest.occupation = personalDetails.occupation;
        fbApiCifRequest.taxSlab = this.calculateTaxSlab(dob);
        fbApiCifRequest.employment = personalDetails.employment;
        fbApiCifRequest.employerName = personalDetails.employerName;
        fbApiCifRequest.designation = personalDetails.designation;
        fbApiCifRequest.poiIdType = personalDetails.POI.poIdType;
        fbApiCifRequest.poiIdNum = personalDetails.POI.poIdNum;
        fbApiCifRequest.poaType = personalDetails.POA.poaType;
        fbApiCifRequest.poaIdNum = personalDetails.POA.poaIdNum;
        fbApiCifRequest.religion = personalDetails.religion;
        fbApiCifRequest.community = personalDetails.community;

        let httpResponse: HttpResponse<any> = await this.call(fbApiCifRequest);
        return this.buildCifAckResponse(httpResponse.data);
    }

    public async enquireCif(requestId: string): Promise<FbApiCifEnquiryResponse> {
        try {
            const fbApiRequest: FbApiCifEnquiryRequest =
                new FbApiCifEnquiryRequest(requestId);
            const httpResponse: HttpResponse<any> = await this.call(fbApiRequest);
            return this.buildCifEnquiryResponse(httpResponse.data);
        } catch (e: any) { }
        throw new ServiceError(SerivceErrorCodes.GET_EKYC_DETAILS_RESPONSE_BUILD_ERROR);
    }

    public async existingCustomerCheck(request: DDupeWorkflowRequest): Promise<FbApiVerifyDDupeResponse> {
        const fbApiRequest: FbApiVerifyDDupeRequest =
            new FbApiVerifyDDupeRequest(request._id);
        const httpResponse: HttpResponse<any> = await this.call(fbApiRequest);

        const fbApiVerifyDDupeResponse: FbApiVerifyDDupeResponse =
            <FbApiVerifyDDupeResponse>httpResponse.data;
        if (fbApiVerifyDDupeResponse.errorResponse) {
            throw new ServiceError(SerivceErrorCodes.DDUPE_RESPONSE_BUILD_ERROR);
        }

        const workflowDocumentEntity: WorkflowDocumentEntity
            = new WorkflowDocumentEntity();
        workflowDocumentEntity.workflowDocumentId = RandomUtil.uuid();
        workflowDocumentEntity.userLocalId = request.localUserId;
        workflowDocumentEntity.workflowId = request.workflowId;
        workflowDocumentEntity.documentType = DocumentType.DDUPE;
        workflowDocumentEntity.documentStatus = DocumentStatus.VERIFIED;
        workflowDocumentEntity.documentVerifier = Verifier.FEDERAL_BANK;
        try {
            workflowDocumentEntity.documentDetails = JSON.stringify(fbApiVerifyDDupeResponse);
            workflowDocumentEntity.documentJson = fbApiVerifyDDupeResponse;
            workflowDocumentEntity.expiredAt = moment().days(this.DOC_EXPIRE_IN_DAYS).toString();
            await this.workflowDocumentRepository.create(workflowDocumentEntity);
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
        }
        return fbApiVerifyDDupeResponse;;
    }

    public async ddupeCheck(request: DDupeWorkflowRequest): Promise<FbApiVerifyDDupeResponse> {
        const fbApiRequest: FbApiVerifyDDupeRequest =
            new FbApiVerifyDDupeRequest(request._id);

            fbApiRequest.panNumber = request.panNumber ? request.panNumber : '';

        if (request.panNumber) {
            fbApiRequest.panNumber = request.panNumber;
        }
        if (request.dob) {
            fbApiRequest.dob = request.dob;
        }
        if (request.phoneNumber) {
            fbApiRequest.mobileNumber = request.phoneNumber;
        }
        if (request.aadharNumber) {
            fbApiRequest.aadhaarNumber = request.aadharNumber;
        }

        const httpResponse: HttpResponse<any> = await this.call(fbApiRequest);

        const fbApiVerifyDDupeResponse: FbApiVerifyDDupeResponse =
            <FbApiVerifyDDupeResponse>httpResponse.data;
        if (fbApiVerifyDDupeResponse.errorResponse) {
            throw new ServiceError(SerivceErrorCodes.DDUPE_RESPONSE_BUILD_ERROR);
        }

        const workflowDocumentEntity: WorkflowDocumentEntity
            = new WorkflowDocumentEntity();
        workflowDocumentEntity.workflowDocumentId = RandomUtil.uuid();
        workflowDocumentEntity.userLocalId = request.localUserId;
        workflowDocumentEntity.workflowId = request.workflowId;
        workflowDocumentEntity.documentType = DocumentType.DDUPE;
        workflowDocumentEntity.documentStatus = DocumentStatus.VERIFIED;
        workflowDocumentEntity.documentVerifier = Verifier.FEDERAL_BANK;
        try {
            workflowDocumentEntity.documentDetails = JSON.stringify(httpResponse.data);
            workflowDocumentEntity.documentJson = fbApiVerifyDDupeResponse;
            workflowDocumentEntity.expiredAt = moment().days(this.DOC_EXPIRE_IN_DAYS).toString();
            await this.workflowDocumentRepository.create(workflowDocumentEntity);
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.DB_ERROR, e);
        }
        return fbApiVerifyDDupeResponse;;
    }

    /**
     * 
     */
    private buildVerifyPanResponse(xml: string): FbApiVerifyPanResponse {
        try {
            const dom: Document = new DOMParser().parseFromString(xml, 'text/xml');
            const panResponseCollection: HTMLCollectionOf<Element> =
                dom.getElementsByTagName('NS1:PANResponse');
            const responseCodeCollection: HTMLCollectionOf<Element> =
                panResponseCollection[0].getElementsByTagName('ResponseCode');
            const responseDescCollection: HTMLCollectionOf<Element> =
                panResponseCollection[0].getElementsByTagName('ResponseDesc');
            const responseCode: string | null = responseCodeCollection[0].childNodes[0].nodeValue;
            const responseDesc: string | null = responseDescCollection[0].childNodes[0].nodeValue;

            if (responseCode === '105') {
                throw new ServiceError(SerivceErrorCodes.INVALID_PAN_ERROR);
            }

            const panDetailsCollection: HTMLCollectionOf<Element> =
                panResponseCollection[0].getElementsByTagName('PANDetails');
            const panDetails: NodeListOf<ChildNode> = panDetailsCollection[0].childNodes;

            const response: FbApiVerifyPanResponse = <FbApiVerifyPanResponse>{};

            for (let i = 0; i < panDetails.length; i++) {
                const node: ChildNode = panDetails[i];
                switch (node.nodeName) {
                    case 'PAN':
                        response.panNumber = node.childNodes[0].nodeValue as string;
                        break;
                    case 'PANStatus':
                        response.status = node.childNodes[0].nodeValue as string;
                        break;
                    case 'LastName':
                        response.lastName = node.childNodes[0].nodeValue as string;
                        break;
                    case 'FirstName':
                        response.firstName = node.childNodes[0].nodeValue as string;
                        break;
                    case 'MiddleName':
                        response.middleName = node.childNodes[0].nodeValue as string;
                        break;
                    case 'PANTitle':
                        response.title = node.childNodes[0].nodeValue as string;
                        break;
                    case 'LastUpdateDate':
                        response.lastUpdated = node.childNodes[0].nodeValue as string;
                        break;
                }
            }

            if (response.status !== 'E') {
                throw new ServiceError(SerivceErrorCodes.INVALID_PAN_ERROR);
            }

            if (!response.lastName && !response.firstName && !response.middleName) {
                throw new ServiceError(SerivceErrorCodes.INVALID_PAN_ERROR);
            }

            return response;
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.VERIFY_PAN_RESPONSE_BUILD_ERROR, e.message);
        }
    }

    private buildVerifyNameDobResponse(xml: string): FbApiVerifyNameDobResponse {
        try {
            const dom: Document = new DOMParser().parseFromString(xml, 'text/xml');
            const fioekycbiooutputCollection: HTMLCollectionOf<Element> =
                dom.getElementsByTagName('ns1:fioekycbiooutput');
            const fioekycbiooutputChildren: HTMLCollectionOf<Element> =
                fioekycbiooutputCollection[0].children;
            const response: any = {};
            for (let i = 0; i < fioekycbiooutputChildren.length; i++) {
                switch (fioekycbiooutputChildren[i].nodeName) {
                    case 'ns1:rrn':
                        response.rrn = fioekycbiooutputChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'ns1:status':
                        response.status = fioekycbiooutputChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'ns1:description':
                        response.description = fioekycbiooutputChildren[i].childNodes[0].nodeValue;
                        break;
                }
            }
            return <FbApiVerifyNameDobResponse>response;
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.VERIFY_NAME_DOB_RESPONSE_BUILD_ERROR, e.message);
        }
    }

    private buildGetEkycDetailsResponse(xml: string): FbApiGetEkycDetailsResponse {
        try {
            const dom: Document = new DOMParser().parseFromString(xml, 'text/xml');
            const fioekycbiooutputCollection: HTMLCollectionOf<Element> =
                dom.getElementsByTagName('ns1:fioekycbiooutput');
            const fioekycbiooutputChildren: HTMLCollectionOf<Element> =
                fioekycbiooutputCollection[0].children;
            const response: any = {};
            for (let i = 0; i < fioekycbiooutputChildren.length; i++) {
                switch (fioekycbiooutputChildren[i].nodeName) {
                    case 'ns1:rrn':
                        response.rrn = fioekycbiooutputChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'ns1:status':
                        response.status = fioekycbiooutputChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'ns1:description':
                        response.description = fioekycbiooutputChildren[i].childNodes[0].nodeValue;
                        break;
                }
            }
            return <FbApiGetEkycDetailsResponse>response;
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.VERIFY_NAME_DOB_RESPONSE_BUILD_ERROR, e.message);
        }
    }

    private buildCifEnquiryResponse(xml: string): FbApiCifEnquiryResponse {
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
            return <FbApiCifEnquiryResponse>response;
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.CIF_ENQUIRY_RESPONSE_BUILD_ERROR, e.message);
        }
    }

    private buildCifAckResponse(xml: string): FbApiCifAckResponse {
        try {
            const dom: Document = new DOMParser().parseFromString(xml, 'text/xml');
            const cifEnqRespCollection: HTMLCollectionOf<Element> =
                dom.getElementsByTagName('CifResponse');
            const cifEnqRespChildren: HTMLCollectionOf<Element> =
                cifEnqRespCollection[0].children;
            const response: any = {};
            for (let i = 0; i < cifEnqRespChildren.length; i++) {
                switch (cifEnqRespChildren[i].nodeName) {
                    case 'RequestId':
                        response.requestId = cifEnqRespChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'ResponseCode':
                        response.responseCode = cifEnqRespChildren[i].childNodes[0].nodeValue;
                        break;
                    case 'ResponseReason':
                        response.responseReason = cifEnqRespChildren[i].childNodes[0].nodeValue;
                        break;
                }
            }
            return <FbApiCifAckResponse>response;
        } catch (e: any) {
            throw new ServiceError(SerivceErrorCodes.CIF_CREATION_RESPONSE_BUILD_ERROR, e.message);
        }
    }

    public unitedNationsCheck(): void {

    }

    private generateCreateCifRequestId(): string {
        const now: Date = new Date();
        const year = now.getFullYear() % 100;
        const dayOfYear = Math.floor((now.getMilliseconds() - new Date(now.getFullYear(), 0, 0).getMilliseconds()) / 86400000);
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();
        return 'CIF' + year + dayOfYear + hours + minutes + seconds + milliseconds;
    }

    private calculateTaxSlab(dob: string): string {
        const [day, month, year] = dob.split('-').map(Number);
        const currentDate = new Date();

        const currentYear: number = currentDate.getFullYear();
        const currentMonth: number = currentDate.getMonth() + 1; // Months are zero-based

        const nextFinanancialYear = (currentMonth >= 4) ? currentYear + 1 : currentYear;

        const hasBirthdayOccurred = month >= 4;

        const age = hasBirthdayOccurred
            ? nextFinanancialYear - year - 1
            : nextFinanancialYear - year;

        if (age < 60)
            return "TDSI";
        else
            return "TDSIS"
    }
}