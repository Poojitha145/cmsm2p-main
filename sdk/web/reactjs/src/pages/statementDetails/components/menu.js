import React from 'react';
import '../../assets/styles/styles.css';

export function Menu(props) {
    const { statementData = [] } = props;
    return (
        <body>
    <div class="bill-status-section">
        <p class="bill-status"><span class = "green-text"><i class="fas fa-check-circle"></i> Bill paid fully on 6th Mar 2024</span></p>
    </div>

    <div class="payment-details-section">
        <div class="payment-total-due">
            <h4>Total due</h4>
            <p class="amount-total-due-amount">&#8377;{statementData.totalCreditAmount}</p>
        </div>
        <div class="payment-minimum-due">
            <h4>Minimum due</h4>
            <p class="amount-minimum-due-amount">&#8377;{statementData.minimumDueAmount}</p>
        </div>
        <div class="payment-amount-paid">
            <h4>Amount paid</h4>
            <p class="amount-paid-amount green-text">+ &#8377;{statementData.totalDebitAmount}</p>
        </div>
    </div>          
</body>
   );
}