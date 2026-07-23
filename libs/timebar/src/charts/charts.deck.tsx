import { useMemo } from 'react'
import type { OrthographicViewState } from '@deck.gl/core'
import { OrthographicView } from '@deck.gl/core'
import DeckGL from '@deck.gl/react'
import { _StatsWidget as StatsWidget } from '@deck.gl/widgets'
import cx from 'classnames'
import { useAtomValue } from 'jotai'

import { useTimelineContext } from '../timeline/timeline-context'

import { useOuterScale, useTimebarTimeOrigin } from './charts.hooks'
import { activeChartLayersState, isAnyChartLoading } from './charts-store.atom'

import styles from './charts.module.css'

const VIEW = new OrthographicView({ id: '2d-scene', controller: false })
const WRAPPER_STYLE = { position: 'absolute', top: 0, left: 0 } as const

const TimebarDeckglWrapper = ({ showDeckStats = false }: { showDeckStats?: boolean }) => {
  const { outerWidth, graphHeight } = useTimelineContext()
  const outerScale = useOuterScale()
  const origin = useTimebarTimeOrigin()
  const layers = useAtomValue(activeChartLayersState)
  const loading = useAtomValue(isAnyChartLoading)

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
    <div style={WRAPPER_STYLE} className={cx(styles.charts, { [styles.loading]: loading })}>
      <DeckGL
        views={VIEW}
        viewState={viewState}
        layers={layers}
        width={outerWidth}
        height={graphHeight}
        pickingRadius={10}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
        widgets={
          showDeckStats
            ? [
                new StatsWidget({
                  title: 'Timebar stats',
                  initialExpanded: true,
                }),
              ]
            : []
        }
      />
    </div>
  )
}

export default TimebarDeckglWrapper
