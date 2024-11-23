import React, { useState, useRef } from "react";
import "../../assets/styles/styles.css";

export function Mpin() {

  const [mPin, setMPin] = useState(["", "", "", ""]);
  const [mPinReEntry, setMPinReEntry] = useState(["", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const reEntryInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  const handlePinChange = (event, index) => {
    const newMPin = [...mPin];
    if (/^\d*$/.test(event.target.value) && event.target.value.length <= 1) {
      newMPin[index] = event.target.value;
      setMPin(newMPin);
      if (index > 0 && event.target.value === "") {
        inputRefs[index - 1].current.focus();
      } else if (index < 3 && event.target.value !== "") {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleReEntryPinChange = (event, index) => {
    const newMPinReEntry = [...mPinReEntry];
    if (
      /^\d*$/.test(event.target.value) &&
      event.target.value.length <= 1
    ) {
      newMPinReEntry[index] = event.target.value;
      setMPinReEntry(newMPinReEntry);
      if (index > 0 && event.target.value === "") {
        reEntryInputRefs[index - 1].current.focus();
      } else if (index < 3 && event.target.value !== "") {
        reEntryInputRefs[index + 1].current.focus();
      }
    }
  };

  const handleSetPin = () => {
    const pin = mPin.join("");
    const reEnteredPin = mPinReEntry.join("");
    if (pin === reEnteredPin && pin.length === 4) {
      setSuccessMsg("MPIN updated successfully!");
      setErrorMsg("");
    } else {
      setSuccessMsg("");
      setErrorMsg(
        "MPIN & Re-entered MPIN doesn't match. Please try again !!"
      );
    }
  };

  const arePinsFilled = mPin.every((digit) => digit !== "") && mPinReEntry.every((digit) => digit !== "");

  return (
    <div className="float-menu-wrapper">
      <div className="float-menu-body">
        <div className="set-pin-wrapper">
          <div className="set-pin-container">
            <div className="set-pin-item-wrapper">
              <label>Enter new MPin</label>
              <div className="set-pin-item-container">
                {mPin.map((digit, index) => (
                  <div class="pin-item">
                    <input
                      key={index}
                      type="numeric"
                      value={digit ? '*' : ''}
                      onChange={(event) => handlePinChange(event, index)}
                      ref={inputRefs[index]}
                      className="form-control"
                      inputMode="numeric"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="set-pin-item-wrapper">
              <label>Re-enter the new MPin</label>
              <div className="set-pin-item-container">
                {mPinReEntry.map((digit, index) => (
                  <div class="pin-item">
                    <input
                      key={index}
                      type="numeric"
                      maxLength="1"
                      value={digit ? '*' : ''}
                      onChange={(event) => handleReEntryPinChange(event, index)}
                      ref={reEntryInputRefs[index]}
                      className="form-control"
                      inputMode="numeric"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="set-pin-item-wrapper set-pin-btn-wrapper">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleSetPin}
                disabled={!arePinsFilled || mPin.join("").length !== 4}
              >
                Update MPIN
              </button>
              {successMsg && <div className="text-success">{successMsg}</div>}
              {errorMsg && <div className="text-danger">{errorMsg}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}