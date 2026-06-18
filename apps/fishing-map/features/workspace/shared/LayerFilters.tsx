import { Fragment, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import {
  isHeatmapVectorsDataview,
  isTrackDataview,
  type UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { Button } from '@globalfishingwatch/ui-components'

import { getFiltersInDataview } from 'features/dataviews/dataviews.filters'
import { selectDataviewInstancesByCategory } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'
import UserGuideLink from 'features/help/UserGuideLink'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import {
  useLayerFilterHandlers,
  useLayerFilterState,
} from 'features/workspace/shared/LayerFilters.hooks'
import LayerFiltersGap from 'features/workspace/shared/LayerFiltersGap'
import LayerFiltersSource from 'features/workspace/shared/LayerFiltersSource'
import LayerSchemaFilter from 'features/workspace/shared/LayerSchemaFilter'
import { showSchemaFilter } from 'features/workspace/shared/LayerSchemaFilter.utils'
import { usePorts } from 'utils/ports'
import { listAsSentence } from 'utils/shared'

import { getSourcesOptionsInDataview } from '../activity/activity.utils'

import { isHistogramDataviewSupported } from './layer-properties.utils'

import styles from './LayerFilters.module.css'

type LayerFiltersProps = {
  dataview: UrlDataviewInstance
  showApplyToAll?: boolean
  onConfirmCallback?: () => void
}

const HistogramRangeFilter = lazy(
  () => import('features/workspace/environmental/HistogramRangeFilter')
)

function LayerFilters({
  showApplyToAll,
  dataview: baseDataview,
  onConfirmCallback,
}: LayerFiltersProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const isGuestUser = useSelector(selectIsGuestUser)
  const categoryDataviews = useSelector(selectDataviewInstancesByCategory(baseDataview?.category))
  const vesselGroupsOptions = useVesselGroupsOptions()

  const { vesselGapsThresholdFilter } = useSelector(selectDebugOptions)

  const {
    dataview,
    handleIsOpenChange,
    newDataviewInstanceConfig,
    onConfirmFilters,
    onDataviewFilterChange,
    setNewDataviewInstanceConfig,
  } = useLayerFilterState({ baseDataview, categoryDataviews, onConfirmCallback })

  const {
    onCleanFilterClick,
    onRemoveFilterClick,
    onSelectFilterClick,
    onSelectFilterOperationClick,
    onSelectHistogramRangeFilterClick,
  } = useLayerFilterHandlers({
    dataview,
    onDataviewFilterChange,
    setNewDataviewInstanceConfig,
  })

  const sourceOptions = getSourcesOptionsInDataview(dataview, [DatasetTypes.Fourwings])
  const showSourceFilter =
    sourceOptions && sourceOptions?.length > 1 && !isHeatmapVectorsDataview(dataview)
  const showGapsFilter = isTrackDataview(dataview) && vesselGapsThresholdFilter
  const showHistogramFilter = isHistogramDataviewSupported(dataview)

  const { filtersAllowed, filtersDisabled } = getFiltersInDataview(dataview, {
    vesselGroups: vesselGroupsOptions,
    isGuestUser,
  })

  usePorts(filtersAllowed.some((f) => f.id === 'next_port_id'))

  const showSchemaFilters =
    showHistogramFilter || showSourceFilter || filtersAllowed.some(showSchemaFilter)

  if (!showSchemaFilters) {
    return <p className={styles.placeholder}>{t((t) => t.dataset.emptyFilters)}</p>
  }

  return (
    <Fragment>
      {showSourceFilter && (
        <LayerFiltersSource
          dataview={dataview}
          onSourceChange={onDataviewFilterChange}
          onIsOpenChange={handleIsOpenChange}
        />
      )}
      {showGapsFilter && (
        <LayerFiltersGap dataview={dataview} onGapChange={onDataviewFilterChange} />
      )}
      {showHistogramFilter && (
        <Suspense fallback={null}>
          <HistogramRangeFilter dataview={dataview} onSelect={onSelectHistogramRangeFilterClick} />
        </Suspense>
      )}
      {filtersAllowed.map((schemaFilter) => {
        if (!showSchemaFilter(schemaFilter)) {
          return null
        }
        return (
          <LayerSchemaFilter
            key={schemaFilter.id}
            schemaFilter={schemaFilter}
            onSelect={onSelectFilterClick}
            onSelectOperation={onSelectFilterOperationClick}
            onIsOpenChange={handleIsOpenChange}
            onRemove={onRemoveFilterClick}
            onClean={onCleanFilterClick}
          />
        )
      })}
      <div className={cx(styles.footer, { [styles.spaceBetween]: showApplyToAll })}>
        {showApplyToAll && (
          <Button
            type="secondary"
            disabled={!newDataviewInstanceConfig}
            onClick={() => onConfirmFilters({ applyToAll: true })}
          >
            {t((t) => t.common.applyToAll)}
          </Button>
        )}
        <Button
          disabled={!newDataviewInstanceConfig}
          onClick={() => onConfirmFilters()}
          testId="confirm-filters-button"
        >
          {t((t) => t.common.confirm)}
        </Button>
      </div>
      {filtersDisabled.length >= 1 && (
        <p className={styles.filtersDisabled}>
          {t((t) => t.layer.filtersDisabled, {
            filters: listAsSentence(filtersDisabled.map((filter) => filter.label)) ?? '',
          })}
        </p>
      )}
      {dataview.category === DataviewCategory.Activity && (
        <UserGuideLink slug="filtering-activity-layers" className={styles.userGuideLink} />
      )}
    </Fragment>
  )
}

export default LayerFilters
