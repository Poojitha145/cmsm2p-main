import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
import { CommonBindings } from '../../model';
import { DataSourceConfig } from './datasource.model';

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class CmsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'cms';

  constructor(@inject(CommonBindings.Config.CMS_DATASOURCE_CONFIG)
  config: DataSourceConfig) {
    super(config);
  }
}

