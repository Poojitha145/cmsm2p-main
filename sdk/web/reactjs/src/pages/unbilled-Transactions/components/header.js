import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {

    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate(-1);
    }

    return (
        <>
            <div className="header-wrapper back-header">
                <div className="header-container">
                    <div className="header-menu-wrapper">
                        <button className="btn" onClick={handleBackButtonClick}>
                            <i className="feather-arrow-left"></i>
                        </button>
                    </div>
                    <div className="header-title">
                        <div>Unbilled Transactions</div>
                    </div>
                    <div className="header-right-wrapper"></div>
                </div>
            </div>
            <div class="secondary-header-wrapper">
                <div>View all your unbilled transactions below</div>
            </div>
        </>
    )
}