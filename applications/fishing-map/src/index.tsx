import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import App from 'features/app/App'
import ErrorBoundary from 'features/app/ErrorBoundary'
import store from './store'
import 'util'
import './features/i18n/i18n'
import '@globalfishingwatch/ui-components/dist/base.css'

const setMobileSafeVH = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

setMobileSafeVH()
window.addEventListener('resize', setMobileSafeVH)

async function loadPolyfills() {
  if (typeof window.IntersectionObserver === 'undefined') {
    await import('intersection-observer')
  }
}

loadPolyfills()

render(
  <React.StrictMode>
    <ErrorBoundary>
      <RecoilRoot>
        <Provider store={store}>
          <App />
        </Provider>
      </RecoilRoot>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
)
