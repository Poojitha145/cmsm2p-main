import React from 'react'
import { useNavigate } from "react-router-dom";
import moment from 'moment';

import '../../assets/styles/styles.css';

export function Header(props) {
  const { statementDate = [] } = props;
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  }

  const formatDate = (dateString) => {
    return moment(dateString).format('ll');// Formatting date using date-fns format function
  }

  return (
    <header className="header-section">
      <button className="back-btn" onClick={handleBackButtonClick}>
      <i className="feather-arrow-left"></i>
      </button>
      <div className="header-middle">
        <h1 className="statement-details-heading">Latest Statement</h1>
        <p className="statement-details-duration">{formatDate(statementDate)} - Mar 4, 2024</p>
      </div>
      <div className="header-right">
        <div className="download-button-container">
          <button className="download-button">
            <i className="fas fa-download"></i>
          </button>
        </div>
      </div>
    </header>
  )
}