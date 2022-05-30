import dynamic from 'next/dynamic'

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
