import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/styles.css';

function ComingSoon() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    }
    return (
        <>
            <div class="header-wrapper back-header">
                <div class="header-container">
                    <div class="header-menu-wrapper">
                        <button class="btn" onClick={handleBackClick}>
                            <i class="feather-arrow-left"></i>
                        </button>
                    </div>
                </div>
            </div>
            <h1 style={{ textAlign: 'center', paddingTop: '40px' }}>Coming Soon</h1>
        </>
    )
}

export default ComingSoon