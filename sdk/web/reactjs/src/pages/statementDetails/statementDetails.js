import React, { useState, useEffect } from 'react';

import { Header } from './components/header';
import { Menu } from './components/menu.js';
import { Transactions } from './components/transactions.js';
import { fetchStatementDetails } from '../../common/cms-sdk/index.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function StatementDetailsIndex() {
    let [statementDetails, setStatementDetails] = useState();
    let [loading, setLoading] = useState(false);

    async function fetchStatements() {
        setLoading(true);
        const details = await fetchStatementDetails({
            "stmt_month": "022024"
        });
        setStatementDetails(details);
        setLoading(false);
    }

    useEffect(() => {
        fetchStatements();
    }, []);

    return (
        <div>{
            loading ? (<div className="loader" >
                <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '3rem', color: '#e96341', position: 'absolute', left: '45%', top: '45%' }} />
            </div>) : (<>
                <Header statementDate={statementDetails?.statement?.startDate} />
                <Menu statementData={statementDetails?.statement} />
                <Transactions transactionData={statementDetails?.transactions} /></>)
        }
        </div>
    )
}