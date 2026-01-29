'use client'

import React from 'react'
import { Provider } from 'react-redux'
// import { appWithTranslation } from 'next-i18next'
// import { ClickToComponent } from 'click-to-react-component'
import type { AppProps } from 'next/app'
// import dynamic from 'next/dynamic'
// import { useEffect, useState } from 'react'
import Head from 'next/head'

import 'utils/polyfills'
import 'features/i18n/i18n'

import { makeStore } from '../store'

import './styles.css'
import '@globalfishingwatch/ui-components/base.css'
import '@globalfishingwatch/timebar/timebar-settings.css'

function CustomApp({ Component, pageProps }: AppProps) {
  const store = makeStore()

  return (
    <React.StrictMode>
      <Head>
        <title>GFW | Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Provider store={store}>
        {/* <ClickToComponent /> */}
        <Component {...pageProps} />
      </Provider>
    </React.StrictMode>
  )
}

export default CustomApp
