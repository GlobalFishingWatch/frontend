import React from 'react';
import logo from './logo.svg';
import './App.css';

import GFWAPI from '@globalfishingwatch/api-client/src/index'
import { useGFWLogin } from '@globalfishingwatch/react-hooks/src/index'

function App() {
  // used any as types and local definitions are incompatible
  // remove the /src/index from the import to use the builded version
  const login = useGFWLogin(GFWAPI as any)
  console.log('App -> login', login)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
