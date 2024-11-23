import React from 'react';
import { Header } from './components/header';
import { EmiTransaction } from './components/emiTransaction';
import { ApiCalls } from '../common/apiCalls';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function EmiTransactionIndex() {
    const { transactionStatusDetails, loading } = ApiCalls();
    const location = useLocation();

    const externalTransactionId = location.state && location.state.externalTransactionId;
    let transactionDetail = null;

    if (transactionStatusDetails && Array.isArray(transactionStatusDetails)) {
        for (const detail of transactionStatusDetails) {
            if (detail.externalTransactionId === externalTransactionId) {
                transactionDetail = detail;
                break; 
            }
        }
    }

    return (
        <>
            <Header />
            
            {loading ? (
                <div className="loader">
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '3rem', color: '#404d6b', position: 'absolute', left: '45%', top: '40%'  }} />
                </div>
            ) : (
                <EmiTransaction transactionDetail={transactionDetail} />
            )}
        </>
    );
}