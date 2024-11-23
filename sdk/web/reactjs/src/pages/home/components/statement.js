import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/styles.css';

function Statement() {
    const navigate = useNavigate();

    const handleLatestStatement = () => {
        navigate('/statement-list')
    }

    return (
        <div class="status-wrapper">
                <button className="full-width-button" onClick={handleLatestStatement}>Latest Statement</button>
            </div>
    )
}

export default Statement