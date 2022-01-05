import { AppProps } from 'next/app'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'
import '@globalfishingwatch/ui-components/dist/base.css'
import { Login } from '@globalfishingwatch/react-hooks'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Login>
      <Component {...pageProps} />
    </Login>
  )
}

export default CustomApp
