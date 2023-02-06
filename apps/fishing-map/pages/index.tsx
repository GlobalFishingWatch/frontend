import path from 'path'
import dynamic from 'next/dynamic'
import { RecoilRoot } from 'recoil'
import { Provider } from 'react-redux'
import store from '../store'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

const MapProvider = dynamic(() => import('react-map-gl').then((module) => module.MapProvider), {
  ssr: false,
})

const AppNoSSRComponent = dynamic(() => import('../features/app/App'), {
  ssr: false,
})

export const Index = () => {
  return (
    <RecoilRoot>
      <Provider store={store}>
        <MapProvider>
          <AppNoSSRComponent />
        </MapProvider>
      </Provider>
    </RecoilRoot>
  )
}
export default Index
