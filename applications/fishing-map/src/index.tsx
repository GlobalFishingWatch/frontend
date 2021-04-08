import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import App from 'features/app/App'
import store from './store'

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
