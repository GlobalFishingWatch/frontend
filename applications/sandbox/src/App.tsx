import React from 'react'
import GFWAPI from '@globalfishingwatch/api-client/src/index'
import { useGFWLogin } from '@globalfishingwatch/react-hooks/src/index'

import './App.css'
import logo from './logo.svg'

function App() {
  // used any as types and local definitions are incompatible	  const { logged, user } = useGFWLogin(GFWAPI)
  // remove the /src/index from the import to use the builded version
  const { logged, user } = useGFWLogin(GFWAPI as any)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br />
        Using <code>useGFWLogin</code>
        {logged ? `Logged user: ${user?.firstName}` : 'User not logged'}
      </header>
      <main></main>
    </div>
  )
}

export default App
