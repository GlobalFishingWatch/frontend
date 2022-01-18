import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
// import Head from 'next/head'
import store from '../store'
import 'features/i18n/i18n'
import '../../../libs/ui-components/src/base.css'
import '../../../libs/timebar/src/timebar-settings.css'
import './styles.css'

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

function CustomApp({ Component, pageProps }: AppProps) {
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
