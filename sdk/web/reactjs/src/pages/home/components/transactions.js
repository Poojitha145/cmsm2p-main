import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/styles.css';
import moment from 'moment';

function Transactions(props) {
    const { transactionDetails = [] } = props;
    const navigate = useNavigate();

    const handleTransactionList = () => {
        navigate('/unbilled-transactions')
    }

    const handleEmiTransaction = (externalTransactionId) => {
        navigate('/transactions-emi', { state: { externalTransactionId } });
    };

    return (
        <div className="transactions-wrapper">
            <div className="transactions-header" onClick={handleTransactionList}>
                <h4 className="transactions-title">Unbilled transactions</h4>
                <div className="transactions-header-actions ms-auto">
                    <div className="item-arrow-wrapper"><i className="feather-chevron-right" ></i></div>
                </div>
            </div>
            <div className="transactions-body">
                {transactionDetails.map((details, index) => (
                    <div key={index} className="transactions-item-wrapper" onClick={() => handleEmiTransaction(details.externalTransactionId)}>
                        <div className="credited-card transactions-item-container">
                            <div className="item-icon-wrapper">
                                <div className={details?.transactionType === 'DEBIT' ? "item-icon-container-debit" : "item-icon-container-credit"}>
                                    <i className={details?.transactionType === 'DEBIT' ? 'fa-minus fa-solid' : 'fa-plus fa-solid'}></i>
                                </div>
                            </div>
                            <div className="item-text-wrapper">
                                <div className="item-name">{details?.description}</div>
                                <div className="item-time">{moment(details?.transactionDate).format('MMMM Do YYYY, h:mm:ss a')}</div>
                            </div>

                            <div className="item-value-wrapper">
                                {details.isEligible !== false && (
                                    <img className='logo' src={require('../../assets/img/easy_emi_logo.png')} alt="Logo" />
                                )}
                                <div className="item-total-value">
                                    <i className="fa-solid fa-indian-rupee-sign"></i>{details?.amount}

                                </div>
                                
                            </div>
                            <div className="item-arrow-wrapper"><i className="feather-chevron-right"></i></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Transactions