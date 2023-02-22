import path from 'path'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { MapProvider } from 'react-map-gl'
import { Component, Fragment } from 'react'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

// const MapProvider = dynamic(() => import('react-map-gl').then((module) => module.MapProvider), {
//   ssr: false,
// })

const AppNoSSRComponent = dynamic(() => import('../features/app/App'), {
  ssr: false,
})

const HeadDescriptionByLocation = ({ isMarineManagerLocation }) => {
  return (
    <Head>
      <meta
        property="og:description"
        content={
          isMarineManagerLocation
            ? 'The portal provides dynamic interactive data on marine traffic, biology and ocean conditions to support marine protected area design and management.'
            : 'The Global Fishing Watch map is the first open-access platform for visualization and analysis of marine traffic and vessel-based human activity at sea.'
        }
      />
      <meta
        name="twitter:description"
        content={
          isMarineManagerLocation
            ? 'The portal provides dynamic interactive data on marine traffic, biology and ocean conditions to support marine protected area design and management.'
            : 'The Global Fishing Watch map is the first open-access platform for visualization and analysis of marine traffic and vessel-based human activity at sea.'
        }
      />
      <meta
        name="description"
        content={
          isMarineManagerLocation
            ? 'The portal provides dynamic interactive data on marine traffic, biology and ocean conditions to support marine protected area design and management.'
            : 'The Global Fishing Watch map is the first open-access platform for visualization and analysis of marine traffic and vessel-based human activity at sea.'
        }
      />
    </Head>
  )
}

class Index extends Component<{ isMarineManagerLocation: boolean }> {
  static async getInitialProps({ req }) {
    return { isMarineManagerLocation: req.originalUrl.includes('marine-manager') }
  }

  render() {
    return (
      <Fragment>
        <HeadDescriptionByLocation isMarineManagerLocation={this.props.isMarineManagerLocation} />
        <MapProvider>
          <AppNoSSRComponent />
        </MapProvider>
      </Fragment>
    )
  }
}
export default Index
