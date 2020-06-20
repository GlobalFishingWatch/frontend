import React, { lazy, useMemo, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentLocation } from 'routes/routes.selectors'

const SidebarComponent = (component: string) => {
  return lazy(() => import(`../${component}`))
}

function Sidebar(): React.ReactElement {
  const { component } = useSelector(selectCurrentLocation)
  const ComponentSidebar = useMemo(() => {
    return component ? SidebarComponent(component) : null
  }, [component])

  return <Suspense fallback={null}>{ComponentSidebar && <ComponentSidebar />}</Suspense>
}

export default Sidebar
