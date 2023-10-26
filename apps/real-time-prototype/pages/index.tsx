import dynamic from 'next/dynamic'
// import Sidebar from 'features/sidebar/Sidebar'

const SidebarNoSSRComponent = dynamic(() => import('../features/sidebar/Sidebar'), {
  ssr: false,
})

export default SidebarNoSSRComponent
