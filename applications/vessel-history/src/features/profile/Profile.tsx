import React, { Fragment, useState, useEffect, useMemo, useCallback } from 'react'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Spinner, Tabs } from '@globalfishingwatch/ui-components'
import { Tab } from '@globalfishingwatch/ui-components/dist/tabs'
import { DatasetTypes } from '@globalfishingwatch/api-types/dist'
import { VesselAPISource } from 'types'
import I18nDate from 'features/i18n/i18nDate'
import {
  selectSearchableQueryParams,
  selectUrlAkaVesselQuery,
  selectVesselProfileId,
} from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import {
  clearVesselDataview,
  fetchVesselByIdThunk,
  selectVesselById,
  selectVesselsStatus,
  upsertVesselDataview,
} from 'features/vessels/vessels.slice'
import Map from 'features/map/Map'
import {
  getRelatedDatasetByType,
  getRelatedDatasetsByType,
} from 'features/datasets/datasets.selectors'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectDataviewsResourceQueries } from 'features/dataviews/dataviews.selectors'
import { selectDatasets } from 'features/datasets/datasets.slice'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { resetFilters } from 'features/event-filters/filters.slice'
import { selectVesselDataviewMatchesCurrentVessel } from 'features/vessels/vessels.selectors'
import { parseVesselProfileId } from 'features/vessels/vessels.utils'
import { useLocationConnect } from 'routes/routes.hook'
import Info from './components/Info'
import Activity from './components/activity/Activity'
import styles from './Profile.module.css'

const Profile: React.FC = (props): React.ReactElement => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [lastPortVisit] = useState({ label: '', coordinates: null })
  const [lastPosition] = useState(null)
  const query = useSelector(selectSearchableQueryParams)
  const vesselProfileId = useSelector(selectVesselProfileId)
  const akaVesselProfileIds = useSelector(selectUrlAkaVesselQuery)
  const { dispatchLocation } = useLocationConnect()
  const vesselStatus = useSelector(selectVesselsStatus)
  const loading = useMemo(() => vesselStatus === AsyncReducerStatus.LoadingItem, [vesselStatus])
  const vessel = useSelector(selectVesselById(vesselProfileId))
  const datasets = useSelector(selectDatasets)
  const resourceQueries = useSelector(selectDataviewsResourceQueries)
  const vesselDataviewLoaded = useSelector(selectVesselDataviewMatchesCurrentVessel)
  const isMergedVesselsView = useMemo(
    () => akaVesselProfileIds && akaVesselProfileIds.length > 0,
    [akaVesselProfileIds]
  )

  useEffect(() => {
    const fetchVessel = async () => {
      dispatch(clearVesselDataview(null))
      const [dataset, gfwId] = (
        Array.from(new URLSearchParams(vesselProfileId).keys()).shift() ?? ''
      ).split('_')
      const action = await dispatch(fetchVesselByIdThunk(vesselProfileId))
      if (dataset && gfwId && fetchVesselByIdThunk.fulfilled.match(action as any)) {
        const vesselDataset = datasets
          .filter((ds) => ds.id === dataset)
          .slice(0, 1)
          .shift()
        if (vesselDataset) {
          const trackDatasetId = getRelatedDatasetByType(vesselDataset, DatasetTypes.Tracks)?.id
          if (trackDatasetId) {
            const eventsRelatedDatasets = getRelatedDatasetsByType(
              vesselDataset,
              DatasetTypes.Events
            )

            const eventsDatasetsId =
              eventsRelatedDatasets && eventsRelatedDatasets?.length
                ? eventsRelatedDatasets.map((d) => d.id)
                : []

            // Only merge with vessels of the same dataset that the main vessel
            const akaVesselsIds = (akaVesselProfileIds ?? [])
              .map((vesselProfileId) => parseVesselProfileId(vesselProfileId))
              .filter((akaVessel) => akaVessel.dataset === dataset && akaVessel.id)
            const vesselDataviewInstance = getVesselDataviewInstance(
              { id: gfwId },
              {
                trackDatasetId: trackDatasetId as string,
                infoDatasetId: dataset,
                ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
              },
              akaVesselsIds as { id: string }[]
            )
            dispatch(upsertVesselDataview(vesselDataviewInstance))
          }
        }
      }
    }

    if (datasets.length > 0) {
      fetchVessel()
      dispatch(resetFilters())
    }
  }, [dispatch, vesselProfileId, datasets, akaVesselProfileIds])

  const onBackClick = useCallback(() => {
    const location = {
      type: HOME,
      ...(query && { replaceQuery: true, query }),
    }
    dispatchLocation(location)
    uaEvent({
      category: 'Vessel Detail',
      action: 'Click to go back to search',
    })
  }, [dispatchLocation, query])

  useEffect(() => {
    if (vesselDataviewLoaded && resourceQueries && resourceQueries.length > 0) {
      resourceQueries.forEach((resourceQuery) => {
        dispatch(fetchResourceThunk(resourceQuery))
      })
    }
  }, [dispatch, loading, resourceQueries, vessel, vesselDataviewLoaded])

  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 'info',
        title: t('common.info', 'INFO').toLocaleUpperCase(),
        content: vessel ? (
          <Info
            vessel={vessel}
            lastPosition={lastPosition}
            lastPortVisit={lastPortVisit}
            onMoveToMap={() => setActiveTab(tabs?.[2])}
          />
        ) : (
          <Fragment>{loading && <Spinner className={styles.spinnerFull} />}</Fragment>
        ),
      },
      {
        id: 'activity',
        title: t('common.activity', 'ACTIVITY').toLocaleUpperCase(),
        content: vessel ? (
          <Activity
            vessel={vessel}
            lastPosition={lastPosition}
            lastPortVisit={lastPortVisit}
            onMoveToMap={() => setActiveTab(tabs?.[2])}
          />
        ) : (
          <Fragment>{loading && <Spinner className={styles.spinnerFull} />}</Fragment>
        ),
      },
      {
        id: 'map',
        title: t('common.map', 'MAP').toLocaleUpperCase(),
        content: vessel ? (
          <div className={styles.mapContainer}>
            <Map />
          </div>
        ) : (
          <Fragment>{loading && <Spinner className={styles.spinnerFull}></Spinner>}</Fragment>
        ),
      },
    ],
    [t, vessel, lastPosition, lastPortVisit, loading]
  )

  const [activeTab, setActiveTab] = useState<Tab | undefined>(tabs?.[0])

  const defaultPreviousNames = useMemo(() => {
    return `+${vessel?.history.shipname.byDate.length} previous ${t(
      `vessel.name_plural` as any,
      'names'
    ).toLocaleUpperCase()}`
  }, [vessel, t])

  const sinceShipname = useMemo(
    () => vessel?.history.shipname.byDate.slice(0, 1)?.shift()?.firstSeen,
    [vessel]
  )

  const shipName = useMemo(() => {
    const gfwVesselName = vessel?.history.shipname.byDate.find(
      (name) => name.source === VesselAPISource.GFW
    )
    return gfwVesselName ? gfwVesselName.value : vessel?.shipname
  }, [vessel])

  return (
    <Fragment>
      <header className={styles.header}>
        <IconButton
          onClick={onBackClick}
          type="border"
          size="default"
          icon="arrow-left"
          className={styles.backButton}
        />
        {vessel && (
          <h1>
            {shipName ?? t('common.unknownName', 'Unknown name')}
            {isMergedVesselsView &&
              ` (${t('vessel.nVesselsMerged', '{{count}} merged', {
                count: akaVesselProfileIds.length + 1,
              })})`}
            {vessel.history.shipname.byDate.length > 1 && (
              <p>
                {t('vessel.plusPreviousValuesByField', defaultPreviousNames, {
                  quantity: vessel.history.shipname.byDate.length,
                  fieldLabel: t(`vessel.name_plural` as any, 'names').toLocaleUpperCase(),
                })}
              </p>
            )}
            {vessel.history.shipname.byDate.length === 1 && sinceShipname && (
              <p>
                {t('common.since', 'Since')} <I18nDate date={sinceShipname} />
              </p>
            )}
          </h1>
        )}
      </header>
      <div className={styles.profileContainer}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab?.id as string}
          onTabClick={(tab: Tab) => {
            setActiveTab(tab)
            if (tab.id === 'activity') {
              uaEvent({
                category: 'Vessel Detail ACTIVITY Tab',
                action: 'See Activity Tab',
              })
            }
            if (tab.id === 'map') {
              uaEvent({
                category: 'Vessel Detail MAP Tab',
                action: 'See MAP Tab',
                label: 'global tab',
              })
            }
          }}
        ></Tabs>
      </div>
    </Fragment>
  )
}

export default Profile
