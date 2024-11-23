import { Communication } from "common-lib";
import { M2PCardEventType } from "./card-event-type";

export interface M2PCardEvent {
    eventId: string; // message id from queue (custom)
    eventType: M2PCardEventType;

    entityId: string;
    userLocalId: string;
    userPartnerId: string;

    cardId: string;
    cardEnding: string;
    cardHolderName: string;

    merchantId: string;
    mcc: string;
    merchantName: string;

    txnRefNo: string;
    crDr: string;
    txnType: string;
    txnAmount: number;
    txnAmountString: string;
    txnDate: number;

    statementDate: string;
    statementDueDate: string;
    statementMonth: string;
}

export interface M2PStatementEvent {
    entityId: string;
    userLocalId: string;
    userPartnerId: string;
    statementDate: string; // dd-mm-YYYY
    dueDate: string;   // dd-MM-yyyy
    statementMonth: string; //MMYYYY
    statementMonthYear: string; //MMYYYY
    statementMonthName: string;
    communicationChannels: Communication.ChannelType[];
}