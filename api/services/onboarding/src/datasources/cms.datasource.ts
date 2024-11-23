import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
import { ConfigBindings } from '../services/core/binding-keys';
import { AppConfig } from '../models/config/app.config';


// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class CmsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
    
  static dataSourceName = 'cms';

  constructor(
    @inject(ConfigBindings.AppConfig)
    private appConfig: AppConfig
  ) {
    super(appConfig.cmsDataSourceConfig);
  }
}
// class Mysql2Connector {
//   private pool: mysql.Pool;

//   constructor(config: any) {
//     this.pool = mysql.createPool({
//       host: config['host'],
//       port: config['port'],
//       user: config['user'],
//       password: config['password'],
//       database: config['database'],
//       connectionLimit: config['connectionLimit'] || 10,
//     });
//   }

//   // Override the connect method to use pool.getConnection
//   connect() {
//     return this.pool.promise();
//   }
// }
