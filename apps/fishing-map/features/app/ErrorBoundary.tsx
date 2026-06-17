import { Component } from 'react'

import ErrorBoundaryUI from './ErrorBoundaryUI'
import { reportRouteError } from './sentry'

export default class ErrorBoundary extends Component<any, { error: Error | null }> {
  constructor(props: any) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(error, errorInfo)
    reportRouteError(error, 'react-error-boundary', {
      componentStack: errorInfo?.componentStack,
    })
  }

  render() {
    if (this.state.error) {
      return <ErrorBoundaryUI error={this.state.error} />
    }
    return this.props.children
  }
}
