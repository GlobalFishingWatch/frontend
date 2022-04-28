import '../../../libs/ui-components/src/base.css'
import './app.css'
import { AppProps } from 'next/app'
import { Layout } from 'components/layout/layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
