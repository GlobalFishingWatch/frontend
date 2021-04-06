import { Component } from 'react'
export default Playback
declare class Playback extends Component<any, any, any> {
  static contextType: any
  constructor()
  lastUpdateMs: any
  getStep: (this: any, start: any, end: any, speedStep: any) => number
  update: (deltaMultiplicatorMs: any) => boolean
  tick: (elapsedMs: any) => void
  requestAnimationFrame: number
  togglePlay: (force: any) => void
  onPlayToggleClick: () => void
  toggleLoop: () => void
  onForwardClick: () => void
  onBackwardClick: () => void
  onSpeedClick: () => void
}
declare namespace Playback {
  namespace propTypes {
    const onTick: any
    const start: any
    const end: any
    const absoluteStart: any
    const absoluteEnd: any
    const onTogglePlay: any
  }
  namespace defaultProps {
    export function onTogglePlay_1(): void
    export { onTogglePlay_1 as onTogglePlay }
  }
}
