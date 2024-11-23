import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

export function UnbilledTransactions(props) {
    const navigate = useNavigate();
    let { transactionStatusDetails = [] } = props;

    transactionStatusDetails = transactionStatusDetails.filter(transaction => transaction.billedStatus === "UNBILLED");
    transactionStatusDetails.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
   
    const handleTransactionClick = (transaction) => {
        navigate('/transactions-emi', {
            state: {
                description: transaction?.description,
                transactionDate: transaction?.transactionDate,
                amount: transaction?.amount,
                externalTransactionId: transaction?.externalTransactionId,
                billedStatus: transaction?.billedStatus,
                authorizationStatus: transaction?.authorizationStatus,
            }
        });
    };

    const groupedTransactions = transactionStatusDetails.reduce((acc, transaction) => {
        const date = moment(transaction.transactionDate).format('dddd, Do MMMM YYYY');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});

    return (
        <>
            <div className="unbilled-transactions-container">
                {Object.entries(groupedTransactions).map(([date, transactions], index) => (
                    <div key={index}>
                        <div className="unbilled-transactions-date">{date}</div>
                        {transactions.map((transaction, innerIndex) => (
                            <div key={innerIndex} className="transaction-card-container" onClick={() => handleTransactionClick(transaction)}>
                                <div className="d-flex">

                                    <div className={`transaction-icon-circle ${transaction.transactionType === "DEBIT" ? 'debit' : 'credit'}`}>
                                        {transaction.description ? transaction.description.charAt(0).toUpperCase() : ''}
                                    </div>
                                    <div>
                                        <h2 className="transaction-container-heading">{transaction?.description ? transaction.description.split('|')[0].trim() : ''}</h2>
                                        <p className="transaction-container-time">{moment(transaction.transactionDate).format('Do MMM YYYY hh:mm A')}</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        {transaction.isEMIEligible !== false && (
                                            <img className='logo' src={require('../../assets/img/easy_emi_logo.png')} alt="Logo" />
                                        )}
                                    </div>

                                    <div className="unbilled-transaction-container-amount">
                                        {transaction.transactionType === "CREDIT" && "+ "}
                                        &#8377;{parseFloat(transaction.amount).toFixed(2)} &nbsp;
                                        <i className="fa-solid fa-chevron-right unbilled-transaction-container-amount-i"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
