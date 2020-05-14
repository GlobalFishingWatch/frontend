import React from 'react'
import GFWAPI from '@globalfishingwatch/api-client/src/index'
import { useLogin } from '@globalfishingwatch/react-hooks/src/index'
import styles from '@globalfishingwatch/ui-kit/dist/gfw-ui-kit.module.css'

import './App.css'
import '@globalfishingwatch/ui-kit/dist/gfw-ui-kit.base.css'
import logo from './logo.svg'
console.log('styles', styles)

function App() {
  // used any as types and local definitions are incompatible	  const { logged, user } = useGFWLogin(GFWAPI)
  // remove the /src/index from the import to use the builded version
  const { logged, user } = useLogin(GFWAPI as any)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br />
        Using <code>useGFWLogin</code>
        {logged ? `Logged user: ${user?.firstName}` : 'User not logged'}
        <button className="button">Hi</button>
        <button className={styles.button}>Hi with cssModules</button>
      </header>
      <main></main>
    </div>
  )
}

export default App
