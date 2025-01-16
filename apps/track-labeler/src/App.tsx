import React, { Fragment, lazy, Suspense,useState } from 'react'
import { useSelector } from 'react-redux'

import { SplitView } from '@globalfishingwatch/ui-components/split-view'

import Loader from '././features/loader/loader'
import Login from '././features/login/Login'
import { MapboxRefProvider } from '././features/map/map.context'
import { LOGIN } from './routes/routes'
import { getLocationType } from './routes/routes.selectors'

import '@globalfishingwatch/ui-components/base.css'
import '../../../libs/timebar/src/timebar-settings.css'

const Main = lazy(() => import(`././features/main/main.container`))
const Sidebar = lazy(() => import(`././features/sidebar/sidebar.container`))

function App(): React.ReactElement<any> {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [animation, setAnimation] = useState(true)
  //const logged = true
  const onToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const locationType = useSelector(getLocationType)

  if (locationType === LOGIN) {
    return <Login />
  }

  const mainContent = (
    <Suspense fallback={<Fragment />}>
      <Main />
    </Suspense>
  )
  const sidebarContent = (
    <Suspense fallback={<Fragment />}>
      <Sidebar />
    </Suspense>
  )

  // Just an effect to init the labeler
  setTimeout(() => setAnimation(false), 2000)
  if (animation) {
    return (
      <Fragment>
        <Loader />
      </Fragment>
    )
  }
  return (
    <MapboxRefProvider>
      <SplitView
        isOpen={sidebarOpen}
        onToggle={onToggle}
        showToggle={false}
        aside={sidebarContent}
        main={mainContent}
        asideWidth="44rem"
        className="split-container"
      />
    </MapboxRefProvider>
  )
}

export default App
