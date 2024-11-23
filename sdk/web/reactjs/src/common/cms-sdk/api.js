export const BaseURL = 'https://dev-cms.saven.in'

export const Endpoints = {
    Authentication: '/user/verify/mpin',
    ResetMpin: '/card/reset/mpin',
    GetBalance: '/card/get/balance',
    GetCardList: '/card/get/list',
    GetCardDetails: '/card/get/details',
    GetCvv: '/card/get/cvv',
    SetLimit: '/card/set/limit',
    GetLimit: '/card/get/limit',
    UpgradeLimit: '/card/upgrade/limit',
    GetPreference: '/card/get/preference',
    SetPreference: '/card/set/preference',
    GetStatement: '/card/get/statement',
    GetUnbilledTransactions: '/card/get/unbilled/transactions',
    GetDue: '/card/get/due',
    UpdateStatement: '/card/update/statement/date',
    SetPin: '/card/set/pin',
    GetBillingDates: '/card/get/billing_dates',
    LockCard: '/card/lock',
    UnlockCard: '/card/unlock',
    Replace: '/card/replace',
    GetTransactionStatus: '/card/get/transaction/status',
    RequestPhysicalCard: '/request/physical/card',
    BlockCard: '/card/block',
    CloseCard: '/card/close',
    EmiEligibleTransactions: '/loan/eligible/emi/transactions',
    EmiEligibleList: '/loan/get/list',
    EmiPreview: '/loan/preview'
}