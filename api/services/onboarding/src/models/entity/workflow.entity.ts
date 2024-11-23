import { Entity, model, property } from '@loopback/repository';

@model({
    settings: {
        mysql: {
            table: 'workflow'
        }
    }
})
export class WorkflowEntity extends Entity {
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
            columnName: 'workflow_status',
            dataLength: 128,
        }
    })
    workflowStatus: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'workflow_state',
            dataLength: 32,
        }
    })
    workflowState: string;

    @property({
        type: 'string',
        required: true,
        mysql: {
            columnName: 'workflow_type',
            dataLength: 32,
        }
    })
    workflowType: string;

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

    constructor(data?: Partial<WorkflowEntity>) {
        super(data);
    }
}

export interface WorkflowEntityRelations {
    // describe navigational properties here
}

export type WorkflowEntityWithRelations = WorkflowEntity & WorkflowEntityRelations;
