import { BindingScope, injectable } from "@loopback/core";
import { HttpService } from "./core/http";
import { M2PCardApiRegisterUserRequest } from "./provider/m2p/m2p-card-api.request";
import { FbApiGetEkycDetailsResponse, FbApiVerifyPanResponse } from "./provider/bank/federal/federal-bank-api.response";
import { AddPersonalInfoWorkflowRequest } from "../controllers/onboarding/request/personal-info-workflow.request";

@injectable({ scope: BindingScope.SINGLETON })
export class LocalCMSApiService extends HttpService {

    constructor() {
        super({
            defaults: {
                baseURL: '',
                headers: {

                }
            }
        });
    }

    async register(enityId: string, personalInfoDetails: AddPersonalInfoWorkflowRequest, panDetails: FbApiVerifyPanResponse,
        kycDetails: FbApiGetEkycDetailsResponse): Promise<any> {
        const request: M2PCardApiRegisterUserRequest = new M2PCardApiRegisterUserRequest(enityId);
        request.entityType = 'customer';
        request.businessId = enityId;
        request.title = panDetails.title;
        request.firstName = panDetails.firstName;
        request.lastName = panDetails.lastName;
        request.gender = personalInfoDetails.gender;
        request.isDependant = false;
        request.maritalStatus = personalInfoDetails.maritalStatus;
        request.kitInfo.cardType = 'VIRTUAL';
        request.kitInfo.cardRegStatus = 'ACTIVE';
        request.addressInfo.address1 = personalInfoDetails.permanentAddr.houseNo;
        request.addressInfo.address2 = personalInfoDetails.permanentAddr.place;
        request.addressInfo.address3 = personalInfoDetails.permanentAddr.state;
        request.addressInfo.country = 'India';
        request.addressInfo.pinCode = personalInfoDetails.permanentAddr.pincode;
        request.communicationInfo.contactNo = personalInfoDetails.mobile;
        request.communicationInfo.emailId = personalInfoDetails.email;
        request.communicationInfo.notification = true;
        request.dateInfo.date = kycDetails.KycDetails.dob;
        request.dateInfo.dateType = 'DOB';
        request.kycInfo.documentNo = panDetails.panNumber;
        request.kycInfo.documentType = 'PAN';
        await this.call(request);
    }

}