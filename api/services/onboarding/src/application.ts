import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import fs from 'fs-extra';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { AppSequence } from './sequence';
import { FinableWorkflowService } from './services/workflow/loan-workflow/finable-workflow.service';
import { OnboardingService } from './services/app/onboarding.service';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
// import { Config } from './services/core/constant/common.constant';
import { AppConfig } from './models/config/app.config';
import { ConfigBindings, ServiceBindings } from './services/core/binding-keys';
import { Config } from './services/core/constant/config.constants';

export { ApplicationConfig };

export class OnboardingApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication))) {

  private appConfig: AppConfig;

  constructor(options: ApplicationConfig = {}) {
    super(options);
  }

  public async initApp(): Promise<void> {
    // loading application specific configurations
    await this.setConfigurations();
    // initializing app components
    this.initComponents();
    // 
    this.initServices();

    this.initSecuritySpec();

    // Set up the custom sequence
    this.sequence(AppSequence);
    // this.bodyParser(RequestJsonBodyParser);

    this.setupDefaults();

    this.setupRestExplorer();
  }

  private async setConfigurations(): Promise<any> {
    console.log(`Setting configuraions`);
    let secretKeys: any = await this.getSecretKeys(Config.AppEnv + '_cms_secret_keys');
    let missedSecretKeys: string[] = [];

    for (let key of Object.values(Config.SecretKey)) {
      if (!secretKeys.hasOwnProperty(key)) {
        missedSecretKeys.push(<string>key);
      }
    };

    if (missedSecretKeys.length > 0) {
      throw new Error(`Secret keys ['${missedSecretKeys}'] are not found`);
    }

    let file: string = `./src/resources/${Config.AppEnv}/app-config.json`;
    console.log(`Reading ${file}`);
    try {
      let appConfigJson: any = await fs.readJson(file, { throws: false });

      // setting all the properties reads from secret manager to avoid re structuring config files.

      appConfigJson.cmsDataSourceConfig.password = secretKeys[Config.SecretKey.CMS_DATASOURCE_PASSWORD];
      appConfigJson.fbConfig.clientId = secretKeys[Config.SecretKey.FB_CLIENT_ID];
      appConfigJson.fbConfig.clientSecret = secretKeys[Config.SecretKey.FB_CLIENT_SECRET];

      // TODO - should validate the config    
      this.appConfig = new AppConfig(appConfigJson);
    } catch (e: any) {
      console.error(`unable to read config file ${file}`)
      throw e;
    }
    console.log(JSON.stringify(this.appConfig))
    this.bind(ConfigBindings.AppConfig).to(this.appConfig);
    this.bind(ConfigBindings.FederalBankConfig).to(this.appConfig.fBConfig);
  }

  private setupDefaults(): void {
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  private setupRestExplorer(): void {
    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer'
    });
    this.component(RestExplorerComponent);
  }

  private initComponents(): void {

  }

  private initServices(): void {
    this.service(OnboardingService, ServiceBindings.OnboardingService);
    this.service(FinableWorkflowService, ServiceBindings.FinableWorkflowService);
  }

  private initSecuritySpec(): void {
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'test application',
        version: '1.0.0',
      },
      paths: {},
      // components: { securitySchemes: SECURITY_SCHEME_SPEC },
      security: [
        {
          // secure all endpoints with 'jwt'
          jwt: [],
        },
      ],
      servers: [{ url: '/' }],
    });
  }

  private async getSecretKeys(secretId: string): Promise<any> {
    console.log(`loading secret keys from secret manager with secret_id: ${secretId}`);
    try {
      const client = new SecretsManagerClient({
        region: Config.SecretManager.Region,
      });
      let data: any = await client.send(
        new GetSecretValueCommand({
          SecretId: secretId,
          VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        })
      );
      console.log(`successfully loaded secret keys from secret manager`);
      return JSON.parse(data.SecretString);
    } catch (e: any) {
      console.error('error while reading secret key', e);
      throw e;
    }
  }
}
