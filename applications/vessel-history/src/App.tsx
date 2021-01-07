import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import Home from 'features/home/Home'
import './App.css'
import { getLocationType } from 'routes/routes.selectors'
import { LOGIN, PROFILE } from 'routes/routes'

function App() {
  const locationType = useSelector(getLocationType)
  if (locationType === LOGIN) {
    //return <Login />
  }
  if (locationType === PROFILE) {
    //return <Profile />
  }
  return (
    <Fragment>
      <Home />
    </Fragment>
  )
}

export default App
