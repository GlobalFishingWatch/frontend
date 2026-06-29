import { useMemo } from 'react'
import type { OrthographicViewState } from '@deck.gl/core'
import { OrthographicView } from '@deck.gl/core'
import DeckGL from '@deck.gl/react'
import { useAtomValue } from 'jotai'

import { useTimelineContext } from '../timeline/timeline-context'

import { useOuterScale, useTimebarTimeOrigin } from './charts.hooks'
import { activeChartLayersState } from './charts-store.atom'

const VIEW = new OrthographicView({ id: '2d-scene', controller: false })
const GRAPH_STYLE = { zIndex: '0' }
const WRAPPER_STYLE = { position: 'absolute', top: 0, left: 0, zIndex: 0 } as const

const TimebarDeckglWrapper = () => {
  const { outerWidth, graphHeight } = useTimelineContext()
  const outerScale = useOuterScale()
  const origin = useTimebarTimeOrigin()
  const layers = useAtomValue(activeChartLayersState)

  const viewState = useMemo(() => {
    const [d0, d1] = outerScale.domain()
    const startMs = d0.getTime()
    const endMs = d1.getTime()
    const spanMs = endMs - startMs
    return {
      target: [(startMs + endMs) / 2 - origin, graphHeight / 2, 0],
      zoom: [Math.log2(outerWidth / spanMs), 0],
    } as OrthographicViewState
  }, [outerScale, outerWidth, graphHeight, origin])

  if (!outerWidth || !graphHeight || !layers.length) {
    return null
  }

  return (
    <div style={WRAPPER_STYLE}>
      <DeckGL
        views={VIEW}
        viewState={viewState}
        layers={layers}
        width={outerWidth}
        height={graphHeight}
        style={GRAPH_STYLE}
        pickingRadius={4}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
      />
    </div>
  )
}

export default TimebarDeckglWrapper
