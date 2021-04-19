import React, { Fragment, useState } from 'react'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import styles from './App.module.css'

import '@globalfishingwatch/ui-components/dist/base.css'

function App(): React.ReactElement {
  const [tileURL, setTileURL] = useState(
    'https://gateway.api.dev.globalfishingwatch.org/v1/4wings/tile/heatmap/1/1/1?proxy=true&format=intArray&temporal-aggregation=false&interval=10days&datasets[0]=public-global-presence:v20201001,public-panama-carrier-presence:v20200331'
  )
  return (
    <Fragment>
      <InputText
        inputSize="small"
        value={tileURL}
        label="Tile URL"
        onChange={(e) => setTileURL(e.target.value)}
      />
    </Fragment>
  )
}

export default App
