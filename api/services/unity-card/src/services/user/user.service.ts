import { inject, service } from '@loopback/core';
import { securityId, UserProfile } from '@loopback/security';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import {
  CreateMPinRequest, ResetMPinRequest,
  UserCreateRequest, VerifyMPinRequest
} from '../../controllers/user/user.request';
import {
  AuthTokenPayload, CommonBindings, ErrorCode, ObjectUtil, RandomUtil,
  ServiceError, TokenPayload, TokenType, UserEntity,
  UserLoginEntity, UserLoginEntityStatus, UserLoginRepository,
  UserPartnerEntity, UserPartnerRepository, UserRepository, OtpService,
  ServiceErrorCodes
} from 'common-lib';
import { M2PCardService } from '../partner/m2p/card/m2p-card.service';
import { isEmpty } from 'underscore';
import { CardModel } from '../../models/model/api.model';

export class UserService {

  constructor(
    @inject(CommonBindings.Service.OTP_SERVICE)
    private otpService: OtpService,
    @service(M2PCardService)
    private cardService: M2PCardService,
    @repository(UserRepository)
    private readonly userRepository: UserRepository,
    @repository(UserPartnerRepository)
    private readonly userPartnerRepository: UserPartnerRepository,
    @repository(UserLoginRepository)
    private readonly userLoginRepository: UserLoginRepository) { }

  async createUser(request: UserCreateRequest): Promise<any> {
    let userEntity: UserEntity = await this.userRepository.createUserEntity(request.mobileNumber,
      request.displayName, request.email, request.dob);
    return { userLocalId: userEntity.userLocalId };
  }

  async createUserLogin(request: UserCreateRequest): Promise<any> {
    let userEntity: UserEntity = await this.userRepository.createUserEntity(request.mobileNumber,
      request.displayName, request.email, request.dob);
    return { userLocalId: userEntity.userLocalId };
  }

  async createMpin(request: CreateMPinRequest): Promise<any> {
    let userEntity: UserEntity | null =
      await this.userRepository.getActiveUserEntity(request.mobileNumber);
    if (!userEntity) {
      throw new ServiceError(ServiceErrorCodes.MOBILE_NUMBER_NOT_REGISTERED);
    }

    let userPartnerEntity: UserPartnerEntity | null =
      await this.userPartnerRepository.getActiveUserPartnerEntity(userEntity.userLocalId, 'm2p');
    if (!userPartnerEntity) {
      throw new HttpErrors.Unauthorized('user not registered to this partner');
    }

    let userLoginEntity: UserLoginEntity | null =
      await this.userLoginRepository.getActiveUserLoginEntity(
        userEntity.userLocalId, userPartnerEntity.userPartnerId);
    if (!userLoginEntity) {
      userLoginEntity = new UserLoginEntity();
      userLoginEntity.userLocalId = userEntity.userLocalId;
      userLoginEntity.userPartnerId = userPartnerEntity.userPartnerId;
    }

    userLoginEntity.loginPin = request.pin;
    await this.userLoginRepository.update(userLoginEntity);
  }

  async verifyMPin(request: VerifyMPinRequest): Promise<TokenPayload> {
    let userEntity: UserEntity | null =
      await this.userRepository.getActiveUserEntity(request.mobileNumber);
    if (!userEntity) {
      throw new ServiceError(ServiceErrorCodes.MOBILE_NUMBER_NOT_REGISTERED);
      // throw new HttpErrors.Unauthorized('user not found');
    }

    let userPartnerEntity: UserPartnerEntity | null =
      await this.userPartnerRepository.getActiveUserPartnerEntity(userEntity.userLocalId, 'm2p');
    if (!userPartnerEntity) {
      throw new HttpErrors.Unauthorized('user not registered to this partner');
    }

    let userLoginEntity: UserLoginEntity | null =
      await this.userLoginRepository.getActiveUserLoginEntity(
        userEntity.userLocalId, userPartnerEntity.userPartnerId);
    if (!userLoginEntity) {
      throw new HttpErrors.Unauthorized('user not registered to login');
    }
    // TODO - verify expiration and other conditions
    if (request.pin === userLoginEntity.loginPin) {
      const authTokenPayload: AuthTokenPayload = {
        tokenId: RandomUtil.uuid(),
        tokenType: TokenType.Auth,
        authTokenId: RandomUtil.uuid(),
        userLoginId: userLoginEntity.userLoginId,
        deviceId: '',
        user: {
          userLocalId: userEntity.userLocalId,
          displayName: ObjectUtil.getValue(userEntity, 'displayName', ''),
          mobileNumber: userEntity.mobileNumber,
          email: userEntity.email,
          dob: userEntity.dob
        },
        partner: {
          partnerId: userPartnerEntity.partnerId,
          userPartnerId: userLoginEntity.userPartnerId,
          partnerCifNo: userPartnerEntity.partnerCifNo,
        }
      }
      return authTokenPayload;
    }
    throw new HttpErrors.Unauthorized('invalid credentials');
  }

  async resetMPin(requestId: string, request: ResetMPinRequest): Promise<any> {
    let userPartnerEntity: UserPartnerEntity | null =
      await this.userPartnerRepository.getActiveUserPartnerEntity(request.localId, request.partner);
    if (!userPartnerEntity) {
      throw new HttpErrors.Unauthorized('user not registered to this partner');
    }

    const recentUserLoginEntities: UserLoginEntity[] = await this.userLoginRepository.getRecent3Entities(
      userPartnerEntity.userLocalId, userPartnerEntity.userPartnerId);
    if (recentUserLoginEntities && recentUserLoginEntities.length > 0) {
      // Check if the new pin matches any of the recent 3 pins
      const recentLoginPins: any[] = recentUserLoginEntities.map((userLoginEntity: UserLoginEntity) => {
        return userLoginEntity.loginPin;
      });

      if (recentLoginPins.includes(request.pin)) {
        throw new ServiceError(new ErrorCode('2454', 'New Mpin cannot be the same as any of the last 3 pins'));
      }

      const cardDetails: { card: CardModel, customer: any } = await this.cardService
        .getDetails(requestId, userPartnerEntity.partnerCifNo);

      if (isEmpty(cardDetails)) {
        throw new ServiceError(new ErrorCode('2454', 'card details not found'));
      }

      if (request.partialCardNo !== cardDetails.card.partialCardNo) {
        throw new ServiceError(new ErrorCode('2454', 'card number not matched'));
      }
      if (request.expiryDate !== cardDetails.card.expiryDate) {
        throw new ServiceError(new ErrorCode('2454', 'card expiry date not matched'));
      }
    }

    await this.otpService.verifyOtp(requestId, request.otpId, request.otp);

    await this.userLoginRepository.inActiveUserLogin(recentUserLoginEntities[0].userLoginId);

    await this.userLoginRepository.createMPin(userPartnerEntity.userLocalId,
      userPartnerEntity.userPartnerId, request.pin);
    return true;
  }

  async verifyLoginPin(requestId: string, loginPin: string,
    userLoginId: string): Promise<any> {
    let userLoginEntity: UserLoginEntity | null =
      await this.userLoginRepository.getUserLoginEntityById(userLoginId);
    if (!userLoginEntity || userLoginEntity.status !== UserLoginEntityStatus.ACTIVE) {
      throw new HttpErrors.Unauthorized('not a registered user to login');
    }
    if (loginPin === userLoginEntity.loginPin) {
      return true;
    }
    throw new HttpErrors.Unauthorized('incorrect pin');
  }

  convertToUserProfile(tokenPayload: TokenPayload): UserProfile {
    return {
      [securityId]: tokenPayload.userLoginId,
      data: tokenPayload
    };
  }
}