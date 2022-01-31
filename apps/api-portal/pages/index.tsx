import type { NextPage } from 'next'
import Layout from 'components/layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <p>
        You need an acccess token to call Global Fishing Watch API endpoints like Vessel search or
        4wings activity tiles. Read more about API access tokens in{' '}
        <a href="#api-documentation">our documentation</a>
      </p>
    </Layout>
  )
}

export default Home
