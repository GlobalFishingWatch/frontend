import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { LegendLayer, LegendLayerBivariate } from '@globalfishingwatch/react-hooks'
import { isMergedAnimatedGenerator } from '@globalfishingwatch/dataviews-client'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { formatI18nNumber } from 'features/i18n/i18nNumber'

export type AnyLegend = LegendLayer | LegendLayerBivariate
export type LegendTranslated = AnyLegend & { label: string }

export const useLegendsTranslated = (legends: AnyLegend[], portalled = true) => {
  const { t } = useTranslation()
  return useMemo(() => {
    return legends
      ?.filter(
        (legend) => portalled || (!portalled && isMergedAnimatedGenerator(legend.generatorId))
      )
      .map((legend) => {
        const isSquareKm = (legend.gridArea as number) > 50000
        let label = legend.unit || ''
        if (legend.generatorType === GeneratorType.HeatmapAnimated) {
          const gridArea = isSquareKm ? (legend.gridArea as number) / 1000000 : legend.gridArea
          const gridAreaFormatted = gridArea
            ? formatI18nNumber(gridArea, {
                style: 'unit',
                unit: isSquareKm ? 'kilometer' : 'meter',
                unitDisplay: 'short',
              })
            : ''
          if (legend.unit === 'hours') {
            label = `${t('common.hour_other', 'hours')} / ${gridAreaFormatted}²`
          }
          if (legend.unit === 'detections') {
            label = `${t('common.detections', 'detections').toLowerCase()} / ${gridAreaFormatted}²`
          }
        }
        return { ...legend, label }
      })
  }, [legends, t, portalled])
}
