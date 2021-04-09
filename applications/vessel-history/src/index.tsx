import { render } from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorkerRegistration'
import store from './store'
import App from './App'
import './features/i18n/i18n'
import './index.css'

render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
