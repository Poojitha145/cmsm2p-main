import React from 'react'
import '../../assets/styles/styles.css';
import { SettingsIndex } from '../../settings/settingsIndex';

function Header(props) {
    const { settingmodalOpen, setSettingModalOpen, setButtonClick } = props;

    const handleButtonClick = () => {
        setSettingModalOpen(!settingmodalOpen);
    };

    const handleRefresh = () => {
        setButtonClick(true);
    }

    return (
        <div>
            <div class="header-wrapper">
                <div class="header-container">
                    <div class="header-menu-wrapper">
                        <div class="user-wrapper">
                            <div class="user-details-wrapper">
                                <div class="user-name">Hi, <b>{props.cardDetails?.name}</b></div>
                            </div>
                        </div>
                    </div>
                    <div class="header-right-wrapper">
                        <button class="btn">
                            <i class="fa-solid fa-arrows-rotate" onClick={handleRefresh}></i>
                        </button>
                        <button class="btn">
                            <i class="fa-solid fa-cog" onClick={handleButtonClick}></i>
                        </button>
                    </div>
                </div>
            </div>
            {settingmodalOpen && <SettingsIndex onClose={() => setSettingModalOpen(false)} />}
        </div>
    )
}

export default Header