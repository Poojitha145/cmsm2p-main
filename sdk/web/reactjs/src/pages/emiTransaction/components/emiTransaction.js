import React, { useState } from 'react';
import '../../assets/styles/styles.css';
// import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function ComparePlansComponent({ handleCloseComparePlans }) {
    const [isVisible, setIsVisible] = useState(true);

    const toggleVisibility = () => {
        console.log('toggleVisibility called');
        setIsVisible(!isVisible);
        handleCloseComparePlans();
    };
    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '16px' }}>Compare plans:</div>

            <div className="button-container">
                <div className="button">
                    <div>3</div>
                </div>
                <div className="button">
                    <div>6</div>
                </div>
                <div className="button button-expanded">
                    <div>9 months</div>
                </div>
                <div className="button">
                    <div>12</div>
                </div>
            </div>

            <div className="text-center mt-4">
                <p>Installments</p>
                <h2>₹756.46 <span><b> X 9 </b></span></h2>
            </div>

            <div className="total-payable-divider-card">
                <div className="d-flex justify-content-between">
                    <h1>Total payable <i className="fa-solid fa-chevron-up"></i></h1>
                    <h2>₹26,806.58</h2>
                </div>
                <hr style={{ borderTop: '2px solid #9c9c9c', margin: '10px 0' }} />
                <div className="d-flex justify-content-between">
                    <p>Transaction amount</p>
                    <p>₹26,046.00</p>
                </div>
                <div className="d-flex justify-content-between">
                    <p>Interest charged at <b>16% p.a.</b></p>
                    <p>₹545.56</p>
                </div>
                <div className="d-flex justify-content-between">
                    <p>GST on interest <b>(18%)</b></p>
                    <p>₹98.20</p>
                </div>
                <div className="d-flex justify-content-between">
                    <p>Processing fee</p>
                    <p>₹99.00</p>
                </div>
                <div className="d-flex justify-content-between">
                    <p>GST on Processing fee <b>(18%)</b></p>
                    <p>₹17.82</p>
                </div>
            </div>

            <div className="text-bold d-flex justify-content-between emi-cancellation-card">
                <div>EMI cancellation fee</div>
                <div><i className="fa-solid fa-chevron-down"></i></div>
            </div>

            <div className="terms-and-conditions-container">
                <input type="checkbox" id="termsCheckbox" />
                <label htmlFor="termsCheckbox" style={{ marginLeft: '15px' }}>I have read, understood, and accept the <button
                    style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>terms and conditions</button> and the <button
                        style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>key fact sheet</button></label>
            </div>

            <button className="emi-full-width-button">Convert to 9-month EMI</button>
            <div className="emi-full-width-button-chevron" onClick={toggleVisibility}>
                <i className={`fa-solid fa-chevron-up ${isVisible ? 'active' : ''}`} style={{ border: 'none', verticalAlign: 'middle' }}></i>
            </div>

        </div>
    );
}
export function EmiTransaction(props) {
    const [showComparePlans, setShowComparePlans] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);

    const handleOnClick = () => {
        setShowComparePlans(!showComparePlans);
        setIsButtonVisible(false); // Hide the button when clicked
    };

    const handleCloseComparePlans = () => {
        setShowComparePlans(false);
        setIsButtonVisible(true); // Show the "Compare plans" button
    };


    const { transactionDetail = [] } = props;

    return (
        <div style={{ maxHeight: '100vh', overflow: 'auto' }}>
            <div className="transaction-card-container">
                <div className="d-flex">
                    <div className="transaction-icon-circle default">S</div>
                    <div>
                        <h2 className="transaction-container-heading">{transactionDetail?.description}</h2>
                        <p className="transaction-container-time">{moment(transactionDetail?.transactionDate).format('MMMM Do YYYY, h:mm:ss a')}</p>
                    </div>
                </div>
                <div>

                    <div className="text-right transaction-container-amount">&#8377;{transactionDetail?.amount}</div>
                </div>
            </div>

            <div>
                <div className="transaction-divider-section">
                    <div style={{ width: '50%' }}>
                        <p className="transaction-divider-title">Transaction status</p>
                        <p>(Usually takes 2-3 working days to reflect in your account)</p>
                    </div>
                    <p className="pending-settlement">{transactionDetail?.authorizationStatus}</p>
                </div>
                <div className="transaction-divider-section">
                    <p className="transaction-divider-title">Billing status</p>
                    <p className="transaction-divider-content">{transactionDetail?.billedStatus}</p>
                </div>

                <div className="transaction-divider-section">
                    <p className="transaction-divider-title">Transaction ID</p>
                    <div style={{ width: '50%', whiteSpace: 'wrap' }}>
                        <p className="transaction-divider-content">
                            {transactionDetail?.externalTransactionId} <i className="fa-regular fa-copy copy-icon"></i>
                        </p></div>
                </div>

                {/* <hr className="divider" /> */}
                <div>
                        <div className="emi-card-container">
                            <div className="d-flex flex-column justify-content-around emi-card-section">
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', paddingBottom: '20px' }}>easy emi</h2>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    {isButtonVisible && (
                                        <button type="button" className="btn btn-outline-light" onClick={handleOnClick}>
                                            Compare plans <i className="fa-solid fa-chevron-down"></i>
                                        </button>
                                    )}
                                    {showComparePlans && <ComparePlansComponent handleCloseComparePlans={handleCloseComparePlans} />}
                                </div>
                            </div>

                            {isButtonVisible && (
                                <div className="d-flex justify-content-between emi-card-footer">
                                    <div>
                                        <i className="fa-regular fa-clock"></i>&nbsp;&nbsp;Avail EMI once transaction is settled.
                                        It can take 2-3 working days.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
            </div>
        </div>
    );
}