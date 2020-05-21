import React from 'react'
import GFWAPI from '@globalfishingwatch/api-client/src/index'
import { Type } from '@globalfishingwatch/layer-composer/src/generators/types'
import { useLogin, useLayerComposer } from '@globalfishingwatch/react-hooks/src/index'
import styles from '@globalfishingwatch/ui-kit/dist/gfw-ui-kit.module.css'
import { MiniGlobe } from '@globalfishingwatch/ui-components'

import './App.css'
import '@globalfishingwatch/ui-kit/dist/gfw-ui-kit.base.css'

const layers = [{ id: 'background', type: Type.Background }]

function App() {
  // used any as types and local definitions are incompatible	  const { logged, user } = useGFWLogin(GFWAPI)
  // remove the /src/index from the import to use the builded version
  const { logged, user } = useLogin(GFWAPI as any)
  const [mapStyle] = useLayerComposer(layers)
  console.log('App -> mapStyle', mapStyle)

  return (
    <div className="App">
      <header className="App-header">
        Using <code>useGFWLogin</code>
        {logged ? `Logged user: ${user?.firstName}` : 'User not logged'}
        <br />
        <button className="button">Hi</button>
        <button className={styles.button}>Hi with cssModules</button>
        <br />
        <p>Map Style</p>
        <code>{JSON.stringify(mapStyle)}</code>
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
