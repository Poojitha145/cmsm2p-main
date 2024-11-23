import React, { useState } from 'react'
import '../../assets/styles/styles.css';

function CardStatus(props) {
    const [statusValue, setStatusValue] = useState('Check Status');
    const { cardDetails } = props;

    const getStatus = () => {
        setStatusValue((statusValue === 'Check Status') ? cardDetails?.status : 'Check Status');
    }
    return (
        <div class="status-wrapper">
            <div class="status-container">
                <div class="status-title">Physical Card Status</div>
                <button class="btn btn-primary" onClick={getStatus}>{statusValue}</button>
            </div>
        </div>
    )
}

export default CardStatus