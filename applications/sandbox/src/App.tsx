import React from 'react'
import GFWAPI from '@globalfishingwatch/api-client'
import { Type } from '@globalfishingwatch/layer-composer/src/generators/types'
import { useLogin, useLayerComposer } from '@globalfishingwatch/react-hooks'
// import styles from '@globalfishingwatch/ui-kit/dist/components.module.css'
import { MiniGlobe, CountryFlag } from '@globalfishingwatch/ui-components'

import './App.css'
// import '@globalfishingwatch/ui-kit/dist/styles.min.css'

const layers = [{ id: 'background', type: Type.Background }]

function App() {
  const { logged, user } = useLogin(GFWAPI)
  const { style } = useLayerComposer(layers)

  return (
    <div className="App">
      <header className="App-header">
        Using <code>useGFWLogin</code>
        {logged ? `Logged user: ${user?.firstName}` : 'User not logged'}
        <br />
        <CountryFlag iso="TAI" />
        <CountryFlag iso="ESP" svg svgBorder />
        <br />
        {/* <button className="button">Hi</button>
        <button className={styles.button}>Hi with cssModules</button> */}
        <br />
        <p>Map Style</p>
        <code>{JSON.stringify(style)}</code>
        <MiniGlobe
          center={{ latitude: 0, longitude: 0 }}
          bounds={{ north: 0, south: 0, west: 0, east: 0 }}
        />
      </header>
      <main></main>
    </div>
  )
}

export default App
