import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import {
    M2PAccountInfoRequest, M2PAccountInfoRequestSchema, M2PAddressInfoRequestSchema, M2PCardAddressInfoRequest,
    M2PCardCommunicatioInfoRequest, M2PCardCreditInfoRequest, M2PCardKitInfoRequest,
    M2PCardKycInfoRequest, M2PCommunicatioInfoRequestSchema, M2PCreditInfoRequestSchema,
    M2PDateInfoRequest, M2PDateInfoRequestSchema, M2PKitInfoRequestSchema,
    M2PKycInfoRequestSchema
} from "./card-register-info.request";

/**
 * M2P User Registert Request 
 */
export const M2PRegisterRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: [
        'entityId', 'entityType', 'businessId', 'firstName', 'lastName',
        'isNRICustomer', 'isMinor', 'isDependant', 'isNRECustomer', 'maritalStatus'
    ],
    properties: {
        entityId: { type: 'string', nullable: false, maxLength: 50 },
        entityType: { type: 'string', nullable: false, maxLength: 10 },
        entityCategory: { type: 'string', nullable: false },
        businessId: { type: 'string', nullable: false, maxLength: 50 },
        customerId: { type: 'string' },
        // kycStatus: {type: 'string'},
        title: { type: 'string' },
        firstName: { type: 'string', nullable: false },
        middleName: { type: 'string' },
        lastName: { type: 'string', nullable: false },
        gender: { type: 'string', nullable: false },
        isNRICustomer: { type: 'boolean', nullable: false },
        isMinor: { type: 'boolean', nullable: false },
        isDependant: { type: 'boolean', nullable: false },
        // isNRECustomer: {type: 'null'},
        maritalStatus: { type: 'string', nullable: false, maxLength: 20 },
        employmentIndustry: {
            type: 'string',
            enum: [
                'AGRICULTURE_FOD_NATURAL_RESOURCES', 'INFORMATION_TECHNOLOGY', 'ARCHITECTURE_AND_CONSTRUCTION',
                'ARTS_AUDIO_OR_VIDEO_TECHNOLOGY_AND_COMMUNICATIONS', 'BUSINESS_MANAGEMENT_AND_ADMINISTRATION',
                'EDUCATION_AND_TRAINING', 'FINANCE', 'GOVERNMENT_AND_PUBLIC_ADMINISTRATION', 'HEALTH_SCIENCE',
                'HOSPITALITY_AND_TOURISM', 'HUMAN_SERVICESINFORMATION_TECHNOLOGY', 'LAW_PUBLIC_SAFETY_CORRECTIONS_ AND_SECURITY',
                'MANUFACTURING', 'MARKETING_SALES_AND_SERVICE', 'SCIENCE_TECHNOLOGY_ENGINEERING_AND_MATHEMATICS',
                'TRANSPORTATION_DISTRIBUTION_AND_LOGISTICS'
            ]
        },
        employmentType: {
            type: 'string',
            enum: [
                'EMPLOYED', 'UNEMPLOYED', 'ENTREPRENEUR', 'PUBLIC_SECTOR_EMPLOYEE', 'FREELANCER', 'HOUSEWORK', 'APPRENTICE RETIRED',
                'STUDENT', 'SELF_EMPLOYED', 'MILITARY_OR_COMMUNITY_SERVICE'
            ]
        },
        //  customerKycStatus: {type: 'string'},
        businessType: { type: 'string' },
        cardOpenDate: { type: 'string' },
        // customerSegment: {type: 'string'},
        kitInfo: M2PKitInfoRequestSchema,
        addressInfo: M2PAddressInfoRequestSchema,
        communicationInfo: M2PCommunicatioInfoRequestSchema,
        accountInfo: M2PAccountInfoRequestSchema,
        kycInfo: M2PKycInfoRequestSchema,
        dateInfo: M2PDateInfoRequestSchema,
        creditInfo: M2PCreditInfoRequestSchema
    }
};

export const M2PRegisterUserRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to register the customer in M2P',
    required: true,
    content: {
        'application/json': { schema: M2PRegisterRequestSchema }
    }
}

export interface M2PCardRegisterRequest {
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
    kitInfo: M2PCardKitInfoRequest;
    addressInfo: M2PCardAddressInfoRequest;
    communicationInfo: M2PCardCommunicatioInfoRequest;
    accountInfo: M2PAccountInfoRequest;
    kycInfo: M2PCardKycInfoRequest;
    dateInfo: M2PDateInfoRequest;
    creditInfo: M2PCardCreditInfoRequest;
}

