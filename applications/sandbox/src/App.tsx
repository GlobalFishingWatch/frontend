import React from 'react';
import logo from './logo.svg';
import './App.css';
import hook from '@globalfishingwatch/react-hooks'

function App() {
  hook()
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
