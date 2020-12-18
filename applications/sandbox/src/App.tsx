import React, { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import Components from './pages/Components'
import SplitViewPage from './pages/SplitView'
import ApiClient from './pages/ApiClient'
import OceanAreas from './pages/OceanAreas'
import LayerComposer from './pages/LayerComposer'
import './App.css'
import '@globalfishingwatch/ui-components/src/base.css'

const Home = () => <h1>Please select the page you want to see</h1>

function App() {
  return (
    <Router basename="/frontend">
      <Fragment>
        <nav className="nav">
          <NavLink to="/ui-components">UI Components</NavLink>
          <NavLink to="/split-view">Split view</NavLink>
          <NavLink to="/layer-composer">Layer Composer</NavLink>
          <NavLink to="/api-client">Api Client</NavLink>
          <NavLink to="/ocean-areas">Ocean Areas</NavLink>
        </nav>
        <div className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/ui-components" component={Components} />
            <Route path="/split-view" component={SplitViewPage} />
            <Route path="/api-client" component={ApiClient} />
            <Route path="/ocean-areas" component={OceanAreas} />
            <Route path="/layer-composer" component={LayerComposer} />
            <Route component={Home} />
          </Switch>
        </div>
      </Fragment>
    </Router>
  )
}

export default App
