/**
 * Config object for DataSource
 */
export interface DataSourceConfig {
  name: string;
  connector: string;
  url: string;
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
}