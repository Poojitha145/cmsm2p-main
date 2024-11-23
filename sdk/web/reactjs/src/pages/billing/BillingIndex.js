import React, { useState, useEffect } from 'react';
import { Header } from '../billing/components/header';
import { Menu } from '../billing/components/menu';
import { fetchDueDetails, fetchBillingDates } from '../../common/cms-sdk/index';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function BillingIndex({ onClose }) {
    const [errorMsg, setErrorMsg] = useState("");
    const [dueAmount, setDueAmount] = useState(0);
    const [billingDates, setBillingDates] = useState([]);
    const [currentStatementDate, setCurrentStatementDate] = useState(null);
    let [loading, setLoading] = useState(true);

    async function fetchDueAmount() {
        try {
            const dueData = await fetchDueDetails();
            setDueAmount(dueData?.totalDue);
            setCurrentStatementDate(dueData?.currentStatementDate);
        } catch (error) {
            setErrorMsg("Failed to fetch due amount");
            console.error("Error fetching due amount:", error);
        }
    }

    async function fetchDates() {
        try {
            const billingDatesResponse = await fetchBillingDates();
            if (billingDatesResponse && Array.isArray(billingDatesResponse)) {
                setBillingDates(billingDatesResponse);
            } else {
                console.error("Error: Unexpected API response format or missing data");
                setBillingDates([]);
            }
        } catch (error) {
            console.error("Error fetching billing dates:", error);
        }
    }


    // useEffect(() => {
    //     setLoading(true);
    //     fetchDueAmount();
    //     fetchDates();
    //     setLoading(false);
    // }, []);
    useEffect(() => {
        async function fetchData() {
            try {
                await Promise.all([fetchDueAmount(), fetchDates()]);
            } catch (error) {
            } finally {
                setLoading(false); 
            }
        }
        fetchData();
    }, []);

    return (
        <div onClick={onclose}>
            <Header />
            {
            loading ? (<div className="loader" >
                <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '3rem', color: '#e96341', position: 'absolute', left: '45%', top: '40%' }} />
            </div>) : (<>
            <Menu dueAmount={dueAmount} billingDates={billingDates} currentStatementDate={currentStatementDate} /></>)
        }
        </div>
    )
}
