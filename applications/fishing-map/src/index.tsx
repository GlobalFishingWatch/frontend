import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import App from 'features/app/App'
import store from './store'
import * as serviceWorker from './serviceWorker'

import './features/i18n/i18n'
import '@globalfishingwatch/ui-components/dist/base.css'

async function loadPolyfills() {
  if (typeof window.IntersectionObserver === 'undefined') {
    await import('intersection-observer')
  }
}

loadPolyfills()

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
serviceWorker.unregister()
