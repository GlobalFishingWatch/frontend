import React, { useEffect, useState } from 'react'
// import { appWithTranslation } from 'next-i18next'
// import { ClickToComponent } from 'click-to-react-component'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
// import dynamic from 'next/dynamic'
// import { useEffect, useState } from 'react'
import MemoryStatsComponent from 'next-react-memory-stats'
import { FpsView } from 'react-fps'
import Head from 'next/head'
import { wrapper } from '../store'

import 'features/i18n/i18n'
import './styles.css'
import '../../../libs/ui-components/src/base.css'
import '../../../libs/timebar/src/timebar-settings.css'

function CustomApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest)

  const [showFps, setShowFps] = useState(false)
  useEffect(() => setShowFps(true), [])

  return (
    <React.StrictMode>
      <Head>
        <title>GFW | Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <RecoilRoot>
        <Provider store={store}>
          {/* <ClickToComponent /> */}
          <Component {...props.pageProps} />
          {showFps && <FpsView bottom="10rem" left="39rem" top="auto" />}
          {showFps && <MemoryStatsComponent corner="bottomRight" />}
        </Provider>
      </RecoilRoot>
    </React.StrictMode>
  )
}

export default CustomApp
