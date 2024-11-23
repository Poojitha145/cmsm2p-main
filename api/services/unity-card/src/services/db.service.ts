import { juggler } from '@loopback/repository';
import { BindingScope, inject, injectable } from '@loopback/core';
import { Bindings } from '../models/bindings';
import { DbErrorCodes, ServiceError, ServiceErrorCodes } from 'common-lib';

@injectable({ scope: BindingScope.SINGLETON, tags: Bindings.Service.DB_SERVICE })
export class DbService {

    constructor(
        @inject('datasources.cms')
        private dataSource: juggler.DataSource) { }

    async getMobileNumberByLoginId(userLoginId: string): Promise<any> {
        try {
            const result: any[] = await this.dataSource.execute('SELECT mobile_number FROM user u, user_login ul WHERE ul.user_login_id = \''
                + userLoginId + '\' AND ul.user_local_id = u.user_local_id');

            if (result && result.length > 0) {
                return result[0].mobile_number;
            }            
        } catch (e: any) {
            throw new ServiceError(DbErrorCodes.DB_ERROR, e);
        }
        throw new ServiceError(ServiceErrorCodes.INVALID_USER_LOGIN_ID);
    }

    async getMobileNumberByLocalId(userLocalId: string): Promise<any> {
        try {
            const result: any[] = await this.dataSource.execute('SELECT mobile_number FROM user u WHERE u.user_local_id = \''
                + userLocalId + '\'');
                
            if (result && result.length > 0) {
                return result[0].mobile_number;
            }            
        } catch (e: any) {
            throw new ServiceError(DbErrorCodes.DB_ERROR, e);
        }
        throw new ServiceError(ServiceErrorCodes.INVALID_USER_LOGIN_ID);
    }
}