import { Component } from 'react'
export default TimeRangeSelector
declare class TimeRangeSelector extends Component<any, any, any> {
  constructor(props: any)
  submit(start: any, end: any): void
  setUnit(which: any, allBounds: any, unit: any, offset: any): void
  last30days: () => void
}
declare namespace TimeRangeSelector {
  namespace propTypes {
    const onSubmit: any
    const start: any
    const end: any
    const absoluteStart: any
    const absoluteEnd: any
    const onDiscard: any
  }
}
