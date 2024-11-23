import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePreference } from '../../../common/cms-sdk';

export function International( {internationalPreferences} ) {
  const navigate = useNavigate();
  const [onlineDefaultLimit, setOnlineDefaultLimit] = useState(111);
  const [offlineDefaultLimit, setOfflineDefaultLimit] = useState(111);

  // Derive constant values from internationalPreferences
  const limitConfig = internationalPreferences ? internationalPreferences.limitConfig : [];
  const onlineMaxAmount = parseInt(limitConfig.find(config => config.txnType === "ECOM")?.maxAmount) || 95000;
  const onlineMinAmount = parseInt(limitConfig.find(config => config.txnType === "ECOM")?.dailyLimitCnt) || 0;
  // const onlineMaxAmount = 95000;
  // const onlineMinAmount = 0;
  const offlineMaxAmount = parseInt(limitConfig.find(config => config.txnType === "POS")?.maxAmount) || 95000;
  const offlineMinAmount = parseInt(limitConfig.find(config => config.txnType === "POS")?.dailyLimitCnt) || 0;
  const atmMaxAmount = parseInt(limitConfig.find(config => config.txnType === "ATM")?.maxAmount) || 95000;

  // const [transactions, setTransactions] = useState(initialTransactionState);
  const [successMessage, setSuccessMessage] = useState('');

  const [transactions, setTransactions] = useState(() => {
    if (internationalPreferences) {
      setOnlineDefaultLimit(parseInt(internationalPreferences.limitConfig.find(config => config.txnType === "ECOM")?.dailyLimitValue));
      setOfflineDefaultLimit(parseInt(internationalPreferences.limitConfig.find(config => config.txnType === "POS")?.dailyLimitValue));

      return {
        online: { enabled: internationalPreferences.ecom, limit: onlineDefaultLimit },
        offline: { enabled: internationalPreferences.pos, limit: offlineDefaultLimit },
        allowATMLimit: internationalPreferences.atm,
        contactless: internationalPreferences.contactless,
      };
    } else {
      return {
        online: { enabled: true, limit: 11000 },
        offline: { enabled: true, limit: 11000 },
        allowATMLimit: true,
        contactless: true,
      };
    }
  });

  const minLimitForTransaction = (transactionType) => {
    switch (transactionType) {
      case 'online':
        return onlineMinAmount; // Use minValue for online transactions
      case 'offline':
        return offlineMinAmount; // Use minValue for offline transactions
      default:
        return 0; // Use minValue for other transactions
    }
  };

  const maxLimitForTransaction = (transactionType) => {
    switch (transactionType) {
      case 'online':
        return onlineMaxAmount;
      case 'offline':
        return offlineMaxAmount;
      default:
        return 95000;
    }
  };

  const handleToggle = (field) => {
    setTransactions(prevState => {
      if (typeof prevState[field] === 'boolean') {
        return { ...prevState, [field]: !prevState[field] };
      } else {
        return {
          ...prevState,
          [field]: { ...prevState[field], enabled: !prevState[field].enabled }
        };
      }
    });
  };

  const handleChangeLimit = (field, value) => {
    let newValue = parseInt(value, 10);
    const minLimit = minLimitForTransaction(field);
    const maxLimit = maxLimitForTransaction(field);
    if (isNaN(newValue) || newValue < minLimit) {
      newValue = minLimit;
    } else if (newValue > maxLimit) {
      newValue = maxLimit;
    }

    setTransactions(prevState => ({
      ...prevState,
      [field]: { ...prevState[field], limit: newValue }
    }));
  };

  const handleConfirm = async () => {
    try {
      const body = {
        international: {
          "atm": transactions.allowATMLimit.enabled,
          "ecom": transactions.online.enabled,
          "pos": transactions.offline.enabled,
          "contactless": transactions.contactless
          // "limitConfig": []
        }
      }
      // Calling updatePreference() with changed values as body
      const response = await updatePreference(body);
      if (response === true) {
        setSuccessMessage('Successfully Set.');
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      } else {
        console.error("Request failed: ", response);
        // setFailureMessage("Failed to Update the values. Please try again in some time");
        setTimeout(() => {
        }, 5000);
      }
    } catch (error) {
      console.error("Error updating the values: ", error);
      // setFailureMessage("Failed to Update the values. Please try again in some time");
    }
  }

  return (
    <div>
      {/* Render input fields and range sliders for online transactions */}
      <div className="form-group">
        <div className="d-flex align-items-end pb-2">
          <label className="form-label mb-0">Online Transactions</label>
          <div className="flex-auto ms-auto">
            <div className="form-check form-switch form-switch-lg">
              <input
                type="checkbox"
                role="switch"
                id="onlineSwitch"
                className="form-check-input"
                checked={transactions.online.enabled}
                onChange={() => handleToggle('online')}
              />
              <label htmlFor="onlineSwitch" className="form-check-label"></label>
            </div>
          </div>
        </div>
        {transactions.online.enabled && (
          <>
            <div className="currency-input-wrapper">
              <span className="currency-icon-wrapper">
                <i className="fa-solid fa-indian-rupee-sign"></i>
              </span>
              <input
                type="number"
                value={onlineDefaultLimit}
                className="form-control form-control-200"
                onChange={(e) => setOnlineDefaultLimit(e.target.value)} // Update input value
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && e.target.value.length === 1) {
                    handleChangeLimit('online', 0);
                  }
                }}
              />
            </div>
            <div className="range-slider-wrapper">
              <div className="range-slider-value-wrapper">
                <div className="slider-value-item-wrapper">
                  <i className="fa-solid fa-indian-rupee-sign"></i>{onlineMinAmount}
                </div>
                <div className="slider-value-item-wrapper ms-auto">
                  <i className="fa-solid fa-indian-rupee-sign"></i>{onlineMaxAmount}
                </div>
              </div>
              <input
                type="range"
                id="customRange1"
                className="form-range"
                min={onlineMinAmount || 0}
                max={onlineMaxAmount || 95000}
                value={onlineDefaultLimit}
                onChange={(e) => setOnlineDefaultLimit(e.target.value)} // Update slider value
              />
            </div>
          </>
        )}
      </div>

      {/* Render input fields and range sliders for offline transactions */}
      <div className="form-group">
        <div className="d-flex align-items-end pb-2">
          <label className="form-label mb-0">Offline Transactions</label>
          <div className="flex-auto ms-auto">
            <div className="form-check form-switch form-switch-lg">
              <input
                type="checkbox"
                role="switch"
                id="offlineSwitch"
                className="form-check-input"
                checked={transactions.offline.enabled}
                onChange={() => handleToggle('offline')}
              />
              <label htmlFor="offlineSwitch" className="form-check-label"></label>
            </div>
          </div>
        </div>
        {transactions.offline.enabled && (
          <>
            <div className="currency-input-wrapper">
              <span className="currency-icon-wrapper">
                <i className="fa-solid fa-indian-rupee-sign"></i>
              </span>
              <input
                type="number"
                value={offlineDefaultLimit}
                className="form-control form-control-200"
                onChange={(e) => setOfflineDefaultLimit(e.target.value)} // Update input value
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && e.target.value.length === 1) {
                    handleChangeLimit('offline', 0);
                  }
                }}
              />
            </div>
            <div className="range-slider-wrapper">
              <div className="range-slider-value-wrapper">
                <div className="slider-value-item-wrapper">
                  <i className="fa-solid fa-indian-rupee-sign"></i>{offlineMinAmount}
                </div>
                <div className="slider-value-item-wrapper ms-auto">
                  <i className="fa-solid fa-indian-rupee-sign"></i>{offlineMaxAmount}
                </div>
              </div>
              <input
                type="range"
                id="customRange2"
                className="form-range"
                min={offlineMinAmount || 0}
                max={offlineMaxAmount || 95000}
                value={offlineDefaultLimit}
                onChange={(e) => setOfflineDefaultLimit(e.target.value)} // Update slider value
              />
            </div>
          </>
        )}
      </div>

      {/* Render input fields and range sliders for allowATMLimit */}
      <div className="form-group">
        <div className="d-flex align-items-end pb-2">
          <label className="form-label mb-0">Allow and Set ATM Limit</label>
          <div className="flex-auto ms-auto">
            <div className="form-check form-switch form-switch-lg">
              <input
                type="checkbox"
                role="switch"
                id="allowATMLimitSwitch"
                className="form-check-input"
                checked={transactions.allowATMLimit}
                onChange={() => handleToggle('allowATMLimit')}
              />
              <label htmlFor="allowATMLimitSwitch" className="form-check-label"></label>
            </div>
          </div>
        </div>
        <div className="text-box-desc small "> Withdrawal limit: <i className="fa-solid fa-indian-rupee-sign"></i> {atmMaxAmount}
        </div>
        {/* You can add input fields and range sliders here if needed */}
      </div>

      {/* Render input fields and range sliders for contactless transactions */}
      <div className="form-group">
        <div className="d-flex align-items-end pb-2">
          <label className="form-label mb-0">Contactless Transactions</label>
          <div className="flex-auto ms-auto">
            <div className="form-check form-switch form-switch-lg">
              <input
                type="checkbox"
                role="switch"
                id="contactlessSwitch"
                className="form-check-input"
                checked={transactions.contactless}
                onChange={() => handleToggle('contactless')}
              />
              <label htmlFor="contactlessSwitch" className="form-check-label"></label>
            </div>
          </div>
        </div>
        {/* You can add input fields and range sliders here if needed */}
      </div>

      {/* Render input fields and range sliders for creditOverlimit */}
      {/* <div className="form-group"> */}
      {/* <div className="d-flex align-items-end pb-2">
          <label className="form-label mb-0">Credit Overlimit</label>
          <div className="flex-auto ms-auto">
            <div className="form-check form-switch form-switch-lg">
              <input
                type="checkbox"
                role="switch"
                id="creditOverlimitSwitch"
                className="form-check-input"
                checked={transactions.creditOverlimit}
                onChange={() => handleToggle('creditOverlimit')}
              />
              <label htmlFor="creditOverlimitSwitch" className="form-check-label"></label>
            </div>
          </div>
        </div> */}
      {/* You can add input fields and range sliders here if needed */}
      {/* </div> */}


      <div className="footer-fixed-wrapper text-center">
        <button className="btn btn-primary btn-lg btn-circular footer-submit-btn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
      {successMessage && <div className="text-success">{successMessage}</div>}
    </div>
  );
}