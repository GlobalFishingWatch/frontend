import { Component } from 'react'
export default TimelineUnits
declare class TimelineUnits extends Component<any, any, any> {
  static contextType: any
  constructor(props: any)
  constructor(props: any, context: any)
  zoomToUnit({ start, end }: { start: any; end: any }): void
}
declare namespace TimelineUnits {
  namespace propTypes {
    const onChange: any
    const start: any
    const end: any
    const absoluteStart: any
    const absoluteEnd: any
    const outerStart: any
    const outerEnd: any
    const outerScale: any
  }
}
