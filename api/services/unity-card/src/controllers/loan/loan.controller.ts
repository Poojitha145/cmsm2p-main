import { get, post, requestBody } from "@loopback/rest";
import { inject, service } from "@loopback/core";
import { AuthTokenPayload, CommonBindings, Normalize } from "common-lib";
import { Bindings } from "../../models/bindings";
import { M2PCardService } from "../../services/partner/m2p/card/m2p-card.service";
import { M2PEmiCreateLoanRequest, M2PEmiCreateLoanRequestBody, M2PEmiPreviewLoanRequest, M2PEmiPreviewLoanRequestBody } from "./loan.request";
import { authenticate } from "@loopback/authentication";

@authenticate('jwt')
export class LoanController {

  constructor(
    @inject(Bindings.Request.ID)
    private requestId: string,
    @inject(CommonBindings.Model.AUTH_TOKEN_PAYLOAD)
    private authTokenPayload: AuthTokenPayload,
    @service() private cardService: M2PCardService) {

  }

  @get('/loan/eligible/emi/transactions')
  getEligibleTransactions() {
    return this.cardService.getEmiEligibleTransactions(this.requestId, this.authTokenPayload.partner.partnerCifNo);
  }

  @get('/loan/get/list')
  getList() {
    return this.cardService.getAllLoans(this.requestId, this.authTokenPayload.partner.partnerCifNo);
  }

  @post('/loan/preview')
  previewLoan(@requestBody(M2PEmiPreviewLoanRequestBody)
  request: M2PEmiPreviewLoanRequest) {
    return this.cardService.previewLoan(this.requestId, this.authTokenPayload.partner.partnerCifNo,
      request.ruleId, request.loanRequestType, request.transactions);
  }

  @post('/loan/create')
  createLoan(@requestBody(M2PEmiCreateLoanRequestBody)
  request: M2PEmiCreateLoanRequest) {
    return this.cardService.createLoan(this.requestId, this.authTokenPayload.partner.partnerCifNo,
      request.tenure, request.loanRequestId);
  }
}
