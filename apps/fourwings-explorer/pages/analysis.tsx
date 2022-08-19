import dynamic from 'next/dynamic'
import Analysis from 'features/analysis/Analysis'
// const AnalysisNoSSRComponent = dynamic(() => import('../../features/analysis/Analysis'), {
//   ssr: false,
// })

// const Analysis = () => {
//   return <AnalysisNoSSRComponent />
// }
export default Analysis
