import React, { useState } from 'react';
import '../../assets/styles/styles.css';

function Card(props) {
    let { cardDetails, limitDetails, cvvDetails } = props;
    const [cardVisible, setCardVisible] = useState(false);
    const [cvvVisible, setCvvVisible] = useState(false);

    const setValueCardVisible = () => {
        setCardVisible(true)
    }

    const handleVisibility = () => {
        setCvvVisible(!cvvVisible);
    }

    return (
        <div class="credit-wrapper">
            {cardVisible === false ?
                <div>
                    <div class="bank-text">Fedaral Bank</div>
                    <div class='balance-spent-value'><i class="fa fa-inr">&nbsp;</i>{limitDetails?.utilizedLimit} Spent</div>
                    <div class='balance-header-value'>Total Limit: <i class="fa fa-inr">&nbsp;</i>{limitDetails?.availableLimit}</div>
                    <img class='submit-button' onClick={setValueCardVisible} src={require('../../assets/img/card-icon.png')} alt='' />
                </div> :
                <div class="credit-container">
                    <div class="balance-wrapper">
                        <div class="balance-text">Current balance</div>
                        <div class="balance-value">
                            <i class="fa-solid fa-indian-rupee-sign"></i> {props.balance}
                        </div>
                    </div>
                    <div class="bottom-wrapper">
                        <div class="bottom-container">
                            <div class="bottom-left-wrapper">
                                <div class="card-number-wrapper">
                                    <span class="card-num-text">{cvvVisible === false ? cardDetails?.cardNo : 'XXXXXXXXXXXX' + cardDetails?.cardNo.substring(12, 16)}</span>
                                </div>
                                <div class="card-other-wrapper">
                                    <div class="cvv-wrapper">
                                        <div class="cvv-container">
                                            <div class="card-num-text cvv-label">
                                                CVV: {cvvVisible === true ? cvvDetails?.cvv : '***'}</div>
                                            <span><i class={cvvVisible === true ? "fa fa-eye-slash" : "fa fa-eye"} onClick={handleVisibility}></i></span>
                                        </div>
                                    </div>
                                    <div class="expiry-wrapper">
                                        <div class="expiry-container">
                                            <div class="card-num-text expiry-label">
                                                Expiry:</div>
                                            <span class="expiry-date">{cardDetails?.cardExpiry.substring(0, 2)}/{cardDetails?.cardExpiry.substring(2, 4)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bottom-right-wrapper">
                                <div class="visa-wrapper">{cardDetails?.networkType === 'VISA' ? < img src={require("../../assets/img/visa-logo.png")} alt='' /> : <img src={require("../../assets/img/Rupay-Logo.png")} alt='' style={{ width: '80px', height: '60px', paddingTop: '7px' }} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}

export default Card;