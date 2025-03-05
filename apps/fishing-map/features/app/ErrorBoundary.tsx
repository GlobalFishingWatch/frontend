import { Component } from 'react'

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
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return <ErrorBoundaryUI error={this.state.error} />
    }
    return this.props.children
  }
}
