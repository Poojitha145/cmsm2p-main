import React, { useState, useEffect } from 'react';
import Header from './components/header.js';
import Card from './components/card.js';
import Statement from './components/statement.js';
import Transactions from './components/transactions.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import '../assets/styles/styles.css';
import { ApiCalls } from '../common/apiCalls.js';

export function CardIndex() {
    const { setButtonClick, cardBalance, cardDetails, transactionDetails, limitDetails, cvvDetails, loading } = ApiCalls();
    const [settingmodalOpen, setSettingModalOpen] = useState(false);
    useEffect(() => {
        const preventBackNavigation = () => {
            window.history.pushState(null, null, window.location.pathname);
            window.onpopstate = () => {
                window.history.go(1);
            };
        };

        preventBackNavigation();

        return () => {
            window.onpopstate = null;
        };
    }, [])
    return (
        <div>
            <Header cardDetails={cardDetails} setSettingModalOpen={setSettingModalOpen} settingmodalOpen={settingmodalOpen} setButtonClick={setButtonClick} />
            <div class="body-wrapper has-footer-menu has-curved">
                <div class="body-container">
                    {loading ? (<div className="loader">
                        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '3rem', color: 'white' }} /> 
                    </div>) : (<><Card balance={cardBalance} cardDetails={cardDetails} limitDetails={limitDetails} cvvDetails={cvvDetails} />
                        <Statement />
                        <Transactions transactionDetails={transactionDetails}  />
                    </>)}
                </div>
            </div>
        </div>
    )
}