import type { RefObject } from 'react'
import { useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import type { SetTimelineState } from './timeline-drag.utils'
import { INNER_END_RATIO, INNER_START_RATIO } from './timeline-drag.utils'

type Params = {
  nodeRef: RefObject<HTMLDivElement | null>
  graphContainerRef: RefObject<HTMLDivElement | null>
  setState: SetTimelineState
}

export function useTimelineLayout({ nodeRef, graphContainerRef, setState }: Params) {
  useEffect(() => {
    const onWindowResize = () => {
      const graphContainer = graphContainerRef.current
      if (graphContainer !== null && typeof window !== 'undefined') {
        const graphStyle = window.getComputedStyle(graphContainer)
        const boundingRect = graphContainer.getBoundingClientRect()
        if (!boundingRect.left || !boundingRect.width) {
          return
        }
        const outerX = boundingRect.left
        const relativeOffsetX = -(nodeRef.current?.offsetLeft ?? 0)
        const outerWidth = parseFloat(graphStyle.width)
        const outerHeight = parseFloat(graphStyle.height)
        setState({
          outerX,
          innerStartPx: outerWidth * INNER_START_RATIO,
          innerEndPx: outerWidth * INNER_END_RATIO,
          innerWidth: outerWidth * (INNER_END_RATIO - INNER_START_RATIO),
          outerWidth,
          outerHeight,
          relativeOffsetX,
        })
      }
    }

    // wait for end of call stack to get rendered CSS
    const resizeTimeout = window.setTimeout(onWindowResize, 10)
    let resizeObserver: ResizeObserver | null = null
    if (window.ResizeObserver && nodeRef.current) {
      resizeObserver = new ResizeObserver(onWindowResize)
      resizeObserver.observe(nodeRef.current)
    } else {
      window.addEventListener('resize', onWindowResize)
    }

    const node = nodeRef.current
    return () => {
      window.removeEventListener('resize', onWindowResize)
      window.clearTimeout(resizeTimeout)
      if (resizeObserver && node) {
        resizeObserver.unobserve(node)
      }
    }
    // Mounted once: reads happen through stable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
