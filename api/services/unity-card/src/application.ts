import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { SECURITY_SCHEME_SPEC } from '@loopback/authentication-jwt';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';
import { AppSequence } from './sequence';
import path from 'path';
import AWS from 'aws-sdk';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy
} from '@loopback/authentication';
import { JWTStrategy } from './services/authentication/strategy/jwt-strategy';
import { UserService } from './services/user/user.service';
import {
  CmsDataSource, Logger, OtpRepository,
  OtpService,
  TokenService, ConfigHelper,
  UserLoginRepository, UserPartnerRepository, UserRepository, CommonBindings, DataSourceConfig,
  SmsService,
  SecretsManagerClient
} from 'common-lib';
import { Bindings } from './models/bindings';
import * as dotenv from "dotenv";
import { AppConfig } from './models/config.model';
import { JWTService } from './services/authentication/jwt-service';
import { DbService } from './services/db.service';
import { KaleryaApiConfig } from 'common-lib/dist/service/communication/provider/kalerya-api.service';
import os from "os";
import fs from "fs";
import { AwsConfig, AwsService } from './services/common/aws/aws.service';
import { AwsSqsComponent } from './services/common/aws/aws-sqs.component';
import { M2PNotificationService } from './services/partner/m2p/m2p-notification.service';
import { CardRepository, EventRepository, StatementRepository } from './repositories';
import { CommunicationService } from './services/common/communication/communication.service';
import { M2PCardService } from './services/partner/m2p/card/m2p-card.service';
import { CardStatementPayloadRepository } from './repositories/card-statement-payload.repository';
import { M2PCardApiService } from './services/partner/m2p/card/m2p-card-api.service';
import { M2PCardStatementService } from './services/partner/m2p/card/m2p-card-statement.service';
import { M2PEncryptDecryptService } from './services/partner/m2p/m2p-encrypt-decrypt.service';
import { ObjectHelper } from 'common-lib';

export const APP_ENV: string = process.env.environment ? process.env.environment : 'dev';
export const SECRET_MANAGER_REGION: string = 'us-east-2';
export const REQUIRED_SECRET_KEYS: any = {
  CMS_AWS_SECRET_KEY: 'CMS_AWS_SECRET_KEY',
  CMS_AWS_ACCESS_KEY: 'CMS_AWS_ACCESS_KEY',
  CMS_M2P_CARD_API_TENANT_ID: 'CMS_M2P_CARD_API_TENANT_ID',
  CMS_M2P_CARD_API_AUTHORIZATION: 'CMS_M2P_CARD_API_AUTHORIZATION',
  CMS_DATASOURCE_PASSWORD: 'CMS_DATASOURCE_PASSWORD'
};

export const APP_DOWNLOADS_DIRECTORY = os.tmpdir();

export { ApplicationConfig }
export class RootApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication))) {

  private config: AppConfig;
  constructor(options: ApplicationConfig = {}) {
    super(options);
    Logger.info('*', 'RootApplication', `Initializing RootApplication ('${APP_ENV}')`);
  }

  public async setup(): Promise<any> {

    // setting default options
    this.setDefaults();
    // initialize config objects
    await this.loadConfig();
    // await this.setConfigurations();
    // configuring components
    this.setComponents();
    // binding objects to scopes
    this.registerAppBindings();
    // set services
    this.setServices();
    // 
    this.initSecuritySpec();
    // custom sequence
    this.sequence(AppSequence);
    // custom request body parser
    // this.bodyParser(RequestJsonBodyParser); // TEMP
    // custom rest-api-explorer configuration
    this.configureRestApiExplorer();
    // configure authentication system
    this.setAuthentication();

    this.registerCommonBindings();
  }

  private setDefaults(): void {
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));
    // this.static('/downloads', path.join(APP_DOWNLOADS_DIRECTORY));

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      }
    };
    Logger.info('*', 'RootApplication', 'Setting defaults successfully');
  }

  private async loadConfig(): Promise<void> {
    let secretsObject: any = {};
    try {
      const secretsManagerClient: SecretsManagerClient = new SecretsManagerClient('us-east-2');
      const secretString: any = await secretsManagerClient.getSecret(`${APP_ENV}/unity-card`);
      secretsObject = JSON.parse(secretString);
    } catch (e: any) {
      Logger.critical('*', 'RootApplication.loadConfig',
        `Unable to fetch variables from secret manager '${APP_ENV}/unity-card'`, e);
      throw e;
    }

    AWS.config.update({     
      region: 'us-east-2'
    });

    try {
      const config: AppConfig = {
        DB_NAME: ObjectHelper.getValue(secretsObject, 'DB_NAME'),
        DB_CONNECTOR: ObjectHelper.getValue(secretsObject, 'DB_CONNECTOR'),
        DB_URL: ObjectHelper.getDefaultValue(secretsObject, 'DB_URL', ''),
        DB_HOST: ObjectHelper.getValue(secretsObject, 'DB_HOST'),
        DB_PORT: ObjectHelper.getValue(secretsObject, 'DB_PORT'),
        DB_USER: ObjectHelper.getValue(secretsObject, 'DB_USER'),
        DB_PASSWORD: ObjectHelper.getValue(secretsObject, 'DB_PASSWORD'),

        TOKEN_SECRET: ObjectHelper.getValue(secretsObject, 'TOKEN_SECRET'),
        AUTH_TOKEN_EXPIRES_IN: ObjectHelper.getValue(secretsObject, 'AUTH_TOKEN_EXPIRES_IN'),
        ACTION_TOKEN_EXPIRES_IN: ObjectHelper.getValue(secretsObject, 'ACTION_TOKEN_EXPIRES_IN'),
        OTP_TOKEN_EXPIRES_IN: ObjectHelper.getValue(secretsObject, 'OTP_TOKEN_EXPIRES_IN'),

        APP_TEMP_DIRECTORY: ObjectHelper.getValue(secretsObject, 'APP_TEMP_DIRECTORY'),
        APP_ROOT_BUCKET: ObjectHelper.getValue(secretsObject, 'APP_ROOT_BUCKET'),

        AWS_PROFILE: ObjectHelper.getValue(secretsObject, 'AWS_PROFILE'),
        AWS_REGION: ObjectHelper.getValue(secretsObject, 'AWS_REGION'),

        NOTIFICATION_QUEUE_URL: ObjectHelper.getValue(secretsObject, 'NOTIFICATION_QUEUE_URL'),
        COMMUNICATION_QUEUE_URL: ObjectHelper.getValue(secretsObject, 'COMMUNICATION_QUEUE_URL'),

        PARTNER_M2P_PUBLIC_KEY_PATH: ObjectHelper.getValue(secretsObject, 'PARTNER_M2P_PUBLIC_KEY_PATH'),
        PARTNER_M2P_PRIVATE_KEY_PATH: ObjectHelper.getValue(secretsObject, 'PARTNER_M2P_PRIVATE_KEY_PATH'),
        PARTNER_M2P_API_ENCRYPTED: ObjectHelper.getValue(secretsObject, 'PARTNER_M2P_API_ENCRYPTED'),
        PARTNER_M2P_CARD_API_URL: ObjectHelper.getValue(secretsObject, 'PARTNER_M2P_CARD_API_URL'),
        PARTNER_M2P_CARD_API_TIMEOUT: ObjectHelper.getValue(secretsObject, 'PARTNER_M2P_CARD_API_TIMEOUT'),
        PARTNER_M2P_CARD_API_RETRIES: ObjectHelper.getValue(secretsObject, 'PARTNER_M2P_CARD_API_RETRIES'),
        PARTNER_M2P_CARD_API_SET_PIN_ENCRYPTION_KEY: ObjectHelper.getValue(secretsObject, 'PARTNER_M2P_CARD_API_SET_PIN_ENCRYPTION_KEY'),
        PARTNER_M2P_CARD_API_TENANT_ID: ObjectHelper.getValue(secretsObject, 'PARTNER_M2P_CARD_API_TENANT_ID'),
        PARTNER_M2P_CARD_API_AUTHORIZATION: ObjectHelper.getValue(secretsObject, 'PARTNER_M2P_CARD_API_AUTHORIZATION'),

        KALERYA_URL: ObjectHelper.getValue(secretsObject, 'KALERYA_URL'),
        KALERYA_API_KEY: ObjectHelper.getValue(secretsObject, 'KALERYA_API_KEY'),
        KALERYA_SID: ObjectHelper.getValue(secretsObject, 'KALERYA_SID'),
        KALERYA_SENDER: ObjectHelper.getValue(secretsObject, 'KALERYA_SENDER'),
        KALERYA_CALLBACK_WEBHOOK: ObjectHelper.getDefaultValue(secretsObject, 'KALERYA_CALLBACK_WEBHOOK', '')
      };
      this.config = config;
      this.bind(Bindings.Config.APP_CONFIG).to(config);
      console.log(config)
    } catch (e: any) {
      Logger.critical('*', 'RootApplication', `Unable to config variables from ${APP_ENV}.env file`, e);
      throw e;
    }
    Logger.info('*', 'RootApplication', 'Loaded config variables from .env file');
  }

  private setServices(): void {

  }

  private registerCommonBindings(): void {
    // 
    const dbConfig: DataSourceConfig = {
      name: 'cms',
      connector: 'mysql',
      url: this.config.DB_URL,
      host: this.config.DB_HOST,
      port: '' + this.config.DB_PORT,
      user: this.config.DB_USER,
      password: this.config.DB_PASSWORD,
      database: this.config.DB_NAME
    };

    const kaleryaApiConfig: KaleryaApiConfig = {
      URL: this.config.KALERYA_URL,
      API_KEY: this.config.KALERYA_API_KEY,
      SID: this.config.KALERYA_SID,
      SENDER: this.config.KALERYA_SENDER,
      CALLBACK_WEBHOOK: this.config.KALERYA_CALLBACK_WEBHOOK,
    };

    const awsConfig: AwsConfig = {
      region: this.config.AWS_REGION,
      profile: this.config.AWS_PROFILE,
      notificationQueueUrl: this.config.NOTIFICATION_QUEUE_URL,
      communicationQueueUrl: this.config.COMMUNICATION_QUEUE_URL,
      maxNumberOfMessagesQueue: 10,
      waitTimeSecondsQueue: 20
    };

    // config bindings
    this.bind(CommonBindings.Config.CMS_DATASOURCE_CONFIG).to(dbConfig);
    this.bind(CommonBindings.Config.KALERYA_API_CONFIG).to(kaleryaApiConfig);
    this.bind(Bindings.Config.AWS_CONFIG).to(awsConfig);

    // variable bindings
    this.bind(CommonBindings.Variable.TOKEN_SECRET).to(this.config.TOKEN_SECRET);
    this.bind(CommonBindings.Variable.AUTH_TOKEN_EXPIRES_IN).to(this.config.AUTH_TOKEN_EXPIRES_IN);
    this.bind(CommonBindings.Variable.ACTION_TOKEN_EXPIRES_IN).to(this.config.ACTION_TOKEN_EXPIRES_IN);
    this.bind(CommonBindings.Variable.OTP_TOKEN_EXPIRES_IN).to(this.config.OTP_TOKEN_EXPIRES_IN);


    // DataSource from common-lib
    this.dataSource(CmsDataSource, 'cms');

    // Repositories from common-lib
    this.repository(OtpRepository);
    this.repository(UserLoginRepository);
    this.repository(UserPartnerRepository);
    this.repository(UserRepository);
    this.repository(EventRepository);
    this.repository(CardRepository);
    this.repository(StatementRepository);
    this.repository(CardStatementPayloadRepository);

    // Services from common-lib
    this.service(SmsService);
    this.service(OtpService);
    this.service(TokenService);
    this.service(DbService);

    this.service(M2PCardService);
    this.service(M2PCardApiService);
    this.service(M2PEncryptDecryptService);
    this.service(M2PCardStatementService);

    this.service(AwsService);
    this.service(M2PNotificationService);
    this.service(CommunicationService);

    this.component(AwsSqsComponent)
  }

  private registerAppBindings(): void {

  }

  private setComponents(): void {

  }

  private initSecuritySpec(): void {
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'Unity Card - Api Services',
        version: '1.0.0',
      },
      paths: {},
      components: { securitySchemes: SECURITY_SCHEME_SPEC },
      security: [{
        // secure all endpoints with 'jwt'
        jwt: [],
      }],
      servers: [{ url: '/' }],
    });
  }

  private configureRestApiExplorer(): void {
    // if (APP_ENV !== 'dev') return;
    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer'
    });
    this.component(RestExplorerComponent);
  }

  private setAuthentication(): void {
    // Mount authentication system
    this.bind(Bindings.Service.USER_SERVICE).toClass(UserService);
    this.bind(Bindings.Service.JWT_SERVICE).toClass(JWTService);

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);
  }
}
