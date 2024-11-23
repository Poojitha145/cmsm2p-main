import React from 'react';

import { SettingsHeader } from './components/settingheader'
import { MenuList } from './components/menu-list'
import { ApiCalls } from '../common/apiCalls';

export function SettingsIndex({ onClose }) {
    const { cardDetails, lockCardApiCall, unlockCardApiCall } = ApiCalls();
    const isCardLocked = cardDetails?.kitNo ? false : true;

    return (
        <div>
            <SettingsHeader onClose={onClose} />
            <MenuList isCardLocked={isCardLocked} lockCardApiCall={lockCardApiCall} unlockCardApiCall={unlockCardApiCall} />
        </div>
    )
}
