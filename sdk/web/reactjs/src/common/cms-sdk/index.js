import cmsClient from './cmsClient';
import { balanceDetails, cardDetails, transactionDetails, cvvDetails, limitDetails, setNewPinResponse, dueDetails, updateStatementResponse, billingDates, cardList, statementDetails } from '../mockData';

const cmsClientInstance = new cmsClient();
cmsClientInstance.initialize();

export async function cmsUserAuthenticate(mpin) {
    const response = await cmsClientInstance.authenticate({
        // "mobileNumber": "+919030235945",
        "mobileNumber": "+916302482039",
        "pin": mpin
    });
    if (response.status === true) {
        return true
    }
    return false;
}

export async function resetMpin(body) {
    let resultData = await cmsClientInstance.resetCardMpin(body);
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data[0];
    } else {
        // resultData = balanceDetails?.data[0];
    }
    return resultData;
}

export async function fetchCardBalance() {
    let resultData = await cmsClientInstance.getBalance();
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data[0];
    } else {
        resultData = balanceDetails?.data[0];
    }
    return resultData;
}

export async function fetchTransactions(body) {
    let resultData = await cmsClientInstance.getTransactions(body);
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data;
    } else {
        resultData = transactionDetails?.data;
    }
    return resultData;
}

export async function fetchTransactionStatusDetails(body) {
    let resultData = await cmsClientInstance.getTransactionStatus(body);
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data;
    } else {
        resultData = transactionDetails?.data;
    }
    return resultData;
}

export async function fetchCardList() {
    let resultData = await cmsClientInstance.getCardList();
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data;
    } else {
        resultData = cardList?.data;
    }
    return resultData;
}

export async function fetchCardDetails() {
    let resultData = await cmsClientInstance.getCardDetails();
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data;
    } else {
        resultData = cardDetails?.data;
    }
    return resultData;
}

export async function fetchLimitDetails(body) {
    let resultData = await cmsClientInstance.getCardLimit(body);
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data
    } else {
        resultData = limitDetails?.data
    }
    return resultData;
}

export async function fetchCvvDetails(body) {
    let resultData = await cmsClientInstance.getCvv(body);
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data
    } else {
        resultData = cvvDetails?.data
    }
    return resultData;
}

export async function fetchStatementDetails(body) {
    let resultData = await cmsClientInstance.getStatement(body);
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data
    } 
    else {
        resultData = statementDetails?.data
    }
    return resultData;

}

export async function getPreferences() {
    let resultData = await cmsClientInstance.getPreference();
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data;
    } else {
        // resultData = dueDetails?.data;
    }
    return resultData;
}

export async function updatePreference(body) {
    let resultData = await cmsClientInstance.setPreference(body);
    if (resultData?.status === 'success') {
        resultData = resultData?.data;
    }
    // return resultData;
    return true;
}


// export async function cardClose(body) {
//     let resultData = await cmsClientInstance.closeCard(body);
//     if (resultData?.status === 'success') {
//         resultData = resultData?.data;
//     }
//     return resultData;
// }

export async function fetchDueDetails() {
    let resultData = await cmsClientInstance.getDue();
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data;
    } else {
        resultData = dueDetails?.data;
    }
    return resultData;
}

export async function fetchUpdateStatement(body) {
    let resultData = await cmsClientInstance.updateStatement(body);
    if (resultData?.status === 'success' && resultData?.data) {
        resultData = resultData?.data;
    }
    else {
        resultData = updateStatementResponse?.data;
    }
    return resultData;
}

export async function updateNewPin(body) {
    let resultData = await cmsClientInstance.setCardPin(body);
    if (resultData?.status === 'success') {
        resultData = resultData?.data;
    }
    else {
        resultData = setNewPinResponse?.data;
    }
    return resultData;
}

export async function fetchBillingDates() {
    let resultData = await cmsClientInstance.getBillingDates();
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data;
    } else {
        resultData = billingDates?.data;
    }
    return resultData;
}

export async function cardLock(body) {
    let resultData = await cmsClientInstance.lockCard(body);
    if (resultData?.status === 'success') {
        resultData = resultData?.data;
    }
    return resultData;
}

export async function cardUnlock(body) {
    let resultData = await cmsClientInstance.unlockCard(body);
    if (resultData?.status === 'success') {
        resultData = resultData?.data;
    }
    return resultData;
}


export async function cardReplace(body) {
    let resultData = await cmsClientInstance.replaceCard(body);
    if (resultData?.status === 'success') {
        resultData = resultData?.data;
    }
    return resultData;
}

export async function cardBlock(body) {
    let resultData = await cmsClientInstance.blockCard(body);
    if (resultData?.status === 'success') {
        resultData = resultData?.data;
    }
    return resultData;
}


export async function fetchCardListPost(body) {
    let resultData = await cmsClientInstance.getCardListPost(body);
    if (resultData?.status === 'success') {
        resultData = resultData?.data;
    }
    return resultData;
}
export async function cardClose(body) {
    let resultData = await cmsClientInstance.closeCard(body);
    if (resultData?.status === 'success') {
        resultData = resultData?.data;
    }
    return resultData;
}

export async function fetchEmiEligibleTransactions() {
    let resultData = await cmsClientInstance.getEmiEligibleTransactions();
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data;
    } else {
        // resultData = billingDates?.data;
    }
    return resultData;
}

export async function fetchEmiEligibleList() {
    let resultData = await cmsClientInstance.getEmiEligibleList();
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data;
    } else {
        // resultData = billingDates?.data;
    }
    return resultData;
}

export async function fetchEmiPreview(body) {
    let resultData = await cmsClientInstance.getEmiPreview(body);
    if (resultData.status === 'success' && resultData?.data) {
        resultData = resultData?.data;
    } else {
        // resultData = billingDates?.data;
    }
    return resultData;
}