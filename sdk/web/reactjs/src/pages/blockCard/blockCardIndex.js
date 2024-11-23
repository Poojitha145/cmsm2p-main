import React from "react";

import {Header} from '../blockCard/components/header.js';
import {Menu} from '../blockCard/components/menu.js';
import { ApiCalls } from "../common/apiCalls.js";

export function BlockCardIndex() {
    const { blockCardApiCall } = ApiCalls();
    return (
        <div >
            <Header />
            <Menu blockCardApiCall={blockCardApiCall}/>
        </div>

    )
}