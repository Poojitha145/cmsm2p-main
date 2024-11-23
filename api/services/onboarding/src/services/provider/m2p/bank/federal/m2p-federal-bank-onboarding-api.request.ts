import { HttpRequestMethod } from "../../../../core/http";
import { M2PApiDefaults } from "../../m2p-api.common";
import { M2PApiRequest } from "../../m2p-api.request";

export interface LoanApplication {
    source: string;
    agencyId: string;
    borrower: {
        dob: string; //MMDDYYYY
        name: string;
        gender: 'MALE' | 'FEMALE';
        customerId: string;
        sourceIPv4: string;
        applicantType: 'ETB' | 'NTB';
        maritalStatus: 'UNMARRIED' | 'MARRIED';
        contactDetails: {
            addresses: {}[]
            emailList: {
                emailId: string;
                emailType: 'PERSONAL';
            }[],
            phoneList: {
                phoneType: 'PERSONAL_MOBILE';
                countryCode: string;
                phoneNumber: string;
            }[]
        },
        customerIdentifiers: [{
            idName: 'PAN';
            idValue: string;
        }]
    },
    currency: 'INR';
    loanType: 'CC'[];
    categoryId: 'INDIVIDUAL';
    loanAmount: string;
    merchantId: string;
    applicationId: string;
    applicationType: 'INDIVIDUAL';
};

/**
 * Federal Bank - Limit Check
 */
export class M2PFederalBankLimitCheckRequest extends M2PApiRequest {

    aggregatorId: string = 'b1307169147c083e5940a1f900810accc5932074';
    loanApplication: LoanApplication;

    constructor(id: string, entityId: string) {
        super(id, '/api/v1/customer/limit-check', HttpRequestMethod.Post,
            M2PApiDefaults.RequestOptions, entityId);
    }

    getBody(): any {
        
        // this.loanApplication.borrower.contactDetails.emailList[0].emailId;

        return {
            aggregatorId: 'b1307169147c083e5940a1f900810accc5932074',
            loanApplication: {
                source: 'ClientCode_CC',
                agencyId: 'ClientCode_CC',
                borrower: {
                    dob: "07082000",
                    name: "ROHIT BHAGWAT SHIRUDE",
                    gender: "MALE",
                    customerId: "",
                    sourceIPv4: "10.0.65.146",
                    applicantType: "NTB",
                    maritalStatus: "UNMARRIED",
                    contactDetails: {
                        addresses: [{
                            co: 'Gurgaon',
                            po: '',
                            als: '',
                            hba: '',
                            srl: '',
                            uri: '',
                            vtc: '',
                            type: 'PERMANENT',
                            state: 'Haryana',
                            country: 'India',
                            pincode: '122001',
                            district: 'Gurgaon',
                            landmark: '',
                            latitude: '',
                            longitude: ''
                        }],
                        emailList: [{
                            emailId: 'rohit@paisabazaar.com',
                            emailType: 'PERSONAL'
                        }],
                        phoneList: [{
                            phoneType: 'PERSONAL_MOBILE',
                            countryCode: '91',
                            phoneNumber: '9370320152'
                        }]
                    },
                    customerIdentifiers: [{
                        idName: 'PAN',
                        idValue: 'KGIPS5709A'
                    }]
                },
                currency: 'INR',
                loanType: ['CC'],
                categoryId: 'INDIVIDUAL',
                loanAmount: '10000',
                merchantId: 'ClientCode_CC',
                applicationId: 'NZ46uzlCjWsJFugugd6X26I8r3UG93',
                applicationType: 'INDIVIDUAL'
            }
        }
    }
}