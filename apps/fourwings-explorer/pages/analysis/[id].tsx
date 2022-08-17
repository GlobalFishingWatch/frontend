import dynamic from 'next/dynamic'

const AnalysisNoSSRComponent = dynamic(() => import('../../features/analysis/Analysis'), {
  ssr: false,
})

const Analysis = () => {
  console.log('load analysis component')
  return <AnalysisNoSSRComponent />
}
export default Analysis
