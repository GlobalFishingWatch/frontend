import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { getFlagsByIds } from 'utils/flags'
import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { isFishingDataview, isPresenceDataview } from 'features/workspace/heatmaps/heatmaps.utils'
import { selectStaticTime } from 'features/timebar/timebar.slice'
import AnalysisLayerPanel from './AnalysisLayerPanel'
import AnalysisItemGraph, { AnalysisGraphProps } from './AnalysisItemGraph'
import styles from './AnalysisItem.module.css'

const sortStrings = (a: string, b: string) => a.localeCompare(b)

const getCommonProperties = (dataviews?: UrlDataviewInstance[]) => {
  const commonProperties: string[] = []
  let title = ''

  if (dataviews && dataviews?.length > 0) {
    const firstDataviewDatasets = dataviews[0].config?.datasets
      ?.slice()
      .sort(sortStrings)
      .join(', ')
    const firstDataviewFlags = dataviews[0].config?.filters?.flag
      ?.slice()
      .sort(sortStrings)
      .join(', ')

    if (dataviews?.every((dataview) => dataview.name === dataviews[0].name)) {
      commonProperties.push('dataset')
      const fishingDataview = isFishingDataview(dataviews[0])
      const presenceDataview = isPresenceDataview(dataviews[0])
      if (fishingDataview || presenceDataview) {
        title = presenceDataview
          ? t(`common.presence`, 'Fishing presence')
          : t(`common.apparentFishing`, 'Apparent Fishing Effort')
      } else {
        title += dataviews[0].name
      }
    }

    if (
      dataviews?.every((dataview) => {
        const datasets = dataview.config?.datasets?.slice().sort(sortStrings).join(', ')
        return datasets === firstDataviewDatasets
      })
    ) {
      commonProperties.push('source')
      const datasets = dataviews[0].datasets?.filter((d) =>
        dataviews[0].config?.datasets?.includes(d.id)
      )
      if (datasets?.length) {
        title += ` (${datasets?.map((d) => d.name).join(', ')})`
      }
    }

    if (
      dataviews?.every((dataview) => {
        const flags = dataview.config?.filters?.flag?.slice().sort(sortStrings).join(', ')

        return flags === firstDataviewFlags
      })
    ) {
      commonProperties.push('flag')
      const flags = getFlagsByIds(dataviews[0].config?.filters?.flag || [])
      if (firstDataviewFlags)
        title += ` ${t('analysis.vesselFlags', 'by vessels flagged by')} ${flags
          ?.map((d) => d.label)
          .join(', ')}`
    }
  }

  return { title, commonProperties }
}

function AnalysisItem({
  graphData,
  hasAnalysisLayers,
  analysisAreaName,
}: {
  graphData: AnalysisGraphProps
  hasAnalysisLayers: boolean
  analysisAreaName: string
}) {
  const { t } = useTranslation()
  const staticTime = useSelector(selectStaticTime)
  const dataviewsIds = useMemo(() => {
    return graphData.sublayers.map((s) => s.id)
  }, [graphData])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))
  const { title, commonProperties } = useMemo(() => {
    return getCommonProperties(dataviews)
  }, [dataviews])

  let description = analysisAreaName
    ? `${title} ${t('common.in', 'in')} ${analysisAreaName}`
    : title
  if (staticTime) {
    description = `${description} ${t('common.dateRange', {
      start: formatI18nDate(staticTime.start),
      end: formatI18nDate(staticTime.end),
      defaultValue: 'between {{start}} and {{end}}',
    })}.`
  }
  return (
    <div className={styles.container}>
      {hasAnalysisLayers ? (
        <Fragment>
          <h3 className={styles.commonTitle}>{description}</h3>
          <div className={styles.layerPanels}>
            {dataviews?.map((dataview, index) => (
              <AnalysisLayerPanel
                key={dataview.id}
                dataview={dataview}
                index={index}
                hiddenProperties={commonProperties}
              />
            ))}
          </div>
        </Fragment>
      ) : (
        <p className={styles.placeholder}>
          {t('analysis.empty', 'Your selected datasets will appear here')}
        </p>
      )}
      {staticTime && <AnalysisItemGraph graphData={graphData} timeRange={staticTime} />}
    </div>
  )
}

export default AnalysisItem
