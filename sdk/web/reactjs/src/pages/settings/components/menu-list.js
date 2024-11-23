import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../assets/styles/styles.css';

export function MenuList({ isCardLocked, lockCardApiCall, unlockCardApiCall }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    // const [lockUnlockText, setLockUnlockText] = useState(isCardLocked ? 'Unlock' : 'Lock');
    const [customErrorMessage, setCustomErrorMessage] = useState("");


    const [modalText, setModalText] = useState(isCardLocked ? 'Unlock' : 'Lock');

    useEffect(() => {
        setModalText(isCardLocked ? 'Unlock' : 'Lock');
    }, [isCardLocked]);

    const handleChangeBilling = () => {
        navigate('/change-billing');
    };

    const handleLockCardClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
        setCustomErrorMessage("");
    };

    const handleLockCard = async () => {
        try {
            if (isCardLocked) {
                await unlockCardApiCall();
                setShowSuccessMessage(true);
            } else {
                await lockCardApiCall();
                setShowSuccessMessage(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setShowErrorMessage(true);
            return;
        }
        setTimeout(() => {
            setShowSuccessMessage(false);
            setShowErrorMessage(false);
        }, 3000);
        setShowModal(false);
    };

    const handlePinReset = () => {
        if (modalText === "Lock") {
            navigate('/pin-reset');
        } else {
            setCustomErrorMessage("Please unlock your card to avail this service");
            setTimeout(() => {
                setCustomErrorMessage("");
            }, 5000);
        }
    };
    
    const handleLimitControl = () => {
        navigate('/limit-control');
    };

    const handleBlockCard = () => {
        navigate('/block-card')
    };

    const handleCardClosure = () => {
        navigate('/card-closure')
    };

    const handleAboutCard = () => {
        navigate('/about-card')
    }
    
    return (
        <div className="float-menu-wrapper">
            <div className="float-menu-body">
                <div className="float-menu-item-wrapper" onClick={handleLockCardClick} >
                    <div className="float-menu-item-container">
                        <div className="item-icon-wrapper"><i className="feather-lock"></i></div>
                        <div className="item-text-wrapper">
                            <div className="item-desc">{modalText} your card</div>
                        </div>
                        <div className="item-arrow-wrapper"><i className="feather-chevron-right"></i></div>
                    </div>
                </div>
                {showModal && (
                    <div className="modal-style">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h1 style={{ fontSize: '18px', padding: '24px 0px 0px', fontWeight: '600', color: '#1B1E25' }}>{modalText} your card</h1>
                            <hr style={{ borderWidth: '2px', borderColor: 'black' }} />
                            <p style={{ margin: '10px 20px 10px' }}>{isCardLocked ? 'Unlocking' : 'Locking'} your card will {isCardLocked ? 'enable' : 'disable'} all future transactions and auto-payments. Do you wish to continue?</p>
                            <button className="btn btn-primary btn-lg btn-circular footer-close-btn" onClick={handleLockCard}>Yes, {modalText} my card</button>
                        </div>
                    </div>
                )}
                
                {showSuccessMessage && !showErrorMessage && (
                    <div className="text-success">
                        <p>Your card is successfully {isCardLocked ? 'unlocked' : 'locked'}!</p>
                    </div>
                )}
                {showErrorMessage && (
                    <div className="text-danger">
                        <p>{isCardLocked ? 'Failed to unlock' : 'Failed to lock'} the card. Please try again later.</p>
                    </div>
                )}
                
                <div className="float-menu-item-wrapper" onClick={handleLimitControl}>
                    <div className="float-menu-item-container">
                        <div className="item-icon-wrapper"><i className="fa-sliders fa-solid"></i></div>
                        <div className="item-text-wrapper">
                            <div className="item-desc" >Set limit and permissions</div>
                        </div>
                        <div className="item-arrow-wrapper"><i className="feather-chevron-right"></i></div>
                    </div>
                </div>
                <div className="float-menu-item-wrapper" onClick={handlePinReset}>
                    <div className="float-menu-item-container">
                        <div className="item-icon-wrapper"><i className="feather-more-horizontal"></i></div>
                        <div className="item-text-wrapper">
                            <div className="item-desc" >Change your POS/ATM PIN</div>
                        </div>
                        <div className="item-arrow-wrapper"><i className="feather-chevron-right"></i></div>
                    </div>
                </div>
                <div className="float-menu-item-wrapper" onClick={handleChangeBilling}>
                    <div className="float-menu-item-container">
                        <div className="item-icon-wrapper"><i className="feather-calendar"></i></div>
                        <div className="item-text-wrapper">
                            <div className="item-desc" >Change billing Cycle </div>
                        </div>
                        <div className="item-arrow-wrapper"><i className="feather-chevron-right"></i></div>
                    </div>
                </div>
                <div class="float-menu-item-wrapper" onClick={handleBlockCard}>
                    <div class="float-menu-item-container">
                        <div class="item-icon-wrapper"><i class="fa-ban fa-solid"></i></div>
                        <div class="item-text-wrapper">
                            <div class="item-desc">Block your card</div>
                        </div>
                        <div className="item-arrow-wrapper"><i className="feather-chevron-right"></i></div>
                    </div>
                </div>
                <div className="float-menu-item-wrapper" onClick={handleCardClosure} > 
                    <div className="float-menu-item-container">
                        <div className="item-icon-wrapper"><i className="feather-x-circle"></i></div>
                        <div className="item-text-wrapper">
                            <div className="item-desc">Close your card</div>
                        </div>
                        <div className="item-arrow-wrapper"><i className="feather-chevron-right"></i></div>
                    </div>
                </div>
                <div className="float-menu-item-wrapper" onClick={handleAboutCard} >
                    <div className="float-menu-item-container">
                        <div className="item-icon-wrapper"><i className="feather-alert-circle"></i></div>
                        <div className="item-text-wrapper">
                            <div className="item-desc">Know your fees and charges</div>
                        </div>
                        <div className="item-arrow-wrapper"><i className="feather-chevron-right"></i></div>
                    </div>
                </div>
                {customErrorMessage && (
                    <div className="text-danger">
                        <p>{customErrorMessage}</p>
                    </div>
                )}
            </div>
        </div>
    )
}