import { ReferenceObject, RequestBodyObject, SchemaObject } from "@loopback/rest";
import { M2PApiRequestSchema } from "./card-common.request";

/**
 * M2P Register Request 
 */
export const M2PKitInfoRequestSchema: SchemaObject | ReferenceObject = {
    type: 'array',
    required: ['cardType', 'cardCategory', 'cardRegStatus'],
    items:{
        type:'object',
         properties: {
              kitNo: { type: 'string', nullable: false, maxLength:20},
              cardType: {type: 'string', enum: ['PHYSICAL', 'VIRTUAL', 'WALLET']},
              cardCategory: {type: 'string', enum: ['PREPAID', 'CREDIT', 'FOREX', 'DEBIT', 'MEAL', 'FUEL', 'GIFT']},
              cardRegStatus: {type: 'string', enum: ['ACTIVE', 'UNACTIVATED', 'LOCKED']},
              expDate: {type: 'number'},
              aliasName: {type: 'string'},
              fourthLine: {type: 'string'}
    }
}
};

export const M2PKitInfoRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to register the customer in M2P',
    required: true,
    content: {
        'application/json': { schema: M2PKitInfoRequestSchema }
    }
}

export interface M2PCardKitInfoRequest {
    kitNo: string,
    cardType: string,
    cardCategory: string,
    cardRegStatus: string,
    expDate: number,
    aliasName: string,
    fourthLine: string
}

/**
 * M2P Register Request 
 */
export const M2PKycInfoRequestSchema: SchemaObject | ReferenceObject = {
    type: 'array',
    items:{
    type: 'object',
    required: ['documentType', 'documentNo', 'documentExpiry'],
    properties: {
      kycRefNo: { type: 'string', nullable: false, maxLength:20},
      documentType: {type: 'string', nullable: false, maxLength:30 },
      documentNo: {type: 'string', nullable: false, maxLength:50},
      documentExpiry: {type: 'string', nullable: false}
    }
}
};

export const M2PKycInfoRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to register the customer in M2P',
    required: true,
    content: {
        'application/json': { schema: M2PKycInfoRequestSchema }
    }
}

export interface M2PCardKycInfoRequest {
    kycRefNo: string,
    documentType: string,
    documentNo: string,
    documentExpiry: string

}


/**
 * M2P Register Request 
 */
export const M2PDateInfoRequestSchema: SchemaObject | ReferenceObject = {
    type: 'array',
    items:{
         type: 'object',
          properties: {
             dateType: { type: 'string'},
             date: {type: 'string'},
    }
}
};

export const M2PDateInfoRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to register the customer in M2P',
    required: true,
    content: {
        'application/json': { schema: M2PDateInfoRequestSchema }
    }
}

export interface M2PDateInfoRequest {
    dateType: string,
    date: string
}


/**
 * M2P Register Request 
 */
export const M2PAddressInfoRequestSchema: SchemaObject | ReferenceObject = {
    type:'array',
    items:{
    type: 'object',
    required: ['addressCategory', 'address1', 'address2', 'address3', 'city', 'state', 'country', 'pincode'],
    properties: {
        addressCategory: {type: 'string', nullable: false, maxLength: 30},
        address1: {type: 'string', nullable: false, maxLength: 30},
        address2: { type: 'string', nullable: false, minLength: 1, maxLength: 30 },
        address3: { type: 'string', nullable: false, minLength: 1, maxLength: 30 },
        city: { type: 'string', nullable: false, minLength: 1, maxLength: 20 },
        state: { type: 'string', nullable: false, minLength: 1, maxLength: 20 },
        country: { type: 'string', nullable: false, minLength: 1, maxLength: 20 },
        pinCode: { type: 'string', nullable: false, minLength: 1, maxLength: 15 }
    }
    }
};

export const M2PAddressInfoRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to register the customer in M2P',
    required: true,
    content: {
        'application/json': { schema: M2PAddressInfoRequestSchema }
    }
}

export interface M2PCardAddressInfoRequest {
    addressCategory: string,
    address1: string,
    address2: string,
    address3: string,
    city: string,
    state: string,
    country: string,
    pinCode: string


}

/**
 * M2P Register Request 
 */
export const M2PCreditInfoRequestSchema: SchemaObject | ReferenceObject = {
    type: 'object',
    required: ['cardCategory', 'creditLimit', 'cashLimit', 'statementDate'],
    properties: {
        cardCategory: {type: 'string', enum: ['PLATINUM', 'CLASSIC', 'PREMIUM']},
        creditLimit: {type: 'string', nullable: false},
        cardLimit :{type: 'string', nullable: false},
        statementDate:{type:'number', enum:[4,21]}
        // creditScore: {type: 'null'},
        // statementDate: {type: 'null'},
        // dueDate: {type: 'null'}
    }
};

export const M2PCreditInfoRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to register the customer in M2P',
    required: true,
    content: {
        'application/json': { schema: M2PCreditInfoRequestSchema }
    }
}

export interface M2PCardCreditInfoRequest {
    cardCategory: string,
    creditLimit: string,
    cardLimit: string,
    statementDate: string
    // creditScore: null,
    // statementDate: null,
    // dueDate: null
}


/**
 * M2P Register Request 
 */
export const M2PCommunicatioInfoRequestSchema: SchemaObject | ReferenceObject = {
    type:'array',
    items:{
    type: 'object',
    required: ['contactNo', 'emailId', 'notification'],
    properties: {
      contactNo: { type: 'string', nullable: false, maxLength:15},
      contactNo2: { type: 'string', maxLength:15},
      emailId: {type: 'string', nullable: false, maxLength:50},
      notification: {type: 'boolean', default:false }
    }
}
};

export const M2PCommunicatioInfoRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to register the customer in M2P',
    required: true,
    content: {
        'application/json': { schema: M2PCommunicatioInfoRequestSchema }
    }
}

export interface M2PCardCommunicatioInfoRequest {
    contactNo: string,
    contactNo2: string,
    emailId: string,
    notification: boolean
}


/**
 * M2P Register Request 
 */
export const M2PAccountInfoRequestSchema: SchemaObject | ReferenceObject = {
    type: 'array',
    items:{
    type: 'object',
    properties: {
        entityId: { type: 'string'},
        tenant: {type: 'string' },
        accountNo: {type: 'string', maxLength: 25},
        accountType: {type: 'string'},
        accountTag: {type: 'string'}
    }
}
};

export const M2PAccountInfoRequestBody: Partial<RequestBodyObject> = {
    description: 'This API is used to register the customer in M2P',
    required: true,
    content: {
        'application/json': { schema: M2PAccountInfoRequestSchema }
    }
}

export interface M2PAccountInfoRequest {
    entityId: string,
    tenant: string,
    accountNo: string,
    accountType: string,
    accountTag: string
}









