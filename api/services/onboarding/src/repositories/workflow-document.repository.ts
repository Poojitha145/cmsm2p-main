import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { CmsDataSource } from '../datasources';
import { WorkflowDocumentEntity } from '../models/entity/workflow-document.entity';
import { SerivceErrorCodes, ServiceError } from '../services/common/error/service.error';
import { DocumentStatus, DocumentType } from '../services/workflow/loan-workflow/loan-workflow.model';

export class WorkflowDocumentRepository extends DefaultCrudRepository<
  WorkflowDocumentEntity,
  typeof WorkflowDocumentEntity.prototype.id> {

  constructor(@inject('datasources.cms') dataSource: CmsDataSource) {
    super(WorkflowDocumentEntity, dataSource);
  }

  async getDocumentsObject(workflowId: string, types?: DocumentType[]): Promise<{ [key: string]: WorkflowDocumentEntity }> {
    try {
      const workflowDocumentEntity: WorkflowDocumentEntity[] =
        await this.find({
          where: {
            and: [
              { workflowId: { eq: workflowId } },
              { documentStatus: { eq: DocumentStatus.VERIFIED } }]
          },
          order: ['createdAt DESC']
        });
      // TODO - use distinct query instead looping 
      const documentsObject = workflowDocumentEntity.reduce(function (object: any,
        item: WorkflowDocumentEntity, index: number, array: any) {
        // taking only recently created document
        if (!object[item.documentType]) {
          object[item.documentType] = item;
        }
        return object;
      }, {});
      if (types) {
        for (let type of types) {
          if (!documentsObject[type]) {
            throw new Error();
          }
        }
      }
      return documentsObject;
    } catch (e: any) {
      throw new ServiceError(SerivceErrorCodes.DB_ERROR, { workflowId });
    }
  }

  async getDocument(workflowId: string, documentType: DocumentType):
    Promise<WorkflowDocumentEntity | null> {
    try {
      return await this.findOne({
        where: {
          and: [
            { workflowId: { eq: workflowId } },
            { documentType: { eq: documentType } },
            { documentStatus: { eq: DocumentStatus.VERIFIED } }]
        },
        order: ['createdAt DESC']
      });
    } catch (e: any) {
      throw new ServiceError(SerivceErrorCodes.DB_ERROR, { workflowId, documentType });
    }
  }

  async getDocumentJson<T>(workflowId: string, documentType: DocumentType):
    Promise<T> {
    try {
      const workflowDocumentEntity: WorkflowDocumentEntity | null =
        await this.getDocument(workflowId, documentType);

      if (workflowDocumentEntity) {
        return workflowDocumentEntity.documentJson;
      }
      throw new ServiceError(SerivceErrorCodes.WORKFLOW_DOCUMENT_NOT_FOUND, { workflowId, documentType });
    } catch (e: any) {
      throw new ServiceError(SerivceErrorCodes.FAILED_TO_PARSE_WORKFLOW_DOCUMENT, { workflowId, documentType });
    }
  }
}
