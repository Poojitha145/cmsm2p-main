import React from 'react';
import '../../assets/styles/styles.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

export function Transactions(props) {
    const { transactionData = [] } = props;

    const navigate = useNavigate();

    const handleEmiTransaction = () => {
        navigate('/easy-emi')
    }
    return (
        <div class="transactions-wrapper">
            <div class="transactions-header">
                <h4 class="transactions-title">Transactions</h4>
                <div class="transactions-header-actions ms-auto">
                    <button class="btn"><i class="feather-chevron-right"></i></button>
                </div>
            </div>
            <div class="transactions-body">
                {transactionData.map((details, index) => (
                    <div class="transactions-item-wrapper" onClick={handleEmiTransaction}>
                        <div class="credited-card transactions-item-container">
                            <div class="item-icon-wrapper">
                                <div class={details?.transactionType === 'DEBIT' ? "item-icon-container-debit" : "item-icon-container-credit"}>
                                    <i class={details?.transactionType === 'DEBIT' ? 'fa-minus fa-solid' : 'fa-plus fa-solid'}></i>
                                </div>
                            </div>
                            <div class="item-text-wrapper">
                                <div class="item-name">{details?.description}</div>
                                <div class="item-time">{moment(details?.transactionDate).format('MMMM Do YYYY, h:mm:ss a')}</div>
                            </div>
                            <div class="item-value-wrapper">
                                <div class="item-total-value">
                                    <i class="fa-solid fa-indian-rupee-sign"></i>{details?.amount} <i class='fas fa-angle-right'></i>
                                </div>
                                {/* <div class="item-value">
                                    <span class="indicator">+</span><i class="fa-solid fa-indian-rupee-sign"></i>47.25
                                </div> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
                <div class="transactions-body">
                    <div class="transactions-item-wrapper" onClick={handleEmiTransaction}>
                        <div class="credited-card transactions-item-container">
                            <div class="item-icon-wrapper">
                                <div class="item-icon-container">
                                    <i class="fa-plus fa-solid"></i>
                                </div>
                            </div>
                            <div class="item-text-wrapper">
                                <div class="item-name">UPI/P2M/4578965487</div>
                                <div class="item-time">Today . 10:21 AM</div>
                            </div>
                            <div class="item-value-wrapper">
                                <div class="item-total-value">
                                    <i class="fa-solid fa-indian-rupee-sign"></i>81547.25 <i class='fas fa-angle-right'></i>
                                </div>
                                <div class="item-value">
                                    <span class="indicator">+</span><i class="fa-solid fa-indian-rupee-sign"></i>47.25
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="transactions-item-wrapper" onClick={handleEmiTransaction}>
                        <div class="debited-card transactions-item-container">
                            <div class="item-icon-wrapper">
                                <div class="item-icon-container">
                                    <i class="fa-minus fa-solid"></i>
                                </div>
                            </div>
                            <div class="item-text-wrapper">
                                <div class="item-name">UPI/P2M/4578965235</div>
                                <div class="item-time">Yesterday . 3:32 PM</div>
                            </div>
                            <div class="item-value-wrapper">
                                <div class="item-total-value">
                                    <i class="fa-solid fa-indian-rupee-sign"></i>81578.25 <i class='fas fa-angle-right'></i>
                                </div>
                                <div class="item-value">
                                    <span class="indicator">-</span><i class="fa-solid fa-indian-rupee-sign"></i>4.47
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="transactions-item-wrapper" onClick={handleEmiTransaction}>
                        <div class="pending-card transactions-item-container">
                            <div class="item-icon-wrapper">
                                <div class="item-icon-container">
                                    <i class="fa-clock fa-regular"></i>
                                </div>
                            </div>
                            <div class="item-text-wrapper">
                                <div class="item-name">UPI/P2M/4578965235</div>
                                <div class="item-time">Yesterday . 3:32 PM</div>
                            </div>
                            <div class="item-value-wrapper">
                                <div class="item-total-value">
                                    <i class="fa-solid fa-indian-rupee-sign"></i>81578.25 <i class='fas fa-angle-right'></i>
                                </div>
                                <div class="item-value">pending
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
    )
}
