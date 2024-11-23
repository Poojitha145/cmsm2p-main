

export interface FbApiVerifyPanResponse {

    panNumber: string;
    status: string;
    lastName: string;
    firstName: string;
    middleName: string;
    title: string;
    lastUpdated: string;
}

export interface FbApiVerifyNameDobResponse {

    status: string;
    description: string;
    rrn: string;
}

export interface FbApiEkycDetails {
    pincode: string;
    postoffice: string;
    gender: string;
    locality: string;
    vtcname: string;
    photo: string;
    careof: string;
    phone: string;
    dob: string;
    street: string;
    district: string;
    name: string;
    houseno: string;
    state: string;
    landmark: string;
    email: string;
}

export interface FbApiGetEkycDetailsResponse {

    Status: string;
    auaSpecificUidToken: string;
    maskedAadhaarNumberFromUIDAI: string;
    ErrorCode: string;
    TransactionId: string,
    KycDetails: FbApiEkycDetails;
}

export interface FbApiCifEnquiryResponse {
    requestId: string;
    customerId: string;
    customerName: string;
    cifResponseCode: string;
    cifResponseReason: string;
    responseCode: string;
    responseReason: string;
    cifCreatedTime: string;
}

export interface FbApiVerifyDDupeResponse {
    reference_id: string;
    ddupe_flag: string;
    kyc_flag: string;
    kyc_profile_flag: string;
    partial_kyc_flag: string;
    dob_flag: string;
    mobile_flag: string;
    customer_id: string;
    customer_name: string;
    nri_flag: string;
    minor_flag: string;
    reserve_field1: string;
    reserve_field2: string;
    reserve_field3: string;
    reserve_field4: string;
    reserve_field5: string;
    reserve_field6: string;
    reserve_field7: string;
    reserve_field8: string;
    reserve_field9: string;
    reserve_field10: string;
    errorResponse: {
        tranTimeStamp: string;
        statuscode: string;
        statusreason: string;
        customcode: string;
        customreason: string;
        tranId: string;
        description: string;
        additionalDetails: any;
    };
}

export interface FbApiCifAckResponse {
    requestId: string;
    responseCode: string;
    responseReason: string;
}

export interface FbApiCifCreateResponse {
    requestId: string;
    customerId: string;
    customerName: string;
    cifResponseCode: string;
    cifResponseReason: string;
    responseCode: string;
    responseReason: string;
    cifCreatedTime: string;
} 