import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { DeckLegendAtom } from '@globalfishingwatch/deck-layer-composer'
import { useGetDeckLayerLegend } from '@globalfishingwatch/deck-layer-composer'
import type { ColorRampBrushRange, UILegend } from '@globalfishingwatch/ui-components'
import { LegendType, MapLegend, Tooltip } from '@globalfishingwatch/ui-components'

import { useActivityDataviewId } from 'features/_map/map/map-layers.hooks'
import MapLegendPlaceholder from 'features/_map/workspace/shared/MapLegendPlaceholder'
import { useDataviewInstancesConnect } from 'features/_map/workspace/workspace.hook'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { t } from 'features/i18n/i18n'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'
import { getEventLabel } from 'utils/analytics'

import styles from './MapLegend.module.css'

const BRUSH_CATEGORIES = [DataviewCategory.Activity, DataviewCategory.Detections]

type LegendScale = {
  domain: number[]
  ranges: DeckLegendAtom['ranges']
  sublayerIndex: number
}

const getLegendLabelTranslated = (legend?: DeckLegendAtom, tFn = t) => {
  if (!legend) {
    return {} as DeckLegendAtom
  }
  let label =
    legend.unit === 'hours'
      ? tFn((t) => t.common.hours, { defaultValue: 'hours' }).toLowerCase()
      : legend.unit === 'detections'
        ? tFn((t) => t.common.detections, { defaultValue: 'detections' }).toLowerCase()
        : legend.unit === 'm/s'
          ? tFn((t) => t.common['m/s'], { defaultValue: 'm/s' }).toLowerCase()
          : legend.label

  if (legend.label?.includes('²')) {
    const isSquareKm = (legend.gridArea as number) > 50000
    const gridArea = isSquareKm ? (legend.gridArea as number) / 1000000 : legend.gridArea
    const gridAreaFormatted = gridArea
      ? formatI18nNumber(gridArea, {
          style: 'unit',
          unit: isSquareKm ? 'kilometer' : 'meter',
          unitDisplay: 'short',
        })
      : ''
    label = `${label} / ${gridAreaFormatted}²`
  }
  return { ...legend, label } as DeckLegendAtom
}

const MapLegendWrapper = ({
  dataview,
  showPlaceholder = true,
}: {
  dataview: UrlDataviewInstance
  showPlaceholder?: boolean
}) => {
  const { t } = useTranslation()
  const dataviewId = useActivityDataviewId(dataview)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [lastScale, setLastScale] = useState<LegendScale | undefined>(undefined)
  const deckLegend = getLegendLabelTranslated(useGetDeckLayerLegend(dataviewId))
  const isBivariate = deckLegend?.type === LegendType.Bivariate

  const onBrushChange = useCallback(
    ([minVisibleValue, maxVisibleValue]: ColorRampBrushRange) => {
      // Written against the dataview id, not the merged layer id every activity dataview shares
      upsertDataviewInstance({ id: dataview.id, config: { minVisibleValue, maxVisibleValue } })
      trackEvent({
        category: TrackCategory.ActivityData,
        action: `Filter ${dataview.category} layer by value`,
        label: getEventLabel([dataview.name as string, `${minVisibleValue}`, `${maxVisibleValue}`]),
      })
    },
    [dataview.category, dataview.id, dataview.name, upsertDataviewInstance]
  )

  const isSymbols = deckLegend?.type === LegendType.Symbols
  const legendSublayerIndex = deckLegend?.sublayers?.findIndex(
    (sublayer) => sublayer.id === dataview.id
  )

  const hasScale =
    legendSublayerIndex >= 0 && !!deckLegend?.ranges?.length && !!deckLegend?.domain?.length
  const currentScale = useMemo(
    () =>
      hasScale
        ? {
            domain: deckLegend.domain as number[],
            ranges: deckLegend.ranges,
            sublayerIndex: legendSublayerIndex,
          }
        : undefined,
    [hasScale, deckLegend.domain, deckLegend.ranges, legendSublayerIndex]
  )
  useEffect(() => {
    if (currentScale) {
      setLastScale(currentScale)
    }
  }, [currentScale])

  if (!deckLegend) {
    return null
  }
  if (isBivariate && legendSublayerIndex !== 0) {
    return null
  }

  const scale = currentScale || lastScale
  if (!scale) {
    return showPlaceholder ? <MapLegendPlaceholder /> : null
  }

  const { domain, ranges, sublayerIndex } = scale
  const colors =
    isBivariate || isSymbols ? (ranges as string[]) : (ranges[sublayerIndex] as string[])
  const uiLegend: UILegend = {
    id: deckLegend.id,
    type: deckLegend?.type,
    values: domain,
    colors,
    currentValue: isBivariate
      ? deckLegend.currentValues
      : deckLegend.currentValues?.[sublayerIndex],
    label: deckLegend.label || '',
  }

  const showBrush = !isBivariate && !isSymbols && BRUSH_CATEGORIES.includes(dataview.category!)

  return (
    <MapLegend
      layer={uiLegend}
      className={styles.legend}
      roundValues={dataview.category !== DataviewCategory.Environment}
      currentValueClassName={styles.currentValue}
      {...(showBrush && {
        brushRange: [dataview.config?.minVisibleValue, dataview.config?.maxVisibleValue],
        onBrushChange,
        brushLabel: t((t) => t.layer.filterValues),
        brushMinLabel: t((t) => t.layer.filterValuesMin),
        brushMaxLabel: t((t) => t.layer.filterValuesMax),
        brushRemoveLabel: t((t) => t.layer.filterValuesRemove),
      })}
      labelComponent={
        uiLegend.label?.includes('²') ? (
          <Tooltip content={t((t) => t.map.legend_help)}>
            <span className={cx(styles.legendLabel, styles.help)}>{uiLegend.label}</span>
          </Tooltip>
        ) : (
          <span className={styles.legendLabel}>{uiLegend.label}</span>
        )
      }
    />
  )
}

export default MapLegendWrapper
