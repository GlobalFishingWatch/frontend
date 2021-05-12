import React, { Component, ErrorInfo, Fragment } from 'react'
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

class ErrorBoundary extends Component<any, { hasError: boolean, error: string | null }> {
  constructor() {
    super({});
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // console.log(error, errorInfo)
    this.setState({ error: [error.message, errorInfo.componentStack].join('\n') })
  }
  render() {
    if (this.state.hasError) {
      return <Fragment>
        <h1>Something went wrong.</h1>
        <pre>
          {this.state.error}
        </pre>
        <p>
          Please <a href="mailto:tony@globalfishingwatch.org">contact us</a> to report the problem
        </p>
      </Fragment>
      
    }
    return this.props.children; 
  }
}

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
