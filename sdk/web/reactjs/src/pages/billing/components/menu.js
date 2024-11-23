import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/styles.css';

import { fetchUpdateStatement } from '../../../common/cms-sdk';

export function Menu(props) {
    const { currentStatementDate } = props;
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [buttonClick, setButtonClick] = useState(false);
    const [nextBillingDueDate, setNextBillingDueDate] = useState("");
    const [formattedCurrentDate, setFormattedCurrentDate] = useState("");
    const [selectedBillingDate, setSelectedBillingDate] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        if (currentStatementDate) {
            const currentDate = new Date(currentStatementDate);
            const nextDueDate = new Date(currentDate);
            nextDueDate.setDate(nextDueDate.getDate() + 18);

            if (nextDueDate.getMonth() !== currentDate.getMonth()) {
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            }

            const formattedCurrent = getDateWithOrdinal(currentDate.getDate());
            const formattedNextDueDate = getDateWithOrdinal(nextDueDate.getDate());

            setFormattedCurrentDate(formattedCurrent);
            setNextBillingDueDate(formattedNextDueDate);
        }
    }, [currentStatementDate]);

    async function handleConfirmUpdateBillingDate() {
        try {
            const updateStatementResponse = await fetchUpdateStatement({ "stmtDate": selectedBillingDate });
            if (updateStatementResponse) {
                setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                navigate(-1);
            }, 3000);
            } 
            // else {
            // }
        } catch (error) {
            console.error("Error updating Statement:", error);
        }
    }

    const handleRadioClick = (billingDate) => {
        setButtonClick(true);
        setSelectedBillingDate(billingDate);
    }

    function getDateWithOrdinal(date) {
        const n = parseInt(date);
        if (n >= 11 && n <= 13) {
            return n + "th";
        }
        switch (n % 10) {
            case 1:
                return n + "st";
            case 2:
                return n + "nd";
            case 3:
                return n + "rd";
            default:
                return n + "th";
        }
    }

    return (
        <div className="float-menu-wrapper has-footer-btn">
            <div className="float-menu-body has-padding change-billing">
                <div className="form-group">
                    <label className="form-label">Current billing cycle:</label>
                    {currentStatementDate ? (
                        <p>Billing cycle starts on {formattedCurrentDate} of every month. {formattedCurrentDate > nextBillingDueDate ? 'Pay by ' + nextBillingDueDate + ' of the next month.' : 'Pay by ' + nextBillingDueDate + ' of the same month.'}</p>
                    ) : (
                        <p>Billing cycle is not chosen. Please choose a billing cycle</p>
                    )}
                </div>
                {props.dueAmount > 0 && (
                    <div className="text-warning">
                        <div className="icon"><i className="feather-alert-circle"></i></div>
                        <div className="text">Please clear your total outstanding amount to change your billing cycle.</div>
                    </div>
                )}
                <div className="form-group">
                    <label className="form-label">Upcoming billing cycles you can choose from:</label>
                    <div>
                        {props.billingDates.map((dateObj, index) => (
                            <div key={index} className="radio-box">
                                <div className="form-check-radio">
                                    <input
                                        type="radio"
                                        name="billingCycle"
                                        id={`billingCycle${index + 1}`}
                                        className="form-check-input-radio"
                                        onClick={() => handleRadioClick(dateObj?.billingDate)}
                                        disabled={props.dueAmount > 0 || !(dateObj?.eligible)}
                                    />
                                    <label
                                        htmlFor={`billingCycle${index + 1}`}
                                        className="form-check-label-radio"
                                    >
                                        Billing cycle starts on {getDateWithOrdinal(dateObj?.billingDate)} of every month. {dateObj?.billingDate > dateObj?.paymentDate ? 'Pay by ' + getDateWithOrdinal(dateObj?.paymentDate) + ' of the next month.' : 'Pay by ' + getDateWithOrdinal(dateObj?.paymentDate) + ' of the same month.'}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showSuccessMessage && (<div className="text-success">
                <p>Billing statement date is successfully updated !</p>
            </div>)}
            <div className="footer-fixed-wrapper text-center">
                <button
                    className="btn btn-primary btn-lg btn-circular footer-submit-btn"
                    disabled={!(buttonClick) || props.dueAmount > 0}
                    onClick={handleConfirmUpdateBillingDate}
                >
                    Confirm
                </button>
            </div>
        </div>
    )
}
