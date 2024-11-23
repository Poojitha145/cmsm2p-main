import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CardIndex } from './pages/home/cardIndex';
import { MpinVerifyIndex } from './pages/mpin-Verify/mpin-verify-index';
import { Index } from './pages/mpin/index';
import { BillingIndex } from './pages/billing/BillingIndex.js';
import { PinResetIndex } from './pages/atm-Pin-Setup/atm-pin-setup-index.js';
import { LimitControlsIndex } from './pages/limit-Controls/limit-controls-index.js';
import { BlockCardIndex } from './pages/blockCard/blockCardIndex.js';
import { StatementsIndex } from './pages/Statements/statementIndex.js';
import ComingSoon from './pages/common/comingSoon.js';
import { CardClosureIndex } from './pages/card-Closure/card-closure-index.js';
import { StatementDetailsIndex } from './pages/statementDetails/statementDetails.js';
import { UnbilledTransactionsIndex } from './pages/unbilled-Transactions/unbilled-transactions-index.js';
import { EmiTransactionIndex } from './pages/emiTransaction/emiTransactionIndex.js';
import { EasyEmi } from './pages/common/easyEmi.js';
import { AboutCardIndex } from './pages/about-Card/about-card-index.js';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<MpinVerifyIndex />} />
          <Route path='/card-details' element={<CardIndex />} />
          <Route path='/forgot-mpin' element={<Index />} />
          <Route path='/change-billing' element={<BillingIndex />} />
          <Route path='/pin-reset' element={<PinResetIndex />} />
          <Route path='/coming-soon' element={<ComingSoon />} />
          <Route path='/statement-list' element={<StatementsIndex />} />
          <Route path='/limit-control' element={<LimitControlsIndex />} />
          <Route path='/block-card' element={<BlockCardIndex />} />
          <Route path= '/card-closure' element={<CardClosureIndex />} />
          <Route path='/statement-details' element={<StatementDetailsIndex />} />
          <Route path='/unbilled-transactions' element={<UnbilledTransactionsIndex />} />
          <Route path='/easy-emi' element={<EasyEmi/>} />
          <Route path='/transactions-emi' element={<EmiTransactionIndex />} />
          <Route path='/about-card' element={<AboutCardIndex />} />
        </Routes >
      </Router >
    </div >
  )
}

export default App;
