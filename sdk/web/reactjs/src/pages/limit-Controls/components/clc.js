import React, { useState, useEffect } from 'react';
import { Domestic } from '../components/domestic';
import { International } from './international';
import { getPreferences } from '../../../common/cms-sdk/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function CLC() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Domestic');
  const [domesticPreferences, setDomesticPreferences] = useState(null);
  const [internationalPreferences, setInternationalPreferences] = useState(null);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const preferencesData = await getPreferences();
        setDomesticPreferences(preferencesData.domestic);
        setInternationalPreferences(preferencesData.international);
        // console.log("PreferencesData in CLC: ", preferencesData.domestic);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching preferences: ", error);
      }
      // console.log("Domestic Preferences in CLC: ", domesticPreferences);
      // console.log("International Preferences in CLC: ", internationalPreferences);
    }
    fetchPreferences();
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  if (loading) {
    return <div className="loader">
      <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '3rem', color: '#e96341', position: 'absolute', left: '45%', top: '40%'  }} />
          </div>; // Render loading indicator
  }

  return (
    <div className="container">
      <ul className="nav nav-pills nav-justified custom-nav">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'Domestic' ? 'active' : ''}`}
            onClick={() => handleTabChange('Domestic')}
          >
            Domestic
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'International' ? 'active' : ''}`}
            onClick={() => handleTabChange('International')}
            disabled={activeTab === 'International'}
          >
            International
          </button>
        </li>
      </ul>
      <div className="tab-content">
        {activeTab === 'Domestic' && <Domestic domesticPreferences = {domesticPreferences} />}
        {activeTab === 'International' && <International internationalPreferences = {internationalPreferences} />}
      </div>
    </div>
  );
}

export default CLC;
