import React from 'react';
import { Header } from './components/header';
import { UnbilledTransactions } from './components/unbilled-transactions';
import { ApiCalls } from '../common/apiCalls';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function UnbilledTransactionsIndex() {
    const { transactionStatusDetails, loading } = ApiCalls();

    return (
        <>
            <Header />
            
            {loading ? (
                <div className="loader">
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '3rem', color: '#e96341', position: 'absolute', left: '45%', top: '40%'  }} />
                </div>
            ) : (
                <UnbilledTransactions transactionStatusDetails={transactionStatusDetails} />
            )}
        </>
    );
}
