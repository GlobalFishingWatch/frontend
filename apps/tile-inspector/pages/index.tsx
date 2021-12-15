import dynamic from 'next/dynamic'

const AppNoSSRComponent = dynamic(() => import('../app/App'), {
  ssr: false,
})

const Index = () => {
  return <AppNoSSRComponent />
}
export default Index
