import path from 'path'
import dynamic from 'next/dynamic'
path.resolve('./next.config.js')

const AppNoSSRComponent = dynamic(() => import('../features/app/App'), {
  ssr: false,
})

const Index = () => {
  return <AppNoSSRComponent />
}
export default Index
