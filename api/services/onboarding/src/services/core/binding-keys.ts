import { BindingKey } from "@loopback/core";
import { AppConfig } from "../../models/config/app.config";
import { FederalBankApiConfig } from "../provider/bank/federal/federal-bank-api.config";
import { GupshupSmsService } from "../provider/gupshup/gupshup.service";
import { SmsService } from "../communication/sms.service";
import { OtpService } from "../communication/otp.service";
import { FinableWorkflowService } from "../workflow/loan-workflow/finable-workflow.service";
import { OnboardingService } from "../app/onboarding.service";
import { WorkflowDocumentService } from "../workflow/workflow-document.service";
import { FederalBankApiService } from "../provider/bank/federal/federal-bank-api.service";
import { M2PCardApiService } from "../provider/m2p/m2p-card-api.service";
import { M2PFederalBankOnboardingApiService } from "../provider/m2p/bank/federal/m2p-federal-bank-onboardinng-api.service";
import { LocalCMSApiService } from "../local-cms-api.service";

export namespace ConfigBindings {

    export const AppConfig = BindingKey.create<AppConfig>(
        'ConfigBindings.AppConfig',
    );

    export const FederalBankConfig = BindingKey.create<FederalBankApiConfig>(
        'ConfigBindings.FederalBankConfig',
    );
}

export namespace RequestBindings {

    export const LocalUserId = BindingKey.create<string>(
        'RequestBindings.LocalUserId',
    );

    export const DeviceId = BindingKey.create<string>(
        'RequestBindings.DeviceId',
    );

    export const PhoneNumber = BindingKey.create<string>(
        'RequestBindings.PhoneNumber',
    );

    export const RequestId = BindingKey.create<string>(
        'RequestBindings.RequestId',
    );
}

export namespace ServiceBindings {

    export const SmsService = BindingKey.create<SmsService>(
        'ServiceBindings.SmsService'
    );

    export const OtpService = BindingKey.create<OtpService>(
        'ServiceBindings.OtpService'
    );

    export const GupshupSmsService = BindingKey.create<GupshupSmsService>(
        'ServiceBindings.GupshupSmsService'
    );

    export const FinableWorkflowService = BindingKey.create<FinableWorkflowService>(
        'ServiceBindings.FinableWorkflowService'
    );

    export const WorkflowDocumentService = BindingKey.create<WorkflowDocumentService>(
        'ServiceBindings.WorkflowDocumentService'
    );

    export const OnboardingService = BindingKey.create<OnboardingService>(
        'ServiceBindings.OnboardingService'
    );

    export const FederalBankApiService = BindingKey.create<FederalBankApiService>(
        'ServiceBindings.FederalBankApiService'
    );

    export const M2PCardApiService = BindingKey.create<M2PCardApiService>(
        'ServiceBindings.M2PCardApiService'
    );

    export const LocalCMSApiService = BindingKey.create<LocalCMSApiService>(
        'ServiceBindings.LocalCMSApiService'
    );

    export const M2PFederalBankOnboardingApiService = BindingKey.create<M2PFederalBankOnboardingApiService>(
        'ServiceBindings.M2PFederalBankOnboardingApiService'
    );
}