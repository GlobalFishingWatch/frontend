import React from 'react';
import logo from './logo.svg';
import './App.css';

import GFWAPI from '@globalfishingwatch/api-client/src/index'
import { useGFWLogin } from '@globalfishingwatch/react-hooks/src/index'

function App() {
  const { logged, user } = useGFWLogin(GFWAPI)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br/>
        Using <code>useGFWLogin</code>
        {logged ? `Logged user: ${user?.firstName}`: 'User not logged'}
      </header>
      <main>
      </main>
    </div>
  );
}

export default App;
