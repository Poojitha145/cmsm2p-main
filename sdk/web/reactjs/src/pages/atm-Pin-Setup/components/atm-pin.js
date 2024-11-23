import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

export function SetupNewPIN(props) {
  const navigate = useNavigate();
  const { setNewPinApiCall } = props;
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinConfirmation, setPinConfirmation] = useState(["", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showConfirmationError, setShowConfirmationError] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];
  const confirmationInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);

  useEffect(() => {
    checkPinEquality();
  }, [pin, pinConfirmation]);

  const checkPinEquality = () => {
    const isPinEqual = pin.join("") === pinConfirmation.join("");
    setIsButtonEnabled(isPinEqual && pin.join("").length === 4);
    setShowConfirmationError(!isPinEqual && pin.join("").length === 4 && pinConfirmation.join("").length === 4);
  };

  const handlePinChange = (index, value) => {
    const newPin = [...pin];
    if (/^\d*$/.test(value) && value.length <= 1) {
      newPin[index] = value;
      setPin(newPin);
      if (index === 3 && value !== "") {
        confirmationInputRefs[0].current.focus();
      } else if (index < 3 && value !== "") {
        inputRefs[index + 1].current.focus();
      } else if (index > 0 && value === "") {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const handlePinConfirmationChange = (index, value) => {
    const newPinConfirmation = [...pinConfirmation];
    if (/^\d*$/.test(value) && value.length <= 1) {
      newPinConfirmation[index] = value;
      setPinConfirmation(newPinConfirmation);
      if (index > 0 && value === "") {
        confirmationInputRefs[index - 1].current.focus();
      } else if (index < 3 && value !== "") {
        confirmationInputRefs[index + 1].current.focus();
      }
    }
  };

  const handleSetPin = async () => {
    const enteredPin = pin.join("");
    const apiResponse = await setNewPinApiCall(enteredPin);
    if (apiResponse?.status === true) {
      setPin(["", "", "", ""]);
      setPinConfirmation(["", "", "", ""]);
      setSuccessMsg("PIN updated successfully!");
      setErrorMsg("");
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } else {
      setPin(["", "", "", ""]);
      setPinConfirmation(["", "", "", ""]);
      setSuccessMsg("");
      setErrorMsg("Failed to update PIN. <br>Please try again !!");
    }
    // Blur the focus from input fields on click of Update Pin button or enter Key on keyboard
    confirmationInputRefs.forEach(ref => ref.current.blur());
  };

  const handleEnterKeyPress = event => {
    if (
      event.key === "Enter" &&
      pin.every(digit => digit !== "") &&
      pinConfirmation.every(digit => digit !== "") &&
      pin.join("").length === 4 &&
      pinConfirmation.join("").length === 4
    ) {
      handleSetPin();
    }
  };

  const handleBackspace = useCallback((index, pinArray, setPinArray, refsArray) => {
    const newPin = [...pinArray];
    newPin[index] = "";
    setPinArray(newPin);
    if (index === 0) {
      refsArray[index].current.focus();
    } else if (refsArray[index - 1]) {
      refsArray[index - 1].current.focus();
    }
  }, []);

  return (
    <div className="float-menu-wrapper">
      <div className="float-menu-body">
        <div className="set-pin-wrapper">
          <div className="set-pin-container">
            <div className="set-pin-item-wrapper">
              <label>Enter New PIN</label>
              <div className="set-pin-item-container">
                {pin.map((digit, index) => (
                  <div className="pin-item" key={index}>
                    <input
                      type="numeric"
                      value={digit ? "*" : ""}
                      onChange={e => handlePinChange(index, e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Backspace") {
                          e.preventDefault();
                          handleBackspace(index, pin, setPin, inputRefs);
                        } else {
                          handleEnterKeyPress(e);
                        }
                      }}
                      ref={inputRefs[index]}
                      className="form-control"
                      inputMode="numeric"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="set-pin-item-wrapper">
              <label>Re-enter New PIN</label>
              <div className="set-pin-item-container">
                {pinConfirmation.map((digit, index) => (
                  <div className="pin-item" key={index}>
                    <input
                      type="numeric"
                      value={digit ? "*" : ""}
                      onChange={e =>
                        handlePinConfirmationChange(index, e.target.value)
                      }
                      onKeyDown={e => {
                        if (e.key === "Backspace") {
                          e.preventDefault();
                          handleBackspace(index, pinConfirmation, setPinConfirmation, confirmationInputRefs);
                        } else {
                          handleEnterKeyPress(e);
                        }
                      }}
                      ref={confirmationInputRefs[index]}
                      className="form-control"
                      inputMode="numeric"
                    />
                  </div>
                ))}
              </div>
              {showConfirmationError && (
                <div className="text-danger">Entered PIN & Re-entered PIN do not match.</div>
              )}
            </div>
            <div className="set-pin-item-wrapper set-pin-btn-wrapper">
              <button
                className="btn btn-primary btn-lg btn-circular footer-submit-btn"
                onClick={handleSetPin}
                disabled={!isButtonEnabled}
              >
                Update PIN
              </button>
              {successMsg && (
                <div className="text-success">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="text-danger" dangerouslySetInnerHTML={{ __html: errorMsg }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
