import React from 'react'

import { Header } from './components/header';
import { SetupNewPIN } from './components/atm-pin';
import { ApiCalls } from '../common/apiCalls';

export function PinResetIndex() {
    const { setNewPinApiCall } = ApiCalls();
    return (
        <>
            <Header />
            <SetupNewPIN setNewPinApiCall={setNewPinApiCall} />
        </>
    )
}
