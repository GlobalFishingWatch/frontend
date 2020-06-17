import React from 'react'
import GFWAPI from '@globalfishingwatch/api-client'
import { useLogin } from '@globalfishingwatch/react-hooks/src/index'

function ApiClient() {
  const { logged, user, loading } = useLogin(GFWAPI)

  return (
    <div className="App">
      <header className="App-header">
        Using <code>useGFWLogin</code>
      </header>
      <main>
        {logged ? `Logged user: ${user?.firstName}` : loading ? 'Loading' : 'User not logged'}
      </main>
    </div>
  )
}

export default ApiClient
