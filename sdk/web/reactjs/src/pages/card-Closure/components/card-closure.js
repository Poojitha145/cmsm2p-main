import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardClose } from '../../../common/cms-sdk/index';

export function CardClosure(props) {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('');
    const [countdownMessage, setCountdownMessage] = useState('');
    const [isOptionSelected, setIsOptionSelected] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(true);

    useEffect(() => {
        setIsOptionSelected(selectedOption !== '');
    }, [selectedOption]);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSubmitButtonClick = () => {
        setIsButtonClicked(true);
        const timer = setTimeout(() => {
            setCountdownMessage("Request submitted successfully");
            setTimeout(() => {
                navigate(-1);
            }, 7000);
        }, 1000);
        return () => clearTimeout(timer);
    }

    // const handleContactSupportClick = () => {
    //     console.log("Submitting request with reason: ", selectedOption);
    //     setCountdownMessage("Thank you, Our support team will contact you in a while");
    //     const timer = setTimeout(() => {
    //         navigate(-1);
    //     }, 7000);
    //     return () => clearTimeout(timer);
    // };

    const handleContactSupportClick = async () => {
        try {
            // Call cardClose function with selected option as the body
            const response = await cardClose({reason: selectedOption});
            // Check if the request was successful
            if (response === true) {
                setCountdownMessage("Request submitted successfully");
                setTimeout(() => {
                    navigate(-1);
                }, 3000);
            } 
            // else {
            //     console.error("Request failed:", response);
            //     setCountdownMessage("Failed to submit request. Please try again.");
            // }
        } catch (error) {
            console.error("Error submitting request:", error);
            setCountdownMessage("Failed to submit request. Please try again.");
        }
    };

    return (
        <>
            <div className="float-menu-wrapper has-footer-btn">
                <div className="float-menu-body-auto-height">
                    <div className="text-box-group">
                        <div className="text-box-label">Submit close card request?</div>
                        <div className="text-box-desc">Dear customer, your satisfaction is important to us. If you still choose to close your card, please select a reason and our customer support team will assist you </div>
                    </div>

                    <div className="form-group ">
                        <button className="btn .btn-primary form-label" type="button" onClick={toggleDropdown} style={{ color: 'black', backgroundColor: 'white', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Tell us what is not working for you</span>
                            {isDropdownOpen ? (
                                <i className="feather-chevron-up"></i>
                            ) : (
                                <i className="feather-chevron-down"></i>
                            )}
                        </button>
                        {isDropdownOpen && (
                            <ul className="list-group">
                                <li className="list-group-item-borderless" style={{ cursor: 'pointer' }}>
                                    <input type="radio" name="closureReason" id="rewardSystem" className="form-check-input"
                                        onClick={() => handleOptionChange("I don't like the coin reward system")} />
                                    <label htmlFor="rewardSystem" style={{ marginLeft: '10px' }}>I don't like the coin reward system</label>
                                </li>
                                <li className="list-group-item-borderless" style={{ cursor: 'pointer' }}>
                                    <input type="radio" name="closureReason" id="secureCard" className="form-check-input"
                                        onClick={() => handleOptionChange("I don't find this card to be secure and safe")} />
                                    <label htmlFor="secureCard" style={{ marginLeft: '10px' }}>I don't find this card to be secure and safe</label>
                                </li>
                                <li className="list-group-item-borderless" style={{ cursor: 'pointer' }}>
                                    <input type="radio" name="closureReason" id="betterCard" className="form-check-input"
                                        onClick={() => handleOptionChange("I have found a better card")} />
                                    <label htmlFor="betterCard" style={{ marginLeft: '10px' }}>I have found a better card</label>
                                </li>
                                <li className="list-group-item-borderless" style={{ cursor: 'pointer' }}>
                                    <input type="radio" name="closureReason" id="highCharges" className="form-check-input"
                                        onClick={() => handleOptionChange("Card charges are too high")} />
                                    <label htmlFor="highCharges" style={{ marginLeft: '10px' }}>Card charges are too high</label>
                                </li>
                                <li className="list-group-item-borderless" style={{ cursor: 'pointer' }}>
                                    <input type="radio" name="closureReason" id="noOffers" className="form-check-input"
                                        onClick={() => handleOptionChange("Card does not offer on other apps")} />
                                    <label htmlFor="noOffers" style={{ marginLeft: '10px' }}>Card does not offer on other apps</label>
                                </li>
                                <li className="list-group-item-borderless" style={{ cursor: 'pointer' }}>
                                    <input type="radio" name="closureReason" id="notListed" className="form-check-input"
                                        onClick={() => handleOptionChange("Option is not listed here")} />
                                    <label htmlFor="notListed" style={{ marginLeft: '10px' }}>Option is not listed here</label>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
                {isDropdownOpen && (
                    <div className="footer-fixed-wrapper text-center">
                        {/* <button className="btn btn-primary btn-lg btn-circular footer-submitReq-btn" disabled={!isOptionSelected} onClick={handleSubmitButtonClick}>
                            Submit Request Form
                        </button> */}
                    </div>
                )}

                <div className="form-group text-center">
                    {countdownMessage && <div className="text-success">{countdownMessage}</div>}
                </div>

                <div className="footer-fixed-wrapper text-center">
                    <button className="btn btn-primary btn-lg btn-circular footer-submit-btn" onClick={handleContactSupportClick} disabled={!isOptionSelected}>
                        Contact Customer Support
                    </button>

                </div>
            </div>
        </>
    );
}
