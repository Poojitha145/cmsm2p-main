import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { WorkflowRequestSchema, WorkflowRequest } from "./onboarding.request";


/**
 * Add Personal Info Workflow
 */
export const AddPersonalInfoWorkflowRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['workflowId', 'localUserId', 'employerName', 'designation', 'fatherName', 'motherName'],
    properties: {
        workflowId: WorkflowRequestSchema.WorkflowId,
        localUserId: WorkflowRequestSchema.LocalUserId,
        firstName: {
            type:'string'
        },
        middleName: {
            type: 'string'
        },
        lastName: {
            type: 'string', nullable: false
        },
        fatherName :{
            type :'string', nullable: false
        },
        motherName :{
            type :'string', nullable: false
        },
        maritalStatus :{
            type :'string', enum: ['MARRIED', 'SINGLE', 'NA']
        },
        mobile:{
            type: 'string', nullable :false
        },
        email: {
            type :'string', nullable: false
        },
        employment: {
            type: 'string'
        },
        employerName: {
            type: 'string', nullable: false
        },
        designation: {
            type: 'string', nullable: false
        },
        qualification: {
            type: 'string', nullable: false
        },
        occupation: {
            type: 'string', nullable: false
        },
        annualIncome: {
            type :'number'
        },
        religion: {
            type: 'string'
        },
        community: {
            type: 'string'
        },
        POI:{
            type: 'object',
            properties:{
                poIdType:{
                    type: 'string', nullable: false
                },
                poIdNum: {
                    type: 'string', nullable: false
                }
            }
        },
        POA: {
            type: 'object',
            properties:{
                poaType:{
                    type: 'string', nullable: false
                },
                poaIdNum: {
                    type: 'string', nullable: false
                }
            }
        },
        communicationAddr: {
            type: 'object',
            properties: {
                houseNo: {
                    type :'string', nullable: false, minLength:1
                },
                place: {
                    type :'string', nullable: false
                },
                city: {
                    type :'string', nullable: false
                },
                state: {
                    type :'string', nullable: false
                },
                country: {
                    type :'string', nullable: false
                },
                pincode: {
                    type :'string', nullable: false
                }
            }
        },
        permanentAddr: {
            type: 'object',
            properties: {
                houseNo: {
                    type :'string', nullable: false, minLength:1
                },
                place: {
                    type :'string', nullable: false
                },
                city: {
                    type :'string', nullable: false
                },
                state: {
                    type :'string', nullable: false
                },
                country: {
                    type :'string', nullable: false
                },
                pincode: {
                    type :'string', nullable: false
                }
            }
        }
    }
};

export const AddPersonalInfoWorkflowRequestBody: Partial<RequestBodyObject> = {
    description: '',
    required: true,
    content: {
        'application/json': { schema: AddPersonalInfoWorkflowRequestSchema }
    }
}

export interface AddPersonalInfoWorkflowRequest extends WorkflowRequest {
    middleName: string;
    motherName: string;
    fatherName: string;
    gender: string;
    maritalStatus: string;
    minor: string;
    mobile: string;
    email: string;
    employment: string;
    caSamePa: boolean;
    employerName: string;
    designation: string;
    occupation: string;
    qualification: string;
    annualIncome: string;
    religion: string;
    community: string;
    communicationAddr: {
        houseNo: string;
        place: string;
        city: string;
        state: string;
        ctry: string;
        pincode: string;
    }
    permanentAddr: {
        houseNo: string;
        place: string;
        city: string;
        state: string;
        ctry: string;
        pincode: string;
    }
    POI: {
        poIdType: string;
        poIdNum: string;
    };
    POA: {
        poaType: string;
        poaIdNum: string;
    }
}

