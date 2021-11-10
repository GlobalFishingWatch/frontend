import dynamic from 'next/dynamic'

const NoSSRComponent = dynamic(() => import('../features/app/App'), {
  ssr: false,
})

const Index = () => {
  return <NoSSRComponent />
}
export default Index
