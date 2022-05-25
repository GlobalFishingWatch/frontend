// import { appWithTranslation } from 'next-i18next'
import { ClickToComponent } from 'click-to-react-component'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import { MapProvider } from 'react-map-gl'
// import dynamic from 'next/dynamic'
// import { useEffect, useState } from 'react'
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

function CustomApp({ Component, pageProps }: AppProps) {
  // const [root, setRoot] = useState(null)
  // useEffect(() => {
  //   if (typeof window.document !== 'undefined') {
  //     setRoot(document.getElementById('__next'))
  //   }
  // }, [root])

  return (
    <RecoilRoot>
      {/* <RecoilizeDebugger root={root} /> */}
      <Provider store={store}>
        <ClickToComponent />
        <MapProvider>
          <Component {...pageProps} />
        </MapProvider>
      </Provider>
    </RecoilRoot>
  )
}

export default CustomApp
