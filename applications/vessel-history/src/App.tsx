import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import GFWAPI from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import Home from 'features/home/Home'
import './App.css'
import { getLocationType } from 'routes/routes.selectors'
import { LOGIN, PROFILE } from 'routes/routes'
import { BASE_URL } from 'data/constants'
import Profile from 'features/profile/Profile'

GFWAPI.setConfig({ dataset: process.env.REACT_APP_DATASET || 'carriers:v20200820' })

function App() {
  const { loading, logged } = useGFWLogin(GFWAPI)
  if (!loading && !logged) {
    const location = window.location.origin + BASE_URL
    window.location.href = GFWAPI.getLoginUrl(location)
  }
  //const search = useSelector(getLocationSearch)

  const locationType = useSelector(getLocationType)

  if (locationType === PROFILE) {
    return <Profile />
  }
  return (
    <Fragment>
      <Home />
    </Fragment>
  )
}

export default App
