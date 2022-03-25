import React, { Fragment, useState, useEffect, useMemo, useCallback } from 'react'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Spinner, Tabs, Tab } from '@globalfishingwatch/ui-components'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { VesselAPISource } from 'types'
import I18nDate from 'features/i18n/i18nDate'
import {
  selectMergedVesselId,
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
import { setHighlightedEvent, setVoyageTime } from 'features/map/map.slice'
import { useLocationConnect } from 'routes/routes.hook'
import { countFilteredEventsHighlighted } from 'features/vessels/activity/vessels-activity.selectors'
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
  const { dispatchLocation } = useLocationConnect()
  const vesselStatus = useSelector(selectVesselsStatus)
  const loading = useMemo(() => vesselStatus === AsyncReducerStatus.LoadingItem, [vesselStatus])
  const akaVesselProfileIds = useSelector(selectUrlAkaVesselQuery)
  const mergedVesselId = useSelector(selectMergedVesselId)
  const vessel = useSelector(selectVesselById(mergedVesselId))
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
      let [dataset, gfwId, tmtId] = (
        Array.from(new URLSearchParams(vesselProfileId).keys()).shift() ?? ''
      ).split('_')

      if (akaVesselProfileIds && dataset.toLocaleLowerCase() === 'na') {
        const gfwAka = akaVesselProfileIds.find((aka) => {
          const [akaDataset] = aka.split('_')
          return akaDataset.toLocaleLowerCase() !== 'na'
        })
        if (gfwAka) {
          const [akaDataset, akaGfwId, akaTmt] = gfwAka.split('_')
          dataset = akaDataset
          gfwId = akaGfwId
          tmtId = akaTmt
        }
      }
      const action = await dispatch(
        fetchVesselByIdThunk({
          id: vesselProfileId,
          akas: akaVesselProfileIds,
        })
      )
      if (fetchVesselByIdThunk.fulfilled.match(action as any)) {
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
            const akaVesselsIds = [
              {
                dataset,
                id: gfwId,
                vesselMatchId: tmtId,
              },
            ]
              .concat(parseVesselProfileId(vesselProfileId))
              // I generate the list with all so doesn't care what vessel is in the path
              .concat((akaVesselProfileIds ?? []).map((akaId) => parseVesselProfileId(akaId)))
              // Now we filter to get only gfw vessels and not repeat the main (from path o query)
              .filter(
                (akaVessel) =>
                  akaVessel.dataset === dataset && akaVessel.id && akaVessel.id !== gfwId
              )

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

    if (datasets.length > 0 && !vessel) {
      fetchVessel()
      dispatch(resetFilters())
      dispatch(setHighlightedEvent(undefined))
      dispatch(setVoyageTime(undefined))
    }
  }, [dispatch, vesselProfileId, datasets, akaVesselProfileIds, vessel])

  const onBackClick = useCallback(() => {
    const params = query ? { replaceQuery: true, query } : {}
    dispatchLocation(HOME, params)
    uaEvent({
      category: 'Vessel Detail',
      action: 'Click to go back to search',
    })
  }, [dispatchLocation, query])

  useEffect(() => {
    if (vesselDataviewLoaded && resourceQueries && resourceQueries.length > 0) {
      resourceQueries.forEach((resource) => {
        dispatch(fetchResourceThunk({ resource }))
      })
    }
  }, [dispatch, loading, resourceQueries, vessel, vesselDataviewLoaded])

  const visibleHighlights = useSelector(countFilteredEventsHighlighted)

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
        title: (
          <div className={styles.tagContainer}>
            {t('common.activity', 'ACTIVITY').toLocaleUpperCase()}
            {visibleHighlights > 0 && <span className={styles.tabLabel}>{visibleHighlights}</span>}
          </div>
        ),
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
    [t, vessel, lastPosition, lastPortVisit, loading, visibleHighlights]
  )

  const [activeTab, setActiveTab] = useState<Tab | undefined>(tabs?.[0])
  const [lastProfileId, setLastProfileId] = useState<string>('')

  useEffect(() => {
    if (lastProfileId !== vesselProfileId) {
      setLastProfileId(vesselProfileId)
      setActiveTab(tabs[0])
    }
  }, [lastProfileId, tabs, vesselProfileId])

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
