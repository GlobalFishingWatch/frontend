import { AppProps } from 'next/app'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'
import '../../../libs/ui-components/src/base.css'
import { Login } from '@globalfishingwatch/react-hooks'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Login>
      <Component {...pageProps} />
    </Login>
  )
}

export default CustomApp
