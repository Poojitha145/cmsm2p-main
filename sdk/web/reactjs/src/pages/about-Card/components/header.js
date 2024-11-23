import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Header(props) {

    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate(-1);
    }

    return (
        <>
            <div class="header-wrapper back-header">
                <div class="header-container emi-details-header">
                    <div class="header-menu-wrapper">
                        <button class="btn" onClick={handleBackButtonClick}>
                            <i class="feather-arrow-left"></i>
                        </button>
                    </div>
                    <div class="header-title">All about your card</div>
                    <div class="header-right-wrapper"></div>
                </div>
            </div>
        </>
    )
}