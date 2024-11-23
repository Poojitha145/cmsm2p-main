import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cmsUserAuthenticate } from '../../../common/cms-sdk/index';

export const Login = () => {
  const [mPin, setMPin] = useState(["", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loginDisabled, setLoginDisabled] = useState(true);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerValue, setTimerValue] = useState(0);

  const inputRefs = useRef([]);
  const submitButtonRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  useEffect(() => {
    const canLogin = (!timerRunning && !firstAttempt && mPin.every(digit => digit !== "") && mPin.length === 4) || (firstAttempt && mPin.every(digit => digit !== ""));
    setLoginDisabled(!canLogin);
  }, [timerRunning, firstAttempt, mPin]);

  const handlePinChange = useCallback((index, value) => {
    if (timerRunning) return;
    const newMPin = [...mPin];
    newMPin[index] = value;
    setMPin(newMPin);
    if (value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (value !== "" && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  }, [timerRunning, mPin]);

  const handleBackspace = useCallback((index) => {
    if (index === 0) {
      const newMPin = [...mPin];
      newMPin[index] = "";
      setMPin(newMPin);
    } else {
      const newMPin = [...mPin];
      newMPin[index] = "";
      setMPin(newMPin);
      inputRefs.current[index - 1].focus();
    }
  }, [timerRunning, mPin]);
  
  const handleLogin = useCallback(async () => {
    setFirstAttempt(false);
    const authenticateUser = await cmsUserAuthenticate(mPin.join(''));
    if (authenticateUser === true) {
      setSuccessMsg("Login successful.");
      navigate('/card-details');
    } else {
      setErrorMsg("Incorrect MPIN.");
      setMPin(["", "", "", ""]);
      setLoginDisabled(true);
      setTimerRunning(true);
      setTimerValue(7);
      const timerInterval = setInterval(() => {
        setTimerValue(prevValue => prevValue - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(timerInterval);
        setTimerRunning(false);
        setErrorMsg("");
      }, 7000);
    }
  }, [mPin, navigate]);

  useEffect(() => {
    if (!timerRunning) {
      inputRefs.current[0].focus();
    }
  }, [timerRunning]);

  const handleEnterKeyPress = useCallback((event) => {
    if (event.key === 'Enter' && !loginDisabled) {
      handleLogin();
    }
  }, [loginDisabled, handleLogin]);

  const pinInputs = useMemo(() => (
    mPin.map((digit, index) => (
      <div className="pin-item" key={index}>
        <input
          type="numeric"
          value={digit ? '*' : ''}
          maxLength={1}
          onChange={(e) => handlePinChange(index, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              handleBackspace(index);
            } else {
              handleEnterKeyPress(e);
            }
          }}
          ref={(ref) => (inputRefs.current[index] = ref)}
          className="form-control"
          inputMode="numeric"
          disabled={timerRunning}
        />
      </div>
    ))
  ), [mPin, handlePinChange, handleEnterKeyPress, handleBackspace, timerRunning]);

  return (
    <div className="body-wrapper no-header login-body-wrapper">
      <div className="overlay-blur"></div>
      <div className="body-container">
        <div className="m-pin-wrapper">
          <div className="welcome-user">
            <strong>Enter M-PIN</strong>
            <p className="mb-0 text-style">Enter your M-PIN for a secure entry to your card</p>
          </div>
          <div className="set-pin-container">
            <div className="set-pin-item-wrapper">
              <div className="set-pin-item-container">{pinInputs}</div>
            </div>
          </div>
          {errorMsg && <div className="text-danger mb-4">{errorMsg}</div>}
          {timerRunning && <div className="text-danger">Try again in {timerValue} seconds</div>}
          {successMsg && <div className="text-success">{successMsg}</div>}
        </div>
        <div className="footer-fixed-wrapper text-center">
          <button
            ref={submitButtonRef} // Reference to the submit button
            className="btn btn-primary btn-lg btn-circular footer-submit-btn"
            onClick={handleLogin}
            disabled={loginDisabled || timerRunning}
          >
            Login
          </button>
          <div className="footer-forgot-wrapper">
            {/* <button
              className="btn btn-link btn-lg btn-circular footer-submit-btn"
              onClick={handleForgotPin}
              disabled={timerRunning}
            >
              Reset MPin
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
