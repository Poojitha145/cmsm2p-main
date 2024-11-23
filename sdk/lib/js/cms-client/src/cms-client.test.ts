import { CmsClient } from "./cms-client";

const cmsClient: CmsClient = new CmsClient({
    baseURL: 'https://cmsdevapi.saven.in',
    virtual: false
});

const Cache: any = {
    CMS_AUTH_TOKEN: '',
    KITNO: '93440000352',
    MOBILE_NUMBER: '+919700000001',
    EXPIRY_DATE: '2710',
    DOB: '22021992',
    FROM_DATE: "20200101",
    TO_DATE: "20240101",
    STMT_MONTH: '022024',
    STMT_DATE: 4,
    CMS_EXPIRED_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZDg4ZTJkZjNmMzBkNDNmZGU5MmJkNjRiNzIxMDIzODljZTllMjYxOTdjMzgyYmZhNzg5NmVkOTQzZGY3ZDdkZjQ4MWNjMzkzMDFkN2ZjZTg5OGYwODY3MzgwZmZiNGNkYzRlMTIyYmE0NjMwZTg3ZDFmYmU3MzM4NmI0MjE3MjM3M2FjMTA1NWJjNzU4NDU0MjllMTM4ZDYyZTQ3NDYyNTEzNGViMWE1MmFlN2U2ODdiYjQxYmJjMTM4MGM1Y2VmNDkwNTAyNTUzMjAwMDVlZThiMTM4YTUzNmNmMWNhNGYxMWVlNzkzYWJkNDBjNmMxZDMxYWEyMWMyOTcyY2I1M2UwMGFiZTcxNGFiODJjOTQwNzY1MmJlNWI4YmU4ZThkMjZhMjI5ZmZmNWVjNmMyOTIzMTFjMDg4N2NmNzllNTUwMzk5OWI1MjFkYmY4MDdkYjM4MDJjZjFkM2EwNGJmMDMyMWZkZTM5NjU4YTdmYmQ1NTk4OTk5NDQzMjMyNDJkMTZhN2M1MGFmOGJhNjU2YmFkOTA0MjIzYzI2MTViZDA3MjQwMjRjOTdjYzc0MjMyMTcxM2FkNzBjZDczNmI5ZDkzNzQ0OTlhYTM0YWZkODU1Njg2MGJmMjAxNjM1NTVhNjU0M2RmMGMzODk1ZGJiY2UyMGQ1Zjc0YmJmMDU3YmQ2MTNhMmFhM2M1NTBlOTM4ZTRlOWVkZWU1Y2RmZTVmYTIyNzIyMjRiZThjM2Q4YjMzMWRhNzZhZmNjMTJlYjdiMjBiZGRmMDNhOTJiNjBmN2Y2NDJmODQ2YTI3MGYxYmQ1MDFjODUxZjQ5ZTQ1ODRkNjZiOGNmMDBlMDk3MWZlOGFlOTJhMDdiNWU2ZGJjYWNiN2Y2OGU0NWViZjAxN2Q1YzY1ZjM5NGEyNzU5ZmE2NjlmYTdiYTI2OGViN2Q5MTFmNmQ2YmMxZmNhNzIwOGEwOGYwYmNlMTg5ZjAyMjk5Y2RhZDkxMjU0ZWJjNDQzYjcwNjNjNmY5NGUyMTFkNTYzNjc0NWFhYzc0ZmQ5OThhY2ZmNjQ3YTQxNmMzOTgxYzc1OTZjZGNmNjRjZWM3NGUyMTY0NGE0OGIyYzg1NTA0ZTdmMGU1ZGZkMzQ4ZGFjOTYwMDM4ODU2ZjUzOGQyMjE3MjAwM2JkNTBlYzY2MzQ2ZjExMDE3Mzc5MzgzNzM1YWExZDdiNWIwYjgxYTFlZmE3MTU0ZjY5YmRmYmY5M2IwNjg5MDc1MzZiZDUxMjRjNmFmZGI3ZTJiODRhZTkzMzUxMjQzOTc1NDk0M2E4MDJlMjE3NDJjMWUyYWZjMDBkYTlhYTM0YzlhODJjZGM4M2U3MWNiMTNjMGY2ZjlmOWIyYXwxNDEwNWMxNjYzOWM0YjBhZmFjNTk0YmY5Zjg0Yjc0MCIsImlhdCI6MTcxMTcxMjkwNiwiZXhwIjoxNzExNzE0NzA2fQ.rXGLaxR8zmf3kNmMJV8WniXafzxqXQYmPZtU8ONSBS8'
}

describe("CMS-Service: User Authentication", () => {
    it("should get succes status and token", async () => {
        const result: any = await cmsClient.authenticate(Cache.MOBILE_NUMBER, '1234');
        expect(result.status).toEqual('success');
        expect(result.data.status).toEqual(true);

        // Dynamically extract the token and store from the response
        Cache.CMS_AUTH_TOKEN = result.data.token;
    });

    it("invalid credentials", async () => {
        const result: any = await cmsClient.authenticate('+919700000001', '1232');
        expect(result.status).toEqual('error');
        expect(result.error.message).toEqual("invalid credentials");
    });
});

describe("CMS-Service: GetCardBalance", () => {
    it("should get the active card balance", async () => {
        const result: any = await cmsClient.getBalance(Cache.CMS_AUTH_TOKEN);
        expect(result.status).toEqual('success');
        expect(result.data).toHaveLength(1);
        expect(result.data[0]).toHaveProperty("balance");
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        const result: any = await cmsClient.getBalance(Cache.CMS_EXPIRED_TOKEN);
        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: GetCardDetails", () => {
    it("should get the active card details", async () => {
        const result: any = await cmsClient.getDetails(Cache.CMS_AUTH_TOKEN);

        expect(result.status).toEqual('success');
        expect(result.data).toHaveProperty("status");
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.getDetails(Cache.CMS_EXPIRED_TOKEN);

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: GetCardList", () => {
    it("should get the user's card list history", async () => {
        const result: any = await cmsClient.getList(Cache.CMS_AUTH_TOKEN);

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');

        // Assertion to verify that result.data is an array
        expect(Array.isArray(result.data)).toBe(true);

        // Assertion to verify that each item in result.data is an object
        result.data.forEach(item => {
            expect(typeof item).toBe('object');
            expect(item).toBeTruthy(); // Additional check for truthiness of each item
        });
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.getList(Cache.CMS_EXPIRED_TOKEN);

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: GetPreference", () => {
    it("should get the card preferences", async () => {
        // Perform the API call
        const result = await cmsClient.getPreference(Cache.CMS_AUTH_TOKEN);

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.getPreference(Cache.CMS_EXPIRED_TOKEN);

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: SetCardPreference", () => {
    it("should get the", async () => {
        // Perform the API call
        const result = await cmsClient.setPreference(Cache.CMS_AUTH_TOKEN, {
            "limitConfig": {
                "txnType": "POS",
                "dailyLimitValue": "20000",
                "dailyLimitCnt": "0",
                "minAmount": "500",
                "maxAmount": "20000"
            },
            "overallLimitConfig": {
                "dailyLimitValue": "26000",
                "dailyLimitCnt": "15"
            }
        });

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.setPreference(Cache.CMS_EXPIRED_TOKEN, {
            "limitConfig": {
                "txnType": "POS",
                "dailyLimitValue": "20000",
                "dailyLimitCnt": "0",
                "minAmount": "500",
                "maxAmount": "20000"
            },
            "overallLimitConfig": {
                "dailyLimitValue": "26000",
                "dailyLimitCnt": "15"
            }
        });

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: SetCardLimit", () => {
    it("should set the limit successfully", async () => {
        const result = await cmsClient.upgradeLimit(Cache.CMS_AUTH_TOKEN, {
            "amount": 1000
        });

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.upgradeLimit(Cache.CMS_EXPIRED_TOKEN, {
            "amount": 1000
        });

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: GetCardCvv", () => {
    it("should get the card cvv successfully", async () => {
        const result = await cmsClient.getCvv(Cache.CMS_AUTH_TOKEN, {
            "kitNo": Cache.KITNO,
            "expiryDate": Cache.EXPIRY_DATE,
            "dob": Cache.DOB
        });

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.getCvv(Cache.CMS_EXPIRED_TOKEN, {
            "kitNo": Cache.KITNO,
            "expiryDate": Cache.EXPIRY_DATE,
            "dob": Cache.DOB
        });

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: GetCardStatement", () => {
    it("should get the card statement successfully for the month specified", async () => {
        const result = await cmsClient.getStatement(Cache.CMS_AUTH_TOKEN, {
            "stmt_month": Cache.STMT_MONTH
        });

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.getStatement(Cache.CMS_EXPIRED_TOKEN, {
            "stmt_month": Cache.STMT_MONTH
        });

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: UpdateCardStatementDate", () => {
    it("should set the card Statement Date successfully as a part of change billing cycle", async () => {
        const result = await cmsClient.updateStatementDate(Cache.CMS_AUTH_TOKEN, {
            "stmtDate": Cache.STMT_DATE
        });

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        if (result.status === 'success') {
        } else {
            expect(result.error.message).toEqual("Statement date already set");
        }
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.updateStatementDate(Cache.CMS_EXPIRED_TOKEN, {
            "stmtDate": Cache.STMT_DATE
        });

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: GetCardTransactions", () => {
    it("should get the card Transactions for the timeline specified successfully", async () => {
        const result = await cmsClient.getTransactions(Cache.CMS_AUTH_TOKEN, {
            "fromDate": Cache.FROM_DATE,
            "toDate": Cache.TO_DATE
        });

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.getTransactions(Cache.CMS_EXPIRED_TOKEN, {
            "fromDate": Cache.FROM_DATE,
            "toDate": Cache.TO_DATE
        });

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: GetCardDue", () => {
    it("should get the", async () => {
        const result = await cmsClient.getDue(Cache.CMS_AUTH_TOKEN);

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.getDue(Cache.CMS_EXPIRED_TOKEN);

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: GetBillingDates", () => {
    it("should get the billing dates in the cycle successfully for which the user is eligible", async () => {
        const result = await cmsClient.getBillingDates(Cache.CMS_AUTH_TOKEN);

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.getBillingDates(Cache.CMS_EXPIRED_TOKEN);

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: LockCard", () => {
    it("should get the card locked successfully", async () => {
        const result = await cmsClient.lock(Cache.CMS_AUTH_TOKEN,
            { kitNo: Cache.KITNO, reason: "Lock the Card for Safety" });

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        if (result.status === 'success') {
            expect(result.data).toEqual('success');
        } else {
            expect(result.error.message).toEqual('Card already locked')
        }
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.lock(Cache.CMS_EXPIRED_TOKEN,
            { kitNo: Cache.KITNO, reason: "Lock the Card for Safety" });

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: UnlockCard", () => {
    it("should get the card unlocked successfully which was already locked", async () => {
        const result = await cmsClient.unlock(Cache.CMS_AUTH_TOKEN,
            { kitNo: Cache.KITNO, reason: "Unlock the Card" });

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        if (result.status === 'success') {
            expect(result.data).toEqual('success');
        } else {
            expect(result.error.message).toEqual('Card already unlocked')
        }
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.unlock(Cache.CMS_EXPIRED_TOKEN,
            { kitNo: Cache.KITNO, reason: "Unlock the Card" });

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: BlockCard", () => {
    it("should get the card block successfully", async () => {
        const result = await cmsClient.block(Cache.CMS_AUTH_TOKEN,
            { kitNo: Cache.KITNO, reason: "Block the Card for Safety" });

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.block(Cache.CMS_EXPIRED_TOKEN,
            { kitNo: Cache.KITNO, reason: "Block the Card for Safety" });

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: ReplaceCard", () => {
    it("should get the card replaced successfully", async () => {
        // const result = await cmsClient.replace(Cache.CMS_AUTH_TOKEN, 
        // { kitNo: Cache.KITNO, reason: "Replace the Card" });

        // // Assertion to verify that result is defined and not null
        // expect(result).toBeDefined();
        // expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // // Perform the API call
        // const result = await cmsClient.replace(Cache.CMS_EXPIRED_TOKEN, 
        // { kitNo: Cache.KITNO, reason: "Replace the Card" });

        // // Assertion to verify that the response status is not "success"
        // expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: GetLoanEmiEligibleTransactions", () => {
    it("should get the loanEmi eligible transactions", async () => {
        const result = await cmsClient.getEmiEligibleTransactions(Cache.CMS_AUTH_TOKEN);

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.getEmiEligibleTransactions(Cache.CMS_EXPIRED_TOKEN);

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: GetLoanEmiEligibleList", () => {
    it("should get the list of transactions that were loan eligible successfully", async () => {
        const result = await cmsClient.getEmiEligibleList(Cache.CMS_AUTH_TOKEN);

        // Assertion to verify that result is defined and not null
        expect(result).toBeDefined();
        expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // Perform the API call
        const result = await cmsClient.getEmiEligibleList(Cache.CMS_EXPIRED_TOKEN);

        // Assertion to verify that the response status is not "success"
        expect(result.status).not.toEqual('success');
    });
});

describe("CMS-Service: GetLoanPreview", () => {
    it("should get the loan preview transactions", async () => {
        // const result = await cmsClient.getEmiPreview(Cache.CMS_AUTH_TOKEN, {
        //     "ruleId": "11",
        //     "requestType": "SINGLE",
        //     "transactions": [
        //         {
        //             "extTxnId": "010013312806271211500000043327400000570000",
        //             "amount": 2446
        //         }
        //     ]
        // });

        // // Assertion to verify that result is defined and not null
        // expect(result).toBeDefined();
        // expect(result.status).toEqual('success');
    });

    it("when jwt token gets expired or not token passed with status error", async () => {
        // // Perform the API call
        // const result = await cmsClient.getEmiPreview(Cache.CMS_EXPIRED_TOKEN, {
        //     "ruleId": "11",
        //     "requestType": "SINGLE",
        //     "transactions": [
        //         {
        //             "extTxnId": "010013312806271211500000043327400000570000",
        //             "amount": 2446
        //         }
        //     ]
        // });

        // // Assertion to verify that the response status is not "success"
        // expect(result.status).not.toEqual('success');
    });
});