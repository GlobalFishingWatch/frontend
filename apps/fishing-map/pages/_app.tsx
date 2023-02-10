import React from 'react'
// import { appWithTranslation } from 'next-i18next'
import { ClickToComponent } from 'click-to-react-component'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
// import dynamic from 'next/dynamic'
// import { useEffect, useState } from 'react'
import Head from 'next/head'
import store from '../store'

import 'features/i18n/i18n'
import './styles.css'
import '../../../libs/ui-components/src/base.css'
import '../../../libs/timebar/src/timebar-settings.css'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

function CustomApp({ Component, pageProps }: AppProps) {
  // const [root, setRoot] = useState(null)
  // useEffect(() => {
  //   if (typeof window.document !== 'undefined') {
  //     setRoot(document.getElementById('__next'))
  //   }
  // }, [root])

  return (
    <React.StrictMode>
      <Head>
        <title>GFW | Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <RecoilRoot>
        <Provider store={store}>
          <ClickToComponent />
          <Component {...pageProps} />
        </Provider>
      </RecoilRoot>
    </React.StrictMode>
  )
}

export default CustomApp
