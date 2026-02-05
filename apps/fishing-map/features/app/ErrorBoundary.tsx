import { Component } from 'react'
import * as Sentry from '@sentry/nextjs'

import ErrorBoundaryUI from './ErrorBoundaryUI'

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
    console.log('🚀 ~ componentDidCatch ~ error:', error)
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    })
  }

  render() {
    if (this.state.error) {
      return <ErrorBoundaryUI error={this.state.error} />
    }
    return this.props.children
  }
}
