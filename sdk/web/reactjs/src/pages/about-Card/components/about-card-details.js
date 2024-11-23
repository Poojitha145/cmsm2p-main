import React from "react";

export function AboutCard() {
    return (
        <>
            <div className="card-name-container">
                <h2>Card name</h2>
                <h3>UNITY CARD</h3>
            </div>

            <div className="about-card-scrollable-body">
                <div className="about-card-container">
                    <h2>Let's talk fees</h2>
                    <div className="about-card-inner-container about-card-fee-container">
                        <div className="about-card-icon-container">0</div>
                        <div className="about-card-text-container">
                            <h2>Zero joining fees</h2>
                            <p>Pay nothing when you join</p>
                        </div>
                    </div>
                    <div className="about-card-inner-container about-card-fee-container">
                        <div className="about-card-icon-container">0</div>
                        <div className="about-card-text-container">
                            <h2>No annual renewal fees</h2>
                            <p>Enjoy the card year on year, at no cost</p>
                        </div>
                    </div>
                    <div className="about-card-inner-container about-card-fee-container">
                        <div className="about-card-icon-container">0</div>
                        <div className="about-card-text-container">
                            <h2>Zero forex markup</h2>
                            <p>Swipe for no extra fees</p>
                        </div>
                    </div>
                </div>

                <div className="about-card-container">
                    <h2>Let's talk payments</h2>
                    <div className="about-card-inner-container about-card-payment-container">
                        <div className="about-card-icon-container">48</div>
                        <div className="about-card-text-container">
                            <h2>Get up to 48 days of no interest</h2>
                            <p>With a billing cycle of 30 days & payment period of 18 days</p>
                        </div>
                    </div>
                    <div className="about-card-inner-container about-card-payment-container">
                        <div className="about-card-icon-container">16%</div>
                        <div className="about-card-text-container">
                            <h2>Convert to EMIs</h2>
                            <p>
                                A 16% interest rate is applicable for 3, 6, 9, 12 month tenures
                            </p>
                        </div>
                    </div>
                    <div className="about-card-inner-container about-card-payment-container">
                        <div className="about-card-icon-container">3.49%</div>
                        <div className="about-card-text-container">
                            <h2>Pay at your pace at 3.49%</h2>
                            <p>
                                Can't pay the due within 48 days? Pay slowly, at an interest of
                                3.49% per month
                            </p>
                        </div>
                    </div>
                    <div className="about-card-inner-container about-card-payment-container">
                        <div className="about-card-icon-container">5%</div>
                        <div className="about-card-text-container">
                            <h2>Minimum amount due</h2>
                            <p>Pay 5% of your outstanding amount + other charges</p>
                        </div>
                    </div>
                    <div className="about-card-inner-container about-card-payment-container">
                        <div className="about-card-icon-container">&#8377;</div>
                        <div className="about-card-text-container">
                            <h2>Late payment charges</h2>
                            <p>Late payment charges depend on balance due</p>
                            <a href="#">See details</a>
                        </div>
                    </div>
                </div>

                <div className="about-card-container">
                    <h2>Need cash? No problem!</h2>
                    <div className="about-card-inner-container about-card-cash-container">
                        <div className="about-card-icon-container">&#8377;</div>
                        <div className="about-card-text-container">
                            <h2>SOS! I need to withdraw cash</h2>
                            <p>Go ahead, withdraw up to 10% of your approved credit limit</p>
                        </div>
                    </div>
                    <div className="about-card-inner-container about-card-cash-container">
                        <div className="about-card-icon-container">&#8377;</div>
                        <div className="about-card-text-container">
                            <h2>Cash withdrawal fee</h2>
                            <p>2.5% of amount withdrawn, at a minimum of &#8377;500</p>
                        </div>
                    </div>
                    <div className="about-card-inner-container about-card-cash-container">
                        <div className="about-card-icon-container">%</div>
                        <div className="about-card-text-container">
                            <h2>Cash withdrawal interest</h2>
                            <p>3.49% per month from the date of withdrawal</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
