import dynamic from 'next/dynamic'

const AppNoSSRComponent = dynamic(() => import('../features/app/App'), {
  ssr: false,
})

const Index = () => {
  return <AppNoSSRComponent />
}

export default Index
