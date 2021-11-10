import { render } from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import { GFWAPI } from '@globalfishingwatch/api-client'
import * as serviceWorker from './serviceWorkerRegistration'
import store from './store'
import App from './App'
import './features/i18n/i18n'
import '@globalfishingwatch/ui-components/base.css'
import './index.css'

render(
  <React.StrictMode>
    <RecoilRoot>
      <Provider store={store}>
        <App />
      </Provider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  // Force performing a login request to cache the response in the SW
  onSuccess: () => GFWAPI.login({}),
})
