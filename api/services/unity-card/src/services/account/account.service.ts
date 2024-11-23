import { BindingScope, inject, injectable } from "@loopback/core";
import { Bindings } from "../../models/bindings";
import { Transaction, repository } from "@loopback/repository";
import {
    CmsDataSource,
    ErrorCode, Logger, ServiceError, UserEntity, UserLoginEntity,
    UserLoginRepository, UserPartnerEntity, UserPartnerRepository, UserRepository
} from "common-lib";
import { TempAccountRegisterRequest } from "../../controllers/account/account.request";

@injectable({ scope: BindingScope.SINGLETON, tags: Bindings.Service.ACCOUNT_SERVICE })
export class AccountService {

    constructor(
        @inject('datasources.cms')
        private cmsDataSource: CmsDataSource,
        @repository(UserRepository)
        private readonly userRepository: UserRepository,
        @repository(UserPartnerRepository)
        private readonly userPartnerRepository: UserPartnerRepository,
        @repository(UserLoginRepository)
        private readonly userLoginRepository: UserLoginRepository) {

    }

    async getLoginDetails(requestId: string, mobileNumber: string, partner: string): Promise<any> {
        Logger.info(requestId, 'AccountService.getLoginDetails', 'getting login details');
        const userEntity: UserEntity | null = await this.userRepository.findOne({
            where: {
                and: [
                    { mobileNumber: { eq: mobileNumber } }
                ]
            },
            order: ['createdAt DESC']
        });

        if (!userEntity) {
            throw new ServiceError(new ErrorCode('E0000', 'mobile number is not registred.'));
        }

        const userPartnerEntity: UserPartnerEntity | null = await this.userPartnerRepository
            .findOne({
                where: {
                    and: [
                        { userLocalId: { eq: userEntity.userLocalId } },
                        { partnerId: { eq: partner } }
                    ]
                },
                order: ['createdAt DESC']
            });

        if (!userPartnerEntity) {
            throw new ServiceError(new ErrorCode('E0000', 'user not registred with this partner'));
        }

        const userLoginEntity: UserLoginEntity | null = await this.userLoginRepository.findOne({
            where: {
                and: [
                    { userLocalId: { eq: userEntity.userLocalId } },
                    { userPartnerId: { eq: userPartnerEntity?.userPartnerId } }
                ]
            },
            order: ['createdAt DESC']
        });

        if (!userLoginEntity) {
            throw new ServiceError(new ErrorCode('E0000', 'user not registred for login'));
        }

        return {
            loginId: userLoginEntity.userLoginId
        }
    }

    async tempRegisterAccount(requestId: string, request: TempAccountRegisterRequest): Promise<any> {
        Logger.info(requestId, 'AccountService.tempRegisterAccount', 'registering account', request);

        const transaction: Transaction = await this.userRepository.beginTransaction();
        try {
            const userEntity: UserEntity = await this.userRepository.createUserEntity(
                request.mobileNumber, request.displayName, request.email, request.dob, transaction);
            Logger.info(requestId, 'AccountService.tempRegisterAccount', 'created user entity');

            const userPartnerEntity: UserPartnerEntity = await this.userPartnerRepository
                .createUserPartnerEntity(userEntity.userLocalId, 'm2p', request.entityId, transaction);
            Logger.info(requestId, 'AccountService.tempRegisterAccount', 'created partner entity');

            const userLoginEntity: UserLoginEntity = await this.userLoginRepository
                .createUserLoginEntity(userEntity.userLocalId, userPartnerEntity.userPartnerId, request.mpin, transaction);
            Logger.info(requestId, 'AccountService.tempRegisterAccount', 'created login entity');

            transaction.commit();

            return {
                message: 'account registered successfully',
                loginId: userLoginEntity.userLoginId
            }
        } catch (e: any) {
            transaction.rollback();
            throw e;
        }
    }
}