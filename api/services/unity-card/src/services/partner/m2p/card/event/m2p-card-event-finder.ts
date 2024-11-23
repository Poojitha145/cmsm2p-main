import { M2PCardEventType } from "./card-event-type";
import { M2PNotificationEvent } from "./card-notification-event";
import { M2PCardTransaction, M2PTransactionType } from "./card-transaction-event-types";

export interface M2PCardEventFinder<I> {
    eventType: M2PCardEventType;
    find(i: I): boolean;
}

export class M2PCardTransactionEventFinder implements M2PCardEventFinder<M2PNotificationEvent> {

    private static readonly allowedTransactionTypes: ReadonlyArray<string> = Object.values(M2PTransactionType);

    public readonly eventType: M2PCardEventType;

    public find(m2pEvent: M2PNotificationEvent): boolean {
        return M2PCardTransactionEventFinder.allowedTransactionTypes.includes(m2pEvent.transactionType)
            && (M2PCardTransaction.Status.PAYMENT_SUCCESS === m2pEvent.txnStatus);
    }
}

export class M2PCardTransactionApprovedEventFinder implements M2PCardEventFinder<M2PNotificationEvent> {

    private static readonly allowedTransactionTypes: ReadonlyArray<string> = [
        M2PCardTransaction.Type.ATM,
        M2PCardTransaction.Type.POS,
        M2PCardTransaction.Type.CASH_AT_POS,
        M2PCardTransaction.Type.ECOM
    ];

    public readonly eventType: M2PCardEventType = M2PCardEventType.TXN_APPROVED;

    public find(m2pEvent: M2PNotificationEvent): boolean {
        return M2PCardTransactionApprovedEventFinder.allowedTransactionTypes.includes(m2pEvent.transactionType)
            && (M2PCardTransaction.Status.PAYMENT_SUCCESS === m2pEvent.txnStatus);
    }
}

export class M2PCardStatementEventFinder implements M2PCardEventFinder<M2PNotificationEvent> {

    public readonly eventType: M2PCardEventType = M2PCardEventType.STATEMENT;

    public find(m2pEvent: M2PNotificationEvent): boolean {
        return (M2PCardTransaction.Type.STATEMENT_GENERATED === m2pEvent.transactionType);
    }
}

export class M2PCardEventFinders {

    private static readonly m2pCardEventFinders: Array<M2PCardEventFinder<M2PNotificationEvent>> = [
        new M2PCardTransactionApprovedEventFinder(),
        new M2PCardStatementEventFinder()
    ];

    public static findEventType(m2pEvent: M2PNotificationEvent): M2PCardEventType | null {
        let eventFinder: M2PCardEventFinder<M2PNotificationEvent> | null = this.findEvent(m2pEvent);
        if (eventFinder)
            return eventFinder.eventType;
        return null;
    }

    public static findEvent(m2pEvent: M2PNotificationEvent): M2PCardEventFinder<M2PNotificationEvent> | null {
        let eventFinder: M2PCardEventFinder<M2PNotificationEvent> | undefined
            = M2PCardEventFinders.m2pCardEventFinders.find((item: M2PCardEventFinder<M2PNotificationEvent>) => item.find(m2pEvent));
        if (eventFinder)
            return eventFinder;
        return null;
    }
}