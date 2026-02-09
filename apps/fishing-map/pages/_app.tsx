'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Provider, useStore } from 'react-redux'
import { RouterProvider } from '@tanstack/react-router'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import { router } from 'routes/router'
import { setupRouterSync } from 'routes/router-sync'
import { makeStore } from 'store'

import 'utils/polyfills'
import 'features/i18n/i18n'

import './styles.css'
import '@globalfishingwatch/ui-components/base.css'
import '@globalfishingwatch/timebar/timebar-settings.css'

function CustomApp({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false)
  const store = useMemo(() => makeStore(), [])

  useEffect(() => {
    setupRouterSync(router, store)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [store])

  return (
    <React.StrictMode>
      <Head>
        <title>GFW | Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Provider store={store}>{isMounted ? <RouterProvider router={router} /> : null}</Provider>
    </React.StrictMode>
  )
}

export default CustomApp
