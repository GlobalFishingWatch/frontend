import React from 'react'
// import { appWithTranslation } from 'next-i18next'
import { ClickToComponent } from 'click-to-react-component'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import { SessionProvider } from 'next-auth/react'
// import dynamic from 'next/dynamic'
// import { useEffect, useState } from 'react'
import Head from 'next/head'
import store from '../store'

import 'features/i18n/i18n'
import './styles.css'
import '../../../libs/ui-components/src/base.css'
import '../../../libs/timebar/src/timebar-settings.css'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'

// const RecoilizeDebugger = dynamic(() => import('recoilize'), { ssr: false })

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

const basePath =
  process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/map' : '')

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
        {/* <RecoilizeDebugger root={root} /> */}
        <Provider store={store}>
          <SessionProvider
            // Provider options are not required but can be useful in situations where
            // you have a short session maxAge time. Shown here with default values.
            session={pageProps.session}
            basePath={`${basePath}/api/auth`}
          >
            <ClickToComponent />
            <Component {...pageProps} />
          </SessionProvider>
        </Provider>
      </RecoilRoot>
    </React.StrictMode>
  )
}

export default CustomApp
