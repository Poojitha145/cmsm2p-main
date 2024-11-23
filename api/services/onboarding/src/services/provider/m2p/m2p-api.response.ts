export interface M2PApiResponseException {

}

export interface M2PApiResponsePagination {

}

export interface M2PApiResponse<R> {
    result: R | null;
    exception: M2PApiResponseException | null;
    pagination: M2PApiResponsePagination | null;
}

export interface M2PRegisterUserResult {
    kitNo: string;
    sorCustomerId: string;
    kycStatus: string;
    kycExpiryDate: string;
    enityId: string;
    kycRefNo: string;
    status: string;
}