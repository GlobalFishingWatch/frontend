import { Fragment } from 'react'
import { useSelector } from 'react-redux'
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
import VesselGroupAddButton, {
  VesselGroupAddActionButton,
} from 'features/vessel-groups/VesselGroupAddButton'
import { selectActiveActivityAndDetectionsDataviews } from 'features/dataviews/selectors/dataviews.selectors'
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
import { selectSearchOption } from './search.config.selectors'

function SearchActions() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const { dispatchQueryParams, dispatchLocation } = useLocationConnect()
  const heatmapDataviews = useSelector(selectActiveActivityAndDetectionsDataviews)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const activeSearchOption = useSelector(selectSearchOption)

  const onSeeVesselsInMapClick = () => {
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
    dispatch(cleanVesselSearchResults())
    dispatchQueryParams(EMPTY_FILTERS)
    trackEvent({
      category: TrackCategory.SearchVessel,
      action: 'Click view on map',
      label: `${activeSearchOption} search`,
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
    dispatch(setVesselGroupConfirmationMode('saveAndSeeInWorkspace'))
    if (dataviewIds?.length) {
      dispatch(setVesselGroupCurrentDataviewIds(dataviewIds))
    }
    trackEvent({
      category: TrackCategory.SearchVessel,
      action: 'Click add to vessel group',
      label: `${activeSearchOption} search`,
    })
  }

  const hasVesselsSelected = vesselsSelected.length !== 0

  return (
    <Fragment>
      <VesselGroupAddButton vessels={vesselsSelected} onAddToVesselGroup={onAddToVesselGroup}>
        <VesselGroupAddActionButton className={cx(styles.footerAction, styles.vesselGroupButton)} />
      </VesselGroupAddButton>
      <Button
        className={styles.footerAction}
        onClick={onSeeVesselsInMapClick}
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
