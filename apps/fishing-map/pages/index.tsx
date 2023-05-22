import path from 'path'
import dynamic from 'next/dynamic'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

const MapProvider = dynamic(() => import('react-map-gl').then((module) => module.MapProvider), {
  ssr: false,
})

const AppNoSSRComponent = dynamic(() => import('../features/app/App'), {
  ssr: false,
})

const Index = () => {
  return (
    <MapProvider>
      <AppNoSSRComponent />
    </MapProvider>
  )
}

export default Index
