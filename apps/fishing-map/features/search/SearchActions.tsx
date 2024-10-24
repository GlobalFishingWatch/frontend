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
import { setVesselGroupConfirmationMode } from 'features/vessel-groups/vessel-groups-modal.slice'
import { HOME, WORKSPACE } from 'routes/routes'
import { EMPTY_FILTERS } from 'features/search/search.config'
import { getRelatedIdentityVesselIds } from 'features/vessel/vessel.utils'
import { TimebarVisualisations } from 'types'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { NEW_VESSEL_GROUP_ID } from 'features/vessel-groups/vessel-groups.hooks'
import { cleanVesselSearchResults, selectSelectedVessels } from './search.slice'
import styles from './Search.module.css'
import { selectSearchOption } from './search.config.selectors'

function SearchActions() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const { dispatchQueryParams, dispatchLocation } = useLocationConnect()
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

  const onAddToVesselGroup = (vesselGroupId: string) => {
    dispatch(setVesselGroupConfirmationMode('saveAndSeeInWorkspace'))
    trackEvent({
      category: TrackCategory.VesselGroups,
      action:
        vesselGroupId === NEW_VESSEL_GROUP_ID
          ? 'create_new_vessel_group_from_search'
          : 'add_vessels_to_vessel_group_from_search',
      label: `${activeSearchOption} search`,
      value: `number of vessel added to group: ${vesselsSelected.length}`,
    })
  }

  const hasVesselsSelected = vesselsSelected.length !== 0

  return (
    <Fragment>
      <VesselGroupAddButton
        vessels={vesselsSelected}
        onAddToVesselGroup={onAddToVesselGroup}
        keepOpenWhileAdding
      >
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
