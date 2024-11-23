import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../assets/styles/styles.css';

export function EasyEmi() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    }

    return (
        <div>
            <div className="header-wrapper back-header">
                <div className="header-container">
                    <div className="header-menu-wrapper"><button className="btn" onClick={handleBackClick}><i className="feather-arrow-left"></i></button></div>
                    <div className="header-title"></div>
                    <div className="header-right-wrapper"><button className="btn"><i className="fas fa-ellipsis-v"></i></button></div>
                </div>
            </div>

            <div className="transaction-card-container">
                <div className="d-flex">
                    <div className="transaction-icon-circle default">
                        S
                    </div>
                    <div>
                        <h2 className="transaction-container-heading">Transaction 1</h2>
                        <p className="transaction-container-time">11th Mar 2024 . 09.03 AM</p>
                    </div>
                </div>
                <div>
                    <div className="text-right transaction-container-amount">
                        ₹2,500.80
                    </div>
                </div>
            </div>

            <hr className="divider" />

            <div>
                <div className="transaction-divider-section">
                    <div style={{ width: '50%' }}>
                        <p className="transaction-divider-title">Transaction status</p>
                        <p>(Usually takes 2-3 working days to reflect in your account)</p>
                    </div>
                    <p className="pending-settlement">Pending settlement</p>
                </div>
                <div className="transaction-divider-section">
                    <p className="transaction-divider-title">Billing status</p>
                    <p className="transaction-divider-content">Not Billed</p>
                </div>
                <div className="transaction-divider-section">
                    <p className="transaction-divider-title">Transaction ID</p>
                    <p className="transaction-divider-content">
                        XXXXXXXXXXXXXXX &nbsp;<i className="fa-regular fa-copy copy-icon"></i>
                    </p>
                </div>
            </div>
        </div>
    );
}
