import { Strings } from "../../../core/constant/common.constant";
import { HttpRequest, HttpRequestMethod } from "../../../core/http";
import { RandomUtil } from "../../../core/util";

/**
 * PAN Validation
 */
export class FbApiVerifyPanRequest extends HttpRequest {

    public channelId: string;
    public accessId: string;
    public accessCode: string;
    public panNumber: string;

    constructor(id: string) {
        super(id, '/pan/validation', HttpRequestMethod.Post, {
            headers: {
                'Content-Type': 'application/xml'
            }
        });
    }

    getBody(): any {
        const xml: string = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:in="in.co.federalbank">
            <soapenv:Header/>
            <soapenv:Body>
                <in:PANRequest>
                    <ChannelID>${this.channelId}</ChannelID>
                    <AccessId>${this.accessId}</AccessId>
                    <AccessCode>${this.accessCode}</AccessCode>
                    <RequestID>${RandomUtil.uuid()}</RequestID>
                    <PAN1>${this.panNumber}</PAN1>
                </in:PANRequest>
            </soapenv:Body>
        </soapenv:Envelope>`;
        return xml;
    }
}

/**
 * Name DOB Validation 
 */
export class FbApiVerifyNameDobRequest extends HttpRequest {

    public ekycTransactionId: string;
    public name: string;
    public dob: string;

    constructor(id: string) {
        super(id, '/ekyc/namedob/validation', HttpRequestMethod.Post, {
            headers: {
                'Content-Type': 'application/xml'
            }
        });
    }

    getBody(): any {
        const xml: string = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fio="http://www.fiorano.com/services/fioekycbioinputService">
            <soapenv:Header/>
            <soapenv:Body>
                <fio:fioekycbioinput>
                    <requestid>${this.ekycTransactionId}</requestid>
                    <customer_name>${this.name}</customer_name>
                    <customer_dob>${this.dob}</customer_dob>
                </fio:PANRequest>
            </soapenv:Body>
        </soapenv:Envelope>`;
        return xml;
    }
}

/**
 * Verify DDupe SessionId
 */
export class FbApiVerifyDDupeRequest extends HttpRequest {
    userId: string;
    mobileNumber: string = Strings.EMPTY;
    panNumber: string = Strings.EMPTY;
    dob: string = Strings.EMPTY;
    aadhaarNumber: string = Strings.EMPTY;
    passportNumber: string = Strings.EMPTY;
    drivingLicense: string = Strings.EMPTY;
    voterId: string = Strings.EMPTY;
    resField1: string = Strings.EMPTY;
    resField2: string = Strings.EMPTY;
    resField3: string = Strings.EMPTY;
    resField4: string = Strings.EMPTY;
    resField5: string = Strings.EMPTY;
    resField6: string = Strings.EMPTY;
    resField7: string = Strings.EMPTY;
    resField8: string = Strings.EMPTY;
    resField9: string = Strings.EMPTY;
    resField10: string = Strings.EMPTY;

    constructor(id: string) {
        super(id, '/ddupe/check', HttpRequestMethod.Post, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getBody(): any {
        return {
            reference_id: RandomUtil.uuidWithoutHyphen(),
            pan_number: this.panNumber,
            aadhaar_number: this.aadhaarNumber,
            passport_number: this.passportNumber,
            driving_icense: this.drivingLicense,
            voter_id: this.voterId,
            mobile_num: this.mobileNumber,
            user_id: this.userId,
            dob: this.dob,
            res_field1: this.resField1,
            res_field2: this.resField2,
            res_field3: this.resField3,
            res_field4: this.resField4,
            res_field5: this.resField5,
            res_field6: this.resField6,
            res_field7: this.resField7,
            res_field8: this.resField8,
            res_field9: this.resField9,
            res_field10: this.resField10
        }
    }
}


/**
 * Generate EKYC SessionId
 */
export class FbApiGenerateEkycSessionRequest extends HttpRequest {

    public securityToken: string;
    public action: string;

    constructor(id: string) {
        super(id, '/ekyc/generateSessionId', HttpRequestMethod.Post, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getBody(): any {
        return {
            SecurityToken: this.securityToken,
            Action: this.action
        };
    }
}

/**
 * Fetch EKYC details
 */
export class FbApiGetEkycDetailsRequest extends HttpRequest {

    public transactionId: string;
    public securityToken: string;
    public action: string;

    constructor(id: string) {
        super(id, '/ekyc/generateSessionId', HttpRequestMethod.Post, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getBody(): any {
        return {
            TransactionId: this.transactionId,
            SecurityToken: this.securityToken,
            Action: this.action
        };
    }
}

/**
 * CIF Enquiry
 */
export class FbApiCifEnquiryRequest extends HttpRequest {

    constructor(id: string) {
        super(id, '/cif/CifEnq', HttpRequestMethod.Post, {
            headers: {
                'Content-Type': 'application/xml'
            }
        });
    }

    getBody(): any {
        const xml: string = `<req><id>1687706081951744</id></req>`;
        return xml;
    }
}

/**
 * CIF Create
 */
export class FbApiCifCreateRequest extends HttpRequest {
    public userAccessId: string;
    public userAccessCode: string;
    public senderCode: string;
    public requestId: string;
    public solId: string;
   // public BRERefNum: string;
  //  public nrinCode: string;
  //  public nri: string;
   // public nationality: string;
    public currencyCode: string;
    public title: string;
    public firstName: string;
    public middleName: string;
    public lastName: string;
   // public customerName: string;
    public fatherName: string;
    public motherName: string;
    public dob: string;
    public gender: string;
    public maritalStatus :string;
    public panNo: string;
 //   public uidNo: string;
    public mobile: string;
    public email: string;
    // public StaffFlag: string;
    // public RelStaff: string;
    public minor: string;
    public houseNmePm: string;
    public houseNmePr: string;
    public placePm: string;
    public PlacePr: string;
    // public prcitCode: string;
    // public pmcitCode: string;
    public cityPm: string;
    public cityPr: string;
    public statePm: string;
    public statePr: string;
    public ctryPm: string;
    public ctryPr: string;
    public pinPr: string;
    public PinPm: string;
    public caSamePa: string;
    public qualification: string;
    public annualIncome: string;
    public occupation: string;
    public form60: string;
    public taxSlab: string;
    public employment: string;
    public employerName: string;
    public designation: string;
    public poiIdType: string;
    public poiIdNum: string;
    public poaType: string;
    public poaIdNum: string;
    public religion: string;
    public community: string;
    public landLine: string;
    
    constructor(id: string) {
        super(id, '/cif/creation', HttpRequestMethod.Post, {
            headers: {
                'Content-Type': 'application/xml'
            }
        });
    }

    getBody(): any {
        const xml: string = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:in="in.co.federalbank">
             <soapenv:Header/>
                <soapenv:Body>
                 <Cif_Creation>
                  <SenderCredentials>
                    <UserAccessId>${this.userAccessId}</UserAccessId>
                    <UserAccessCode>${this.userAccessCode}</UserAccessCode>
                    <SenderCode>${this.senderCode}</SenderCode>
                  </SenderCredentials>
                 <Cif_Request>
                  <RequestId>${this.requestId}</RequestId>
                  <SolId>${this.solId}</SolId>
                  <Personal_Details>
                     <Title>${this.title}</Title>
                     <FirstName>${this.firstName}</FirstName>
                     <MiddleName>${this.middleName}</MiddleName>
                     <LastName>${this.lastName}</LastName>
                     <FatherName>${this.fatherName}</FatherName>
                     <MotherName>${this.motherName}</MotherName>
                     <DateOfBirth>${this.dob}</DateOfBirth>
                     <Gender>${this.gender}</Gender>
                     <MaritalStatus>${this.maritalStatus}</MaritalStatus>
                 </Personal_Details>
                <Contact_Details>
                 <Mobile>${this.mobile}</Mobile>
                 <Email>${this.email}</Email>
                <Communication_Address>
                    <House>${this.houseNmePr}</House>
                    <Place>${this.PlacePr}</Place>		
                    <City_Cd>${this.cityPr}TCR</City_Cd>
                    <State_Cd>${this.statePr}</State_Cd>
                    <Country_Cd>${this.ctryPr}</Country_Cd>
                    <PinCode>${this.pinPr}</PinCode>
                    <LandLine>${this.landLine}</LandLine>
                </Communication_Address>
                <CA_Sameas_PA>${this.caSamePa}</CA_Sameas_PA>
                <Permanent_Address>
                  <House>${this.houseNmePm}</House>
                  <Place>${this.placePm}</Place>		
                  <City_Cd>${this.cityPm}</City_Cd>
                  <State_Cd>${this.statePm}</State_Cd>
                  <Country_Cd>${this.ctryPm}</Country_Cd>
                  <PinCode>${this.PinPm}</PinCode>
                  <LandLine>${this.landLine}</LandLine>
                </Permanent_Address>
             </Contact_Details>
             <Additional_Details>
                <AnnualIncome>${this.annualIncome}</AnnualIncome>
                <PanNo>${this.panNo}</PanNo>
                <Religion>${this.religion}</Religion>
                <Community>${this.community}</Community>
                <Qualification>${this.qualification}</Qualification>
                <Occupation>${this.occupation}</Occupation>
                <Form60>N</Form60>
                <TaxSlab>${this.taxSlab}</TaxSlab>
                <Employement>${this.employment}</Employement>
                <EmployerName>${this.employerName}</EmployerName>
                <Designation>${this.designation}</Designation>
             </Additional_Details>
             <Identification_Details>
                <ProofOfIdentity>
                   <Type>${this.poiIdType}</Type>
                   <Id_Number>${this.poiIdNum}</Id_Number>
                   <Id_IssueDate>2014-01-01</Id_IssueDate>
                   <Id_ExpiryDate>2099-01-01</Id_ExpiryDate>
                </ProofOfIdentity>
                <ProofOfAddress>
                   <Type>${this.poaType}</Type>
                   <Id_Number>${this.poaIdNum}</Id_Number>
                   <Id_IssueDate>2014-01-01</Id_IssueDate>
                   <Id_ExpiryDate>2099-01-01</Id_ExpiryDate>
                </ProofOfAddress>
             </Identification_Details>
            </Cif_Request>
        </Cif_Creation>
     </soapenv:Body>
</soapenv:Envelope>`;
        return xml;
    }
}


/**
 * BRE
 */
export class FbApiLimitCheckRequest extends HttpRequest {

    public aggregatorId: string;
    public loanApplication: {
        source: string;
        agencyId: string;
        borrower: {
            dob: string;
            name: string;
            gender: string;
            customerId: string;
            sourceIPv4: string;
            applicantType: string;
            maritalStatus: string;
            contactDetails: {
                addresses: [
                    {
                        co: string;
                        po: string;
                        als: string;
                        hba: string;
                        srl: string;
                        uri: string;
                        vtc: string;
                        type: string;
                        state: string;
                        country: string;
                        pincode: string;
                        district: string;
                        landmark: string;
                        latitude: string;
                        longitude: string;
                    }
                ],
                emailList: [
                    {
                        emailId: string;
                        emailType: 'PERSONAL';
                    }
                ],
                phoneList: [
                    {
                        phoneType: 'PERSONAL_MOBILE';
                        countryCode: string;
                        phoneNumber: string;
                    }
                ]
            },
            customerIdentifiers: [
                {
                    idName: string;
                    idValue: string;
                }
            ]
        },
        currency: string;
        loanType: string;
        categoryId: string;
        loanAmount: string;
        merchantId: string;
        applicationId: string;
        applicationType: string;
    }

    constructor(id: string) {
        super(id, '/api/v1/customer/limit-check', HttpRequestMethod.Post, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getBody(): any {

        return {};
    }

}