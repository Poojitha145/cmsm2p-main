import { BindingScope, inject, injectable } from "@loopback/core";
import { M2PNotificationEvent } from "./card/event/card-notification-event";
import { repository } from "@loopback/repository";
import { EventRepository } from "../../../repositories/event.repository";
import { EventEntity } from "../../../models/entity/event.entity";
import { ErrorCode, Logger, MessageTemplates, RandomUtil, ServiceError, SmsRequest, SqsMessage, UserEntity, UserPartnerEntity, UserPartnerRepository, UserRepository, isNotNullAndNotUndefined, isNullOrUndefined } from "common-lib";
import { M2PCardEventType } from "./card/event/card-event-type";
import { M2PCardEvent, M2PStatementEvent } from "./card/event/card.event";
import { M2PCardEventFinder, M2PCardEventFinders, M2PCardTransactionEventFinder } from "./card/event/m2p-card-event-finder";
import { } from "common-lib";
import { Bindings } from "../../../models/bindings";
import { AwsService } from "../../common/aws/aws.service";
import { M2PCardService } from "./card/m2p-card.service";
import moment from "moment";
import { M2PCardStatementService } from "./card/m2p-card-statement.service";
import { CardSessionPayload } from "../../../models/config.model";

export interface NotificationEvent {
  eventId: string;
  payload: any;
}

@injectable({ scope: BindingScope.SINGLETON, tags: Bindings.Service.M2P_NOTIFICATION_SERVICE })
export class M2PNotificationService {

  private readonly m2pCardTransactionEventFinder: M2PCardTransactionEventFinder = new M2PCardTransactionEventFinder();

  constructor(
    @inject(Bindings.Service.AWS_SERVICE)
    private awsService: AwsService,
    @inject(Bindings.Service.M2P_CARD_STATEMENT_SERVICE)
    private m2pCardStatementService: M2PCardStatementService,
    @repository(UserRepository)
    private userRepository: UserRepository,
    @repository(UserPartnerRepository)
    private userPartnerRepository: UserPartnerRepository,
    @repository(EventRepository)
    private eventRepository: EventRepository) {

  }

  async handleEvent(eventId: string, event: any): Promise<void> {
    Logger.debug(eventId, 'NotificationEvent.handleEvent', 'event received', event);

    if (event) {
      try {
        if (!event.entityId) {
          throw new ServiceError(new ErrorCode('N10001', `entityId not found in event payload`));
        }

        //  Save to DB
        const userPartnerEntity: UserPartnerEntity | null = await this.userPartnerRepository
          .getPartnerEntityByCifNoAndPartnerId(event.entityId, 'm2p');
        if (userPartnerEntity) {
          const eventEntity: EventEntity = await this.eventRepository
            .createEvent(eventId, userPartnerEntity.userLocalId, userPartnerEntity.userPartnerId, event);
          Logger.debug(eventId, 'NotificationEvent.handleEvent', 'event saved to db');
        } else {
          throw new ServiceError(new ErrorCode('N10001', `user not found for given m2p entityId: ${event.entityId}`));
        }

        const userEntity: UserEntity | null = await this.userRepository
          .getActiveUserEntityById(userPartnerEntity.userLocalId);
        if (!userEntity || !userEntity.mobileNumber) {
          Logger.error(eventId, 'NotificationEvent.handleEvent', 'user communication details are not found.');
          throw new ServiceError(new ErrorCode('N10001', `not a active user or communication details are not found.`));
        }

        const mobileNumber: string = userEntity.mobileNumber;
        const email: string = userEntity.email ? userEntity.email : '';


        const m2pNotificationEvent: M2PNotificationEvent = <M2PNotificationEvent>event;
        m2pNotificationEvent.eventId = eventId;

        // = Object.assign(new M2PCardEventNotification(), json);
        Logger.debug(eventId, 'NotificationEvent.handleEvent', 'event payload', event);

        this.validateEvent(m2pNotificationEvent);
        this.normalizeEvent(m2pNotificationEvent);


        this.processIfTransactionEvent(m2pNotificationEvent, mobileNumber);

        const eventFinder: M2PCardEventFinder<M2PNotificationEvent> | null
          = M2PCardEventFinders.findEvent(m2pNotificationEvent);
        if (eventFinder !== null) {
          Logger.info(eventId, 'NotificationEvent.handleEvent', `found event type - ${eventFinder.eventType}`);

          const m2pCardEvent: M2PCardEvent
            = this.getCardEvent(eventFinder.eventType, m2pNotificationEvent);
          if (userPartnerEntity) {
            m2pCardEvent.userLocalId = userPartnerEntity.userLocalId;
            m2pCardEvent.userPartnerId = userPartnerEntity.userPartnerId;
          }
          Logger.info(eventId, 'NotificationEvent.handleEvent', 'card event', m2pCardEvent);

          const cardSessionPayload: CardSessionPayload = {
            requestId: eventId,
            userLocalId: userEntity.userLocalId,
            partnerId: userPartnerEntity.partnerId,
            userPartnerId: userPartnerEntity.userPartnerId,
            partnerCifNo: userPartnerEntity.partnerCifNo
          }

          await this.processStatementEvent(m2pCardEvent, cardSessionPayload, mobileNumber);
          // this.processCardEvent(eventFinder.eventType, m2pCardEvent);
        } else {
          Logger.warn(eventId, 'NotificationEvent.handleEvent', 'card event not found. Ignoring...');
        }
      } catch (e: any) {
        Logger.error(eventId, 'NotificationEvent.handleEvent', 'while processing event', e);
      }
    } else {
      Logger.error('E00000', 'NotificationEvent.handleEvent', 'invalid notification event', event);
    }
  }

  private validateEvent(m2pNotificationEvent: M2PNotificationEvent): void {
    if (isNullOrUndefined(m2pNotificationEvent.entityId)) {
      // Logger.error()
      throw new Error('EntityId should not be null or undefined');
    }
  }

  private normalizeEvent(m2pNotificationEvent: M2PNotificationEvent): void {
    if (!isNullOrUndefined(m2pNotificationEvent.merchantId)) {
      m2pNotificationEvent.merchantId = m2pNotificationEvent.merchantId.trim();
    }
    if (!isNullOrUndefined(m2pNotificationEvent.mcc)) {
      m2pNotificationEvent.mcc = m2pNotificationEvent.mcc.trim();
    }
  }

  private processIfTransactionEvent(m2pCardEventNotification: M2PNotificationEvent, mobileNumber: string): void {
    if (this.m2pCardTransactionEventFinder.find(m2pCardEventNotification)) {
      // TODO -  
      try {
        // this.m2pCardStatementService.m2pCardService.get
      } catch (e: any) {

      }

      let messageTemplate: string = MessageTemplates.Sms.TRANSACTION.getMessage({
        amount: m2pCardEventNotification.amount + '',
        merchant: m2pCardEventNotification.merchantName
      });

      let smsRequest: SmsRequest = {
        id: m2pCardEventNotification.eventId,
        to: mobileNumber,
        type: 'TXN',
        templateId: MessageTemplates.Sms.TRANSACTION.templateId,
        body: messageTemplate
      }

      let message: string = JSON.stringify({ channel: 'SMS', request: smsRequest });
      this.awsService.communicationQueue.publish(m2pCardEventNotification.eventId, message)

      // console.debug(`Event(${m2pCardEventNotification.eventId}) - Successfully published to card statement event topic`);
    } else {
      // console.info("Not a card txn event, not dispatching event, ignore: {}", m2pCardEventNotification.transactionType);
    }
  }

  private async processStatementEvent(m2pCardEvent: M2PCardEvent, cardSessionPayload: CardSessionPayload, mobileNumber: string): Promise<void> {
    if (M2PCardEventType.STATEMENT === m2pCardEvent.eventType) {
      const statementDate: moment.Moment = moment(m2pCardEvent.statementDate, 'DD-MM-YYYY');
      const m2pStatementEvent: M2PStatementEvent = {
        entityId: m2pCardEvent.entityId,
        userLocalId: m2pCardEvent.userLocalId,
        userPartnerId: m2pCardEvent.userPartnerId,
        statementDate: m2pCardEvent.statementDate,
        statementMonth: statementDate.format('MM'),
        statementMonthYear: statementDate.format('MMYYYY'),
        statementMonthName: statementDate.format('MMMM'),
        dueDate: m2pCardEvent.statementDueDate,
        communicationChannels: []
      };

      await this.m2pCardStatementService.generateStatementPdf(cardSessionPayload, m2pStatementEvent.statementMonthYear);

      let messageTemplate: string = MessageTemplates.Sms.STATEMENT.getMessage({
        month: m2pStatementEvent.statementMonthName,
        dueDate: m2pStatementEvent.dueDate
      });

      let smsRequest: SmsRequest = {
        id: m2pCardEvent.eventId,
        to: mobileNumber,
        type: 'TXN',
        templateId: MessageTemplates.Sms.STATEMENT.templateId,
        body: messageTemplate
      }

      let message: string = JSON.stringify({ channel: 'SMS', request: smsRequest });
      this.awsService.communicationQueue.publish(m2pCardEvent.eventId, message)
    }
  }

  private getCardEvent(m2pCardEventType: M2PCardEventType,
    m2pCardEventNotification: M2PNotificationEvent): M2PCardEvent {

    const localEntityId: string = m2pCardEventNotification.entityId; // TODO - get loacal id

    const mid: string = m2pCardEventNotification.merchantId;
    const merchantName: string = m2pCardEventNotification.merchantName;
    const mcc: string = m2pCardEventNotification.mcc;

    const txnAmount: any = isNullOrUndefined(m2pCardEventNotification.txnAmt)
      ? null : Number(m2pCardEventNotification.txnAmt);
    const txnAmountString: any = isNullOrUndefined(txnAmount) ? null : txnAmount + ' #';  // TODO
    const txnDate: number = isNullOrUndefined(m2pCardEventNotification.txnDate)
      ? new Date().getTime() : Number(m2pCardEventNotification.txnDate);
    // let statementMonth: string = m2pCardEventNotification.statementDate;

    // if (isNullOrUndefined(m2pCardEventNotification.statementDate)) {
    //   const now: Date = new Date();
    //   statementMonth = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    // } else {
    //   const dateParts: string[] = statementMonth.split('-');
    //   if (dateParts.length === 3) {
    //     statementMonth = dateParts[1] + dateParts[2];
    //   } else {
    //     console.warn('Statement date is not as excepted format ', m2pCardEventNotification.statementDate);
    //     const now: Date = new Date();
    //     statementMonth = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    //   }
    // }

    // if (M2PCardNotificationSqsConsumer.CARD_TRANSACTION_SUCCESS_EVENT_TYPES.includes(m2pCardEventType)) {
    //   // TODO Update merchant details
    // }

    /**
     * Added null check here as there are non txn events which will fall here like statement generation which has
     * merchantName null which is breaking merchantInfoWithNormalizedName which has non-null name field.
     */
    if (isNotNullAndNotUndefined(mid) && isNotNullAndNotUndefined(merchantName)) {
      // TODO normalize merchant details
    } else {
      // TODO cleanup merchant details
    }

    const m2pCardEvent: M2PCardEvent = {
      eventId: m2pCardEventNotification.eventId,
      eventType: m2pCardEventType,
      entityId: m2pCardEventNotification.entityId,
      userLocalId: '',
      userPartnerId: '',

      cardId: '',
      cardEnding: m2pCardEventNotification.cardEnding,
      cardHolderName: m2pCardEventNotification.cardEnding,

      merchantId: mid,
      mcc: mcc,
      merchantName: merchantName,

      txnRefNo: m2pCardEventNotification.txnRefNo,
      crDr: m2pCardEventNotification.crdr,
      txnType: m2pCardEventNotification.transactionType,
      txnAmount: txnAmount,
      txnAmountString: txnAmountString,
      txnDate: txnDate,

      statementDate: m2pCardEventNotification.statementDate,
      statementDueDate: m2pCardEventNotification.dueDate,
      statementMonth: '',//statementMonth
    };

    return m2pCardEvent;
  }
}