import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniqBy } from 'es-toolkit'

import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import {
  getVesselIdFromDatasetConfig,
  isHeatmapVectorsDataview,
} from '@globalfishingwatch/dataviews-client'
import type { ChoiceOption, SelectOption } from '@globalfishingwatch/ui-components'
import { Choice, Select, Spinner } from '@globalfishingwatch/ui-components'

import ContentHeader from 'features/content-panel/ContentHeader'
import ContentMarkdown from 'features/content-panel/ContentMarkdown'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'
import EmptyContent from 'features/content-panel/EmptyContent'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { selectDatasetsStatus } from 'features/datasets/datasets.slice'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import type { UserGuideSection } from 'features/help/UserGuideLink'
import UserGuideLink from 'features/help/UserGuideLink'
import { Route } from 'routes/_app'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './ContentPanel.module.css'

const InfoContainer = () => {
  const { ready: i18nReady } = useTranslation()
  const { sidePanelId, sidePanelSubcontentId } = Route.useSearch()
  const { openSidePanel } = useSidePanel()

  const dataviews = useSelector(selectDataviewInstancesResolved)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const dataview = useMemo(
    () => dataviews.find((d) => d.id === sidePanelId),
    [dataviews, sidePanelId]
  )

  const isHeatmapVector = dataview ? isHeatmapVectorsDataview(dataview) : false

  const options = useMemo(() => {
    if (!i18nReady || !dataview) return []
    const uniqDatasets = dataview.datasets ? uniqBy(dataview.datasets, (d) => d.id) : []
    // Vector dataviews need two datasets to render the vector layer; we only show the first one with translations
    const firstVectorDatasetIndex = isHeatmapVector
      ? uniqDatasets.findIndex((d) => getDatasetConfiguration(d)?.translate === true)
      : -1

    return uniqDatasets
      .flatMap((dataset, index) => {
        const labelString = getDatasetLabel(dataset)
        if (isHeatmapVector && index !== firstVectorDatasetIndex) return []
        if (dataview.config?.type === DataviewType.Track) {
          const datasetConfig = dataview.datasetsConfig?.find((dc) => dc.datasetId === dataset.id)
          if (!datasetConfig) return []
          if (!getVesselIdFromDatasetConfig(datasetConfig)) return []
        } else if (
          dataview.config?.datasets &&
          dataview.config.datasets.length > 0 &&
          !dataview.config.datasets.includes(dataset.id)
        ) {
          return []
        }
        return {
          id: dataset.id,
          label: <DatasetLabel dataset={dataset} />,
          labelString,
        }
      })
      .sort((a, b) => a.labelString.localeCompare(b.labelString))
  }, [dataview, isHeatmapVector, i18nReady])

  const [selectedId, setSelectedId] = useState<string | undefined>(sidePanelSubcontentId)
  const activeTab = useMemo(() => {
    const match = selectedId ? options.find((o) => o.id === selectedId) : undefined
    return match ?? options[0]
  }, [options, selectedId])

  const loading = datasetsStatus === AsyncReducerStatus.Loading

  if (!dataview) return <EmptyContent />

  const isSingleTab = options.length === 1

  let userGuideLink: UserGuideSection | undefined
  if (dataview.category === DataviewCategory.Activity) {
    userGuideLink = dataview.id.includes('presence')
      ? 'activity-vessel-presence'
      : 'activity-fishing'
  } else if (dataview.category === DataviewCategory.Detections) {
    if (dataview.id.includes('viirs')) userGuideLink = 'detections-viirs'
    else if (dataview.id.includes('sar')) userGuideLink = 'detections-sar'
  }

  const updateSubsectionId = (subcontentId?: string) => {
    setSelectedId(subcontentId)
    openSidePanel({ type: 'datasets', id: dataview.id, subcontentId: subcontentId })
  }

  const dataset = dataview.datasets?.find((d) => d.id === activeTab?.id)

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.header)}>
        <ContentHeader
          title={
            <div className={styles.labelContainer}>
              {(dataset?.name ?? activeTab?.labelString) || dataview.name}{' '}
              {userGuideLink && <UserGuideLink section={userGuideLink} />}
            </div>
          }
        />
      </div>
      <div className={cx(styles.scrollContainer)}>
        {!isSingleTab && options.length > 0 && (
          <div className={styles.sourceSelector}>
            {options.length <= 2 ? (
              <Choice
                options={options}
                activeOption={activeTab?.id}
                onSelect={(option) => updateSubsectionId((option as ChoiceOption).id as string)}
                size="medium"
              />
            ) : (
              <Select
                options={options}
                selectedOption={activeTab as SelectOption}
                onSelect={(option) => updateSubsectionId((option as SelectOption).id as string)}
              />
            )}
          </div>
        )}
        <div className={cx(styles.content)}>
          {loading ? (
            <Spinner size="small" />
          ) : (
            <ContentMarkdown>{dataset?.description}</ContentMarkdown>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoContainer
