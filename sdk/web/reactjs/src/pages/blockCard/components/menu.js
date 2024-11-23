import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/styles.css';

export function Menu({ blockCardApiCall }) {
    const [buttonClick, setButtonClick] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    
    const navigate = useNavigate();

    const handleRadioClick = () => {
        setButtonClick(true);
    }

    const handleBlockCard = async () => {
        try {
            await blockCardApiCall();
            setShowSuccessMessage(true);
        } catch (error) {
            console.error('Error:', error);
            setShowErrorMessage(true);
            return;
        }
        setTimeout(() => {
            setShowSuccessMessage(false);
            setShowErrorMessage(false);
            navigate(-1);
        }, 3000);
    };

    return (
        <div className="float-menu-wrapper has-footer-button">
            <div className="float-menu-body block-card">
                <div className="form-group block-card-title">
                    <label className="form-label"><b>Block your card permanently</b></label>
                </div>
                <div className="form-group">
                    <label className="form-label">I want to block my card because:</label>
                    <div>
                        <div className="radio-box" >
                            <div className="form-check-radio">
                                <input type="radio" id="reason1" name="reason" className="form-check-input-radio" onClick={handleRadioClick}/>
                                <label htmlFor="reason1" className="form-check-label-radio">
                                    Lost my card
                                </label>
                            </div>
                        </div>
                        <div className="radio-box">
                            <div className="form-check-radio" >
                                <input type="radio" id="reason2" name="reason" className="form-check-input-radio" onClick={handleRadioClick}/>
                                <label htmlFor="reason2" className="form-check-label-radio">
                                    Card security is compromised
                                </label>
                            </div>
                        </div>
                        <div className="radio-box" >
                            <div className="form-check-radio">
                                <input type="radio" id="reason3" name="reason" className="form-check-input-radio" onClick={handleRadioClick}/>
                                <label htmlFor="reason3" className="form-check-label-radio">
                                    Card is damaged
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`footer-fixed-wrapper text-center `}>
                <button
                    className={`btn btn-primary btn-lg btn-circular footer-submit-btn `}
                    onClick={handleBlockCard}
                    disabled={!buttonClick}
                >
                    Confirm
                </button>
                {showSuccessMessage && (
                    <div className="text-success">
                        <p>Your card is blocked successfully!</p>
                    </div>
                )}
                {showErrorMessage && (
                    <div className="text-danger">
                        <p>Failed to block the card. Please try again later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}