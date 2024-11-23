import { Entity, model, property } from '@loopback/repository';

@model({
    settings: {
        mysql: {
            table: 'workflow_document'
        }
    }
})
export class WorkflowDocumentEntity extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
    })
    id?: number;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'workflow_document_id',
            dataLength: 64,
        }
    })
    workflowDocumentId: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'user_local_id',
            dataLength: 128,
        }
    })
    userLocalId: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'workflow_id',
            dataLength: 64,
        }
    })
    workflowId: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'document_details',
        }
    })
    documentDetails: string;

    @property({
        type: 'object',
        required: true,
        mysql: {
            columnName: 'document_json',
        }
    })
    documentJson: any;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'document_type',
            dataLength: 32,
        }
    })
    documentType: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'document_status',
            dataLength: 32,
        }
    })
    documentStatus: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'document_verifier',
            dataLength: 32,
        }
    })
    documentVerifier: string;

    @property({
        type: 'date',
        required: false,
        default: new Date(),
        mysql: {
            columnName: 'created_at'
        }
    })
    createdAt?: string;

    @property({
        type: 'date',
        required: false,
        default: new Date(),
        mysql: {
            columnName: 'updated_at'
        }
    })
    updatedAt?: string;

    @property({
        type: 'date',
        required: false,
        default: new Date(),
        mysql: {
            columnName: 'expired_at'
        }
    })
    expiredAt?: string;

    constructor(data?: Partial<WorkflowDocumentEntity>) {
        super(data);
    }
}

export interface WorkflowDocumentEntityRelations {
    // describe navigational properties here
}

export type WorkflowDocumentEntityWithRelations = WorkflowDocumentEntity & WorkflowDocumentEntityRelations;
