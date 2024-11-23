import { HttpRequest, HttpRequestMethod } from "../../core/http";
import { M2PApiDefaults } from "./m2p-api.common";
import { M2PApiRequest } from "./m2p-api.request";

/**
 * Get Card List
 */
export class M2pCardApiGetListRequest extends M2PApiRequest {

    constructor(id: string, entityId: string) {
        super(id, '/Yappay/business-entity-manager/v2/getCardList', HttpRequestMethod.Post,
            M2PApiDefaults.RequestOptions, entityId);
    }

    getBody(): any {
        return {
            customerId: this.entityId
        }
    }
}

export class M2PCardApiRegisterUserRequest extends HttpRequest {
    entityId: string;
    entityType: string;
    entityCategory: string;
    businessId: string;
    customerId: string;
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    isNRICustomer: boolean;
    isMinor: boolean;
    isDependant: boolean;
    maritalStatus: string;
    employmentIndustry: string;
    employmentType: string;
    businessType: string;
    cardOpenDate: string;
    kitInfo: {
        kitNo: string,
        cardType: string,
        cardCategory: string,
        cardRegStatus: string,
        expDate: number,
        aliasName: string,
        fourthLine: string
    }
    addressInfo: {
        addressCategory: string,
        address1: string,
        address2: string,
        address3: string,
        city: string,
        state: string,
        country: string,
        pinCode: string
    };
    communicationInfo: {
        contactNo: string,
        contactNo2: string,
        emailId: string,
        notification: boolean
    };
    accountInfo: {
        entityId: string,
        tenant: string,
        accountNo: string,
        accountType: string,
        accountTag: string
    };
    kycInfo: {
        kycRefNo: string,
        documentType: string,
        documentNo: string,
        documentExpiry: string
    };
    dateInfo: {
        dateType: string,
        date: string
    };
    creditInfo: {
        cardCategory: string,
        creditLimit: string,
        cardLimit: string,
        statementDate: string
    }

    constructor(id: string) {
        super(id, 'api/v1/users/register', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            entityType: this.entityType,
            entityCategory: this.entityCategory,
            businessId: this.businessId,
            customerId: this.customerId,
            title: this.title,
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            gender: this.gender,
            isNRICustomer: this.isNRICustomer,
            isMinor: this.isMinor,
            isDependant: this.isDependant,
            maritalStatus: this.maritalStatus,
            employmentIndustry: this.employmentIndustry,
            employmentType: this.employmentType,
            businessType: this.businessType,
            cardOpenDate: this.cardOpenDate,
            kitInfo: this.kitInfo,
            addressInfo: this.addressInfo,
            communicationInfo: this.communicationInfo,
            accountInfo: this.accountInfo,
            kycInfo: this.kycInfo,
            dateInfo: this.dateInfo,
            creditInfo: this.creditInfo
        }
    }
}

export class M2PCardApiPhysicalRequest extends HttpRequest {
    entityId: string;
    kitNo: string;
    addressDto: { address: {
        title: string,
        address1: string,
        address2: string,
        city: string,
        state: string,
        country: string,
        pinCode: string,
        fourthLine: string
    }[] };

    constructor(id: string) {
        super(id, '/Yappay/business-entity-manager/requestPhysicalCard', HttpRequestMethod.Post);
    }

    override getBody(): any {
        return {
            entityId: this.entityId,
            kitNo: this.kitNo,
            addressDto: this.addressDto
        }
    }
}