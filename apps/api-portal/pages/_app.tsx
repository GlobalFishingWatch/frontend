import '../styles/globals.css'
import { AppProps } from 'next/app'
// import { Provider } from 'react-redux'
// import { RecoilRoot } from 'recoil'
// import store from '../store'
// import '../../../libs/ui-components/src/base.css'
// import '../../../libs/timebar/src/timebar-settings.css'
// import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'

// function SafeHydrate({ children }) {
//   return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
// }

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
