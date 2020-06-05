import React from 'react'
import { Type } from '@globalfishingwatch/layer-composer/src/generators/types'
import { useLayerComposer } from '@globalfishingwatch/react-hooks/src/index'

const generatorsConfig = [{ id: 'background', type: Type.Background }]
const globalConfig = {}

function App() {
  const { style } = useLayerComposer(generatorsConfig, globalConfig)

  return (
    <div className="App">
      <header className="App-header">
        Using <code>useLayerComposer</code>
      </header>
      <main>
        <code>{JSON.stringify(style)}</code>
      </main>
    </div>
  )
}

export default App
