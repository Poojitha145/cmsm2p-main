import React from 'react';
import { useNavigate } from "react-router-dom";
import '../../assets/styles/styles.css';

export function Menu() {
    const navigate = useNavigate();

    const handleLatestStatement = () => {
        navigate('/statement-details')
    }
    return (
        <div className="statement-container">
            <div className="statement-header-wrapper">
                <div className="statement-section">
                    
                    <p>View or download all your statements here</p>
                </div>
            </div>

            <h4 className="statement-heading">Latest Statement</h4>
            <div className="custom-card" onClick={handleLatestStatement}>
                <div className="duration">5th Feb 2024 - 4th Mar 2024</div>

                <div className="statement-details d-flex align-items-center">
                    <div className="icon-container">
                        <i className="fa-regular fa-credit-card"></i>
                    </div>
                    <div className="amount">&#8377;2,521.00</div>
                    {/* <button className="btn btn-primary pay-now-btn">Pay Now</button> */}
                </div>
                {/* <div className="bill-due-info">Bill due on 10th Feb 2024</div> */}
                <div className="bill-info">Bill paid fully on 6th Mar 2024</div>
            </div>

            <h4 className="statement-heading past-statement-heading">Past Statements</h4>
            <div className="custom-card">
                <div className="duration">5th Jan 2024 - 4th Feb 2024</div>

                <div className="statement-details d-flex align-items-center">
                    <div className="icon-container">
                        <i className="fa-regular fa-credit-card"></i>
                    </div>
                    <div className="amount">&#8377;16,986.21</div>
                </div>
                <div className="bill-info">Bill paid fully on 14th Feb 2024</div>
            </div>

            <div className="custom-card">
                <div className="duration">5th Dec 2023 - 4th Jan 2024</div>

                <div className="statement-details d-flex align-items-center">
                    <div className="icon-container">
                        <i className="fa-regular fa-credit-card"></i>
                    </div>
                    <div className="amount">&#8377;1,587.00</div>
                </div>
                <div className="bill-info">Bill paid fully on 4th Jan 2023</div>
            </div>

            <div className="custom-card">
                <div className="duration">5th Nov 2023 - 4th Dec 2023</div>

                <div className="statement-details d-flex align-items-center">
                    <div className="icon-container">
                        <i className="fa-regular fa-credit-card"></i>
                    </div>
                    <div className="amount">&#8377;66,915.00</div>
                </div>
                <div className="bill-info">Bill paid fully on 9th Dec 2023</div>
            </div>

        </div>
    );
}