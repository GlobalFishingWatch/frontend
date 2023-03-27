import dynamic from 'next/dynamic'
import Sidebar from 'features/sidebar/Sidebar'

// const AppNoSSRComponent = dynamic(() => import('../features/sidebar/Sidebar'), {
//   ssr: false,
// })

// const Index = () => {
//   return <AppNoSSRComponent />
// }
export default Sidebar
