import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/styles.css';

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
                            </button></div>
                    <div className="header-title">Set limits and permissions</div>
                    <div className="header-right-wrapper"></div>
                </div>
            </div>
        </>
    )
}
