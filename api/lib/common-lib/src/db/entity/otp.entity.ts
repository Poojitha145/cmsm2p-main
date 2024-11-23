import { Entity, model, property } from '@loopback/repository';

@model({
    settings: {
        mysql: {
            table: 'otp'
        }
    }
})
export class OtpEntity extends Entity {

    @property({
        type: 'string',
        id: true,
        required: true,
        mysql: {
            columnName: 'otp_id',
            dataLength: 255,
        }
    })
    otpId: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'mobile_number',
            dataLength: 255,
        }
    })
    mobileNumber: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'code',
            dataLength: 255,
        }
    })
    code: string;

    @property({
        type: 'number',
        required: true,
        default: 0,
        mysql: {
            columnName: 'attempts',
            default: 0
        }
    })
    attempts: number;

    @property({
        type: 'boolean',
        required: true,
        default: false,
        mysql: {
            columnName: 'verified',
            dataType: 'tinyint',
            default: 0
        }
    })
    verified: boolean;

    @property({
        type: 'number',
        required: false,
        default: 60,
        mysql: {
            columnName: 'expired_in_seconds',
            default: 60
        }
    })
    expiredInSeconds: number;

    @property({
        type: 'date',
        required: false,
        mysql: {
            columnName: 'created_at'
        }
    })
    createdAt?: string;

    @property({
        type: 'date',
        required: false,
        mysql: {
            columnName: 'updated_at'
        }
    })
    updatedAt?: string;

    constructor(data?: Partial<OtpEntity>) {
        super(data);
    }
}

export interface OtpEntityRelations {
    // describe navigational properties here
}

export type OtpEntityWithRelations = OtpEntity & OtpEntityRelations;
