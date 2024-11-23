import { inject } from '@loopback/core';
import { Count, DefaultCrudRepository, DefaultTransactionalRepository, Where, WhereBuilder } from '@loopback/repository';
import { CmsDataSource } from '../datasources';
import { WorkflowEntity, WorkflowEntityRelations } from '../models/entity/workflow.entity';
import { LoanType, LoanWorkflowState, LoanWorkflowStatus } from '../services/workflow/loan-workflow-enums';
import { SerivceErrorCodes, ServiceError } from '../services/common/error/service.error';
import { LoanWorkflow } from '../services/workflow/loan-workflow/loan-workflow.model';

export class LoanWorkflowRepository extends DefaultCrudRepository<
  WorkflowEntity,
  typeof WorkflowEntity.prototype.id> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(WorkflowEntity, dataSource);
  }

  async updateWorkflow(workflowId: string, workflowState: LoanWorkflowState,
    workflowStatus: LoanWorkflowStatus = LoanWorkflowStatus.IN_PROGRESS):
    Promise<LoanWorkflow> {
    const data: LoanWorkflow = {
      workflowId: workflowId,
      workflowState: workflowState,
      workflowStatus: workflowStatus
    };
    if (workflowState === LoanWorkflowState.FINISHED) {
      data.workflowStatus = LoanWorkflowStatus.COMPLETED
    }

    try {
      const count: Count = await this.updateAll(data, { workflowId: workflowId });
      if (count.count > 0) {
        return data;
      }
      throw new ServiceError(SerivceErrorCodes.FAILED_WORKFLOW_UPDATE, {
        workflowId, workflowState, workflowStatus, data
      });
    } catch (e: any) {
      throw new ServiceError(SerivceErrorCodes.DB_ERROR, {
        workflowId, workflowState, workflowStatus, data
      });
    }
  }

  async getWorkflowById(workflowId: string):
    Promise<WorkflowEntity> {
    try {
      let object: WorkflowEntity | null =
        await this.findOne({ where: { workflowId: workflowId } });
      if (object) {
        return object;
      }
    } catch (e: any) {

    }
    throw new ServiceError(SerivceErrorCodes.WORKFLOW_NOT_FOUND);
  }

  async getUserActiveWorkflowByType(localUserId: string, loanType: LoanType):
    Promise<WorkflowEntity | null> {
    try {
      const where: Where = new WhereBuilder()
        .and({
          localUserId: { eq: localUserId }
        }, {
          workflowType: { eq: loanType }
        }, {
          workflowStatus: { neq: LoanWorkflowStatus.DISCARDED }
        }).build();

      let object: WorkflowEntity | null = await this.findOne({ where: where, order: ['createdAt DESC'] });
      // check for expired and return
      return object;
    } catch (e: any) {
      // this.logger.error(`While getting invitation todo list - Object -> ${JSON.stringify(e)}`);
    }
    return null;
  }

  async getActiveWorkflowByState(requestId: string, localUserId: string,
    workflowState: LoanWorkflowState, loanType: LoanType = LoanType.CC):
    Promise<WorkflowEntity | null> {
    try {
      const where: Where = new WhereBuilder()
        .and({
          localUserId: localUserId
        }, {
          workflowType: loanType
        }, {
          workflowStatus: { neq: LoanWorkflowStatus.DISCARDED }
        }).build();

      let object: WorkflowEntity | null = await this.findOne({ where: where });

      // check for expired and return

      return object;
    } catch (e: any) {
      // this.logger.error(`While getting invitation todo list - Object -> ${JSON.stringify(e)}`);
      throw e;
    }
  }
}