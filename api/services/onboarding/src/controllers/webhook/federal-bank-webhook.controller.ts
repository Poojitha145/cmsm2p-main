import { inject, service } from "@loopback/core";
import { RestBindings, api, post, requestBody } from "@loopback/rest";
import { FinableWorkflowService } from "../../services/workflow/loan-workflow/finable-workflow.service";

@api({
    basePath: '/federal/webhook'
})
export class FederalBankWebHookController {
    constructor(
        @service(FinableWorkflowService) private workflowService: FinableWorkflowService
    ) {}

    @post('/cif')
    async cif(@requestBody() body: string): Promise<void> {
        await this.workflowService.processCifWebhook(body);
    }

    @post('/vkyc')
    async vkyc(@requestBody() body: string): Promise<void> {

    }
}