import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import { useEffect } from 'react'
import { GFWAPI } from '@globalfishingwatch/api-client'
// import Head from 'next/head'
import store from '../store'
import * as serviceWorker from '../offline/serviceWorkerRegistration'
import 'features/i18n/i18n'
import '../../../libs/ui-components/src/base.css'
import '../../../libs/timebar/src/timebar-settings.css'
import './styles.css'

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

function CustomApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    serviceWorker.register({
      // Force performing a login request to cache the response in the SW
      onSuccess: () => GFWAPI.login({}),
    })
  }, [])
  return (
    <RecoilRoot>
      <Provider store={store}>
        <div className="app">
          <Component {...pageProps} />
        </div>
      </Provider>
    </RecoilRoot>
  )
}

export default CustomApp
