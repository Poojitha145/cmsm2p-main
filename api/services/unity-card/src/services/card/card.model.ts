import { ErrorCode } from "common-lib";

export const CardErrorCode = {
    CARD_NOT_FOUND: new ErrorCode('CD100', 'Card not found.'),
    BALANC_NOT_FOUND: new ErrorCode('CC101', 'Balance not found.')
}
