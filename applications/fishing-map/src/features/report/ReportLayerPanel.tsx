import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { TagList, Tooltip } from '@globalfishingwatch/ui-components'
import { TagItem } from '@globalfishingwatch/ui-components/dist/tag-list'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from 'types'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { getFlagsByIds } from 'utils/flags'
import { getSchemaFieldsSelectedInDataview } from 'features/datasets/datasets.utils'
import {
  getSourcesSelectedInDataview,
  isFishingDataview,
  isPresenceDataview,
} from 'features/workspace/heatmaps/heatmaps.utils'

type LayerPanelProps = {
  index: number
  dataview: UrlDataviewInstance
}

function ReportLayerPanel({ dataview, index }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const sourcesOptions: TagItem[] = getSourcesSelectedInDataview(dataview)
  const nonVmsSources = sourcesOptions.filter((source) => !source.label.includes('VMS'))
  const vmsSources = sourcesOptions.filter((source) => source.label.includes('VMS'))
  let mergedSourceOptions: TagItem[] = []
  if (vmsSources?.length > 1) {
    mergedSourceOptions = [
      ...nonVmsSources,
      {
        id: 'vms-grouped',
        label: `VMS (${vmsSources.length} ${t('common.country_plural', 'countries')})`,
        tooltip: vmsSources.map((source) => source.label).join(', '),
      },
    ]
  }

  const fishingFiltersOptions = getFlagsByIds(dataview.config?.filters?.flag || [])
  const gearTypesSelected = getSchemaFieldsSelectedInDataview(dataview, 'geartype')
  const fleetsSelected = getSchemaFieldsSelectedInDataview(dataview, 'fleet')
  const vesselsSelected = getSchemaFieldsSelectedInDataview(dataview, 'vessel_type')

  const fishignDataview = isFishingDataview(dataview)
  const presenceDataview = isPresenceDataview(dataview)
  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)

  let datasetName = dataset ? t(`datasets:${dataset?.id}.name`) : dataview.name || ''
  if (fishignDataview || presenceDataview) {
    datasetName = presenceDataview
      ? t(`common.presence`, 'Fishing presence')
      : t(`common.apparentFishing`, 'Apparent Fishing Effort')
  }
  const TitleComponent = <h3 className={styles.name}>{datasetName}</h3>
  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: false,
        [styles.noBorder]: false,
      })}
    >
      <div className={styles.header}>
        {datasetName.length > 24 ? (
          <Tooltip content={datasetName}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
      </div>
      <div className={styles.properties}>
        <div className={styles.filters}>
          {sourcesOptions?.length > 0 && (
            <div className={styles.filter}>
              <label>{t('layer.source_plural', 'Sources')}</label>
              <TagList
                tags={sourcesOptions}
                color={dataview.config?.color}
                className={cx(styles.tagList, {
                  [styles.hidden]: mergedSourceOptions?.length > 0,
                })}
              />
              {mergedSourceOptions.length > 0 && (
                <TagList
                  tags={mergedSourceOptions}
                  color={dataview.config?.color}
                  className={styles.mergedTagList}
                />
              )}
            </div>
          )}
          {fishingFiltersOptions.length > 0 && (
            <div className={styles.filter}>
              <label>{t('layer.flagState_plural', 'Flag States')}</label>
              <TagList
                tags={fishingFiltersOptions}
                color={dataview.config?.color}
                className={styles.tagList}
              />
            </div>
          )}
          {gearTypesSelected.length > 0 && (
            <div className={styles.filter}>
              <label>{t('layer.gearType_plural', 'Gear types')}</label>
              <TagList
                tags={gearTypesSelected}
                color={dataview.config?.color}
                className={styles.tagList}
              />
            </div>
          )}
          {fleetsSelected.length > 0 && (
            <div className={styles.filter}>
              <label>{t('layer.fleet_plural', 'Fleets')}</label>
              <TagList
                tags={fleetsSelected}
                color={dataview.config?.color}
                className={styles.tagList}
              />
            </div>
          )}
          {vesselsSelected.length > 0 && (
            <div className={styles.filter}>
              <label>{t('vessel.vesselType_plural', 'Vessel types')}</label>
              <TagList
                tags={vesselsSelected}
                color={dataview.config?.color}
                className={styles.tagList}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportLayerPanel
