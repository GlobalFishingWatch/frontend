import type { NextPage } from 'next'
// import Layout from 'components/layout'
import dynamic from 'next/dynamic'
import styles from '../styles/index.module.css'

const Layout = dynamic(() => import('components/layout'), {
  ssr: false,
})

const Home: NextPage = () => {
  return (
    <Layout>
      <p className={styles.description}>
        You need an acccess token to call Global Fishing Watch API endpoints like Vessel search or
        4wings activity tiles. Read more about API access tokens in{' '}
        <a href="#api-documentation">our documentation</a>
      </p>
    </Layout>
  )
}

export default Home
