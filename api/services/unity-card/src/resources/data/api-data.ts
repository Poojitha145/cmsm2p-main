export const ApiMockData: any = {
    '/card/get/balance': [
        {
            "productId": "GENERAL",
            "balance": "987729.0",
            "lienBalance": "2392.0"
        }
    ],
    '/card/get/list': [
        {
            "kitNo": "93440000315",
            "cardNo": "3561670000001125",
            "partialCardNo": "1125",
            "isPinSetup": false,
            "cardType": "VIRTUAL",
            "networkType": "RUPAY",
            "status": "REPLACED",
            "cardExpiry": "2710",
            "cardIssueDate": null
        },
        {
            "kitNo": "93440000324",
            "cardNo": "3561670000001134",
            "partialCardNo": "1134",
            "isPinSetup": true,
            "cardType": "PHYSICAL",
            "networkType": "RUPAY",
            "status": "REPLACED",
            "cardExpiry": "2710",
            "cardIssueDate": null
        },
        {
            "kitNo": "93440000332",
            "cardNo": "3561670000001142",
            "partialCardNo": "1142",
            "isPinSetup": false,
            "cardType": "VIRTUAL",
            "networkType": "RUPAY",
            "status": "REPLACED",
            "cardExpiry": "2710",
            "cardIssueDate": null
        },
        {
            "kitNo": "93440000341",
            "cardNo": "3561670000001151",
            "partialCardNo": "1151",
            "isPinSetup": true,
            "cardType": "VIRTUAL",
            "networkType": "RUPAY",
            "status": "REPLACED",
            "cardExpiry": "2710",
            "cardIssueDate": null
        },
        {
            "kitNo": "93440000349",
            "cardNo": "3561670000001159",
            "partialCardNo": "1159",
            "isPinSetup": true,
            "cardType": "VIRTUAL",
            "networkType": "RUPAY",
            "status": "ALLOCATED",
            "cardExpiry": "2710",
            "cardIssueDate": null
        },
        {
            "kitNo": "93440000351",
            "cardNo": "3561670000001161",
            "partialCardNo": "1161",
            "isPinSetup": true,
            "cardType": "VIRTUAL",
            "networkType": "RUPAY",
            "status": "REPLACED",
            "cardExpiry": "2710",
            "cardIssueDate": null
        },
        {
            "kitNo": "15870000051",
            "cardNo": "6529560000000515",
            "partialCardNo": "0515",
            "isPinSetup": false,
            "cardType": "VIRTUAL",
            "networkType": "RUPAY",
            "status": "REPLACED",
            "cardExpiry": "2811",
            "cardIssueDate": null
        }
    ],
    '/card/get/cvv': {
        "cvv": "299"
    },
    '/card/get/limit': {
        "totalLimit": "100000.00",
        "availableLimit": "100000.00",
        "utilizedLimit": "0.00"
    },
    '/card/get/due': {
        "minDue": "0.00",
        "totalDue": "0.00",
        "dueDate": "2024-03-06",
        "paymentMade": "0.00",
        "unbilledAmount": "10456.00",
        "interestAccumulated": "0.00",
        "totalOutStandingAmount": "5915.00",
        "currentStatementDate": "2024-02-21",
        "nextStatementDate": "2024-03-04",
        "unpaidMinDue": "0.00",
        "unpaidTotalDue": "0.00",
        "unpaidMinDueBeforeDue": "0.00",
        "unpaidTotalDueBeforeDue": "0.00",
        "excessPayment": "0.00",
        "postedEmi": {
            "emiTotalAmount": "0.00",
            "principal": "0.00",
            "interest": "0.00",
            "otherCharges": "0.00"
        },
        "unpaidPostedEmi": {
            "emiTotalAmount": "0.00",
            "principal": "0",
            "interest": "0",
            "otherCharges": "0"
        },
        "previousUnpaidEmi": {
            "emiTotalAmount": "0.00",
            "principal": "0",
            "interest": "0",
            "otherCharges": "0"
        },
        "feeDetails": [
            {
                "feeType": "LATEPAYMENT",
                "unPaidBilledFee": "0.00",
                "unPaidUnBilledFee": "0.00",
                "unPaidBilledFeeTax": "0.00",
                "unPaidUnBilledFeeTax": "0.00"
            }
        ],
        "lastStatementAmount": "0.00"
    },
    '/card/set/pin': {
        "status": true
    },
    '/card/get/details': {
        "name": "Rohit Shirude",
        "dob": "01042000",
        "kitNo": "93440000349",
        "cardNo": "3561670000001159",
        "partialCardNo": "1159",
        "isPinSetup": true,
        "cardType": "VIRTUAL",
        "networkType": "RUPAY",
        "status": "ALLOCATED",
        "cardExpiry": "2710",
        "cardIssueDate": null
    },
    '/request/physical/card': {
    },
    '/card/get/unbilled/transactions': [
        {
            "amount": 2245,
            "transactionDate": "2024-02-26 08:48:12",
            "externalTransactionId": "S26022024526",
            "internalTransactionId": "598925245",
            "description": "EMI CONVERSION | S26022024526",
            "transactionType": "CREDIT"
        },
        {
            "amount": 3294,
            "transactionDate": "2024-02-26 07:35:51",
            "externalTransactionId": "010052762606271211500000043327400000570000",
            "internalTransactionId": "405713760656",
            "description": "ABCRESTAURANTCOIMBATORE               IN",
            "transactionType": "DEBIT"
        },
        {
            "amount": 2322,
            "transactionDate": "2024-02-26 07:34:16",
            "externalTransactionId": "010097601906271211500000043327400000570000",
            "internalTransactionId": "405713520837",
            "description": "ABCRESTAURANTCOIMBATORE               IN",
            "transactionType": "DEBIT"
        },
        {
            "amount": 2245,
            "transactionDate": "2024-02-26 07:27:45",
            "externalTransactionId": "010061226306271211500000043327400000570000",
            "internalTransactionId": "405712550536",
            "description": "ABCRESTAURANTCOIMBATORE               IN",
            "transactionType": "DEBIT"
        },
        {
            "amount": 2296,
            "transactionDate": "2024-02-23 11:32:30",
            "externalTransactionId": "S23022024524",
            "internalTransactionId": "599740952",
            "description": "EMI CONVERSION | S23022024524",
            "transactionType": "CREDIT"
        },
        {
            "amount": 2296,
            "transactionDate": "2024-02-23 10:12:18",
            "externalTransactionId": "010068619306271211500000043327400000570000",
            "internalTransactionId": "405415516317",
            "description": "ABCRESTAURANTCOIMBATORE               IN",
            "transactionType": "DEBIT"
        },
        {
            "amount": 299,
            "transactionDate": "2024-02-23 10:11:17",
            "externalTransactionId": "010013095606271211500000043327400000570000",
            "internalTransactionId": "405415776990",
            "description": "ABCRESTAURANTCOIMBATORE               IN",
            "transactionType": "DEBIT"
        }
    ],
    '/card/get/statement': {
        "transactions": [],
        "statement": {
            "amount": 0,
            "totalCreditAmount": 0,
            "totalDebitAmount": 0,
            "minimumDueAmount": 131.9,
            "statementDate": "2023-12-04 00:00:00",
            "startDate": "2023-11-04 00:00:00",
            "customerDueDate": "2023-12-06 18:20:00",
            "lastStatementBalance": 2638,
            "paymentStatus": "PAID",
            "finance": {
                "interest": 0,
                "tax": 0,
                "fees": 0
            },
            "purchase": {
                "amount": 0,
                "cash": 0
            },
            "emi": {
                "debit": 0,
                "principle": 0,
                "interest": 0,
                "otherCharges": 0,
                "limitBlockedAmount": 0
            }
        }
    },
    '/card/set/limit': {},
    '/card/get/billing_dates': [
        {
            from: 7,
            to: 25,
            eligible: false
        },
        {
            from: 15,
            to : 3,
            eligible: true
        },
        {
            from : 20,
            to: 8,
            eligible: true
        },
        {
            from : 21,
            to: 9,
            eligible: true
        },
        {
            from : 25,
            to: 13,
            eligible: true
        }
    ]
}

