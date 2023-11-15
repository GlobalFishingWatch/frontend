import { Fragment } from 'react'
import { batch, useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { Button } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectCurrentWorkspaceId } from 'features/workspace/workspace.selectors'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { getRelatedDatasetByType, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import {
  setVesselGroupConfirmationMode,
  setVesselGroupCurrentDataviewIds,
} from 'features/vessel-groups/vessel-groups.slice'
import { HOME, WORKSPACE } from 'routes/routes'
import { EMPTY_FILTERS } from 'features/search/search.config'
import { getRelatedIdentityVesselIds } from 'features/vessel/vessel.utils'
import { TimebarVisualisations } from 'types'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { cleanVesselSearchResults, selectSelectedVessels } from './search.slice'
import styles from './Search.module.css'

function SearchActions() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const { dispatchQueryParams, dispatchLocation } = useLocationConnect()
  const heatmapDataviews = useSelector(selectActiveHeatmapDataviews)
  const vesselsSelected = useSelector(selectSelectedVessels)

  const onConfirmSelection = () => {
    const instances = vesselsSelected.map((vessel) => {
      const eventsRelatedDatasets = getRelatedDatasetsByType(vessel.dataset, DatasetTypes.Events)
      const eventsDatasetsId =
        eventsRelatedDatasets && eventsRelatedDatasets?.length
          ? eventsRelatedDatasets.map((d) => d.id)
          : []
      const trackDatasetId = getRelatedDatasetByType(vessel.dataset, DatasetTypes.Tracks)?.id
      const vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        track: trackDatasetId,
        info: vessel.dataset.id,
        ...(eventsDatasetsId.length > 0 && { events: eventsDatasetsId }),
        relatedVesselIds: getRelatedIdentityVesselIds(vessel),
      })
      return vesselDataviewInstance
    })
    addNewDataviewInstances(instances)
    batch(() => {
      dispatch(cleanVesselSearchResults())
      dispatchQueryParams(EMPTY_FILTERS)
    })
    if (workspaceId) {
      dispatchLocation(WORKSPACE, {
        payload: { workspaceId },
        query: { timebarVisualisation: TimebarVisualisations.Vessel },
      })
    } else {
      dispatchLocation(HOME, {
        query: { timebarVisualisation: TimebarVisualisations.Vessel },
      })
    }
  }

  const onAddToVesselGroup = () => {
    const dataviewIds = heatmapDataviews.map(({ id }) => id)
    batch(() => {
      dispatch(setVesselGroupConfirmationMode('saveAndNavigate'))
      if (dataviewIds?.length) {
        dispatch(setVesselGroupCurrentDataviewIds(dataviewIds))
      }
    })
    trackEvent({
      category: TrackCategory.VesselGroups,
      action: 'add_to_vessel_group',
      label: 'search',
    })
  }

  const hasVesselsSelected = vesselsSelected.length !== 0

  return (
    <Fragment>
      <VesselGroupAddButton
        vessels={vesselsSelected}
        onAddToVesselGroup={onAddToVesselGroup}
        showCount={false}
        buttonClassName={cx(styles.footerAction, styles.vesselGroupButton)}
      />
      <Button
        className={styles.footerAction}
        onClick={onConfirmSelection}
        disabled={!hasVesselsSelected}
        testId="search-vessels-add-vessel"
        tooltip={
          !hasVesselsSelected
            ? t('search.selectVesselResults', 'Select results to see vessels on map')
            : ''
        }
      >
        {t('search.seeVesselsOnMap', {
          defaultValue: 'See vessels on map',
          ...(hasVesselsSelected && { count: vesselsSelected.length }),
        })}
      </Button>
    </Fragment>
  )
}

export default SearchActions
