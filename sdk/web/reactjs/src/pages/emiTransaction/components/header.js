import React from 'react';
import '../../assets/styles/styles.css';
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
                    <div className="header-title"></div>
                    <div className="header-right-wrapper">
                        <button className="btn">
                            <i className="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}