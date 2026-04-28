import { useEffect, useMemo, useState } from 'react'
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

import { fetchSidePanelContent } from 'features/content/content.queries'
import ContentHeader from 'features/content/ContentHeader'
import EmptyContent from 'features/content/EmptyContent'
import type { TDataset } from 'features/content/strapi.types'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import type { UserGuideSection } from 'features/help/UserGuideLink'
import UserGuideLink from 'features/help/UserGuideLink'
import { Route } from 'routes/_app'
import { htmlSafeParse } from 'utils/html-parser'

import styles from './ContentPanel.module.css'

const InfoContainer = () => {
  const { i18n, ready: i18nReady } = useTranslation()
  const { sidePanelId } = Route.useSearch()
  const dataviews = useSelector(selectDataviewInstancesResolved)
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

  const [selectedId, setSelectedId] = useState<string | undefined>()
  const activeTab = useMemo(() => {
    const match = selectedId ? options.find((o) => o.id === selectedId) : undefined
    return match ?? options[0]
  }, [options, selectedId])

  const fetchKey = activeTab?.id ? `${activeTab.id}|${i18n.language}` : undefined
  const [fetched, setFetched] = useState<{ key: string; data: TDataset | null } | null>(null)
  const loading = fetchKey ? fetched?.key !== fetchKey : false
  const strapiDataset = fetched && fetched.key === fetchKey ? fetched.data : null

  useEffect(() => {
    if (!fetchKey || !activeTab?.id) return
    let cancelled = false
    fetchSidePanelContent('datasets', activeTab.id as string, i18n.language)
      ?.then((response) => {
        if (cancelled) return
        setFetched({ key: fetchKey, data: (response?.data?.[0] as TDataset) ?? null })
      })
      .catch((e) => {
        if (!cancelled) console.error('Strapi dataset fetch error:', e)
      })
    return () => {
      cancelled = true
    }
  }, [fetchKey, activeTab?.id, i18n.language])

  if (!dataview) return <EmptyContent />

  const isSingleTab = options.length === 1

  let userGuideLink: UserGuideSection | undefined
  if (dataview.category === DataviewCategory.Activity) {
    userGuideLink = dataview.id.includes('presence') ? 'activity-presence' : 'activity-fishing'
  } else if (dataview.category === DataviewCategory.Detections) {
    if (dataview.id.includes('viirs')) userGuideLink = 'detections'
    else if (dataview.id.includes('sar')) userGuideLink = 'detections'
  }

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.header)}>
        <ContentHeader title={(strapiDataset?.title ?? activeTab?.labelString) || dataview.name} />
      </div>
      <div className={cx(styles.scrollContainer)}>
        {!isSingleTab && options.length > 0 && (
          <div className={cx(styles.sourceSelector)}>
            {options.length <= 3 ? (
              <Choice
                options={options}
                activeOption={activeTab?.id}
                onSelect={(option) => setSelectedId((option as ChoiceOption).id as string)}
                size="medium"
              />
            ) : (
              <Select
                options={options}
                selectedOption={activeTab as SelectOption}
                onSelect={(option) => setSelectedId((option as SelectOption).id as string)}
              />
            )}
          </div>
        )}
        <div className={cx(styles.content)}>
          {userGuideLink && <UserGuideLink section={userGuideLink} />}
          {loading ? (
            <Spinner size="small" />
          ) : strapiDataset?.body ? (
            htmlSafeParse(strapiDataset.body)
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default InfoContainer
