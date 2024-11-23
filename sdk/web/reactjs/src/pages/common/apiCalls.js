import { useState, useEffect } from 'react';
import { fetchCardBalance, fetchCardDetails, fetchCvvDetails, fetchLimitDetails, fetchTransactions, updateNewPin, cardLock, cardUnlock, cardBlock, fetchCardListPost, fetchTransactionStatusDetails } from '../../common/cms-sdk/index';

export function ApiCalls() {
  let [cardBalance, setCardBalance] = useState(0);
  let [cardDetails, setCardDetails] = useState();
  let [transactionDetails, setTransactionDetails] = useState();
  let [transactionStatusDetails, setTransactionStatusDetails] = useState();
  let [limitDetails, setLimitDetails] = useState();
  let [cvvDetails, setCvvDetails] = useState();
  let [cardListDetails, setCardListDetails] = useState();
  let [loading, setLoading] = useState(false);
  let [buttonClick, setButtonClick] = useState(false);
  let [isCardLocked, setIsCardLocked] = useState(false);

  async function CardApicall() {
    setLoading(true);
    const BalanceDetails = await fetchCardBalance();
    setCardBalance(BalanceDetails?.balance);
    const detailsOfCard = await fetchCardDetails();
    setCardDetails(detailsOfCard);
    const limit = await fetchLimitDetails();
    setLimitDetails(limit);
    const cvv = await fetchCvvDetails();
    setCvvDetails(cvv);
        const cardListDetails = await fetchCardListPost();
        setCardListDetails(cardListDetails);
        // const lockedCardList = cardListDetails.find(card => card.status === "LOCKED");
        // setIsCardLocked(lockedCardList.length > 0);
    const details = await fetchTransactions({
      "fromDate": "20200101",
      "toDate": "20240101"
    });
    setTransactionDetails(details);
    const transactionDetails = await fetchTransactionStatusDetails({
      "fromDate": "2000-11-11",
      "toDate": "2024-11-11" 
    });
    setTransactionStatusDetails(transactionDetails);
    setLoading(false);
  }

  useEffect(() => {
    CardApicall();
    setButtonClick(false);
  }, [buttonClick])

  const setNewPinApiCall = async (pin) => {
    const resultData = await updateNewPin({
      "kitNo": cardDetails?.kitNo,
      "expiryDate": (cardDetails?.cardExpiry).substring(2, 4) + (cardDetails?.cardExpiry).substring(0, 2),
      "dob": cardDetails?.dob,
      "pin": pin
    });
    return resultData;
  }
    const lockCardApiCall = async () => {
        try {
            const lockCardDetails = await cardLock({ kitNo: cardDetails?.kitNo, reason: "Lock for safety" });
            console.log("Card locked successfully:", lockCardDetails);
        } catch (error) {
            console.error('Error locking card:', error);
        }
    };

    const unlockCardApiCall = async () => {
        try {
            const lockedCards = await fetchCardListPost({ status: "LOCKED" });
            if (lockedCards && lockedCards.length > 0) {
                const lockedCard = lockedCards[0];
                const unlockCardDetails = await cardUnlock({ kitNo: lockedCard.kitNo, reason: "Unlock Card" });
                console.log("Card unlocked successfully:", unlockCardDetails);
            } else {
                console.log("No locked cards found");
            }
        } catch (error) {
            console.error('Error unlocking card:', error);
        }
    };
    
    const blockCardApiCall = async () => {
        try {
            let kitNo;
            if (!isCardLocked) {
                kitNo = cardDetails?.kitNo;
            } else {
                const lockedCard = cardListDetails.find(card => card.status === "LOCKED");
                if (lockedCard) {
                    kitNo = lockedCard.kitNo;
                } else {
                    console.error('No locked cards found');
                    return;
                }
            }
            const reqBody = { kitNo, reason: "Block Card" };
            const blockCardDetails = await cardBlock(reqBody);
            if (blockCardDetails === 'success') {
                console.log("Card blocked successfully:", blockCardDetails);
            } else {
                console.log("Card blocking unsuccessful:", blockCardDetails);
            }
        } catch (error) {
            console.error('Error blocking card:', error);
        }
    };

    useEffect(() => {
        CardApicall();
        setButtonClick(false);
    }, [buttonClick])

    return { setButtonClick, cardBalance, cardDetails, transactionDetails, transactionStatusDetails, limitDetails, cvvDetails, loading, setNewPinApiCall, lockCardApiCall, unlockCardApiCall, blockCardApiCall };
}
