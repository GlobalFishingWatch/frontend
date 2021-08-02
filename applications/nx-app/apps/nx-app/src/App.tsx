import React from 'react';
import logo from './logo.svg';
import { TestLibrary2 } from '@nx-app/test-library2';
import { TestLibrary3 } from '@globalfishingwatch/test-library-3';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <TestLibrary2 />
        <TestLibrary3 />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
