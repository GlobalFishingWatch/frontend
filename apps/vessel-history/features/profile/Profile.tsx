import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { useNavigatorOnline } from '@globalfishingwatch/react-hooks'
import type { Tab } from '@globalfishingwatch/ui-components'
import { IconButton, Spinner, Tabs } from '@globalfishingwatch/ui-components'

import { IS_STANDALONE_APP } from 'data/config'
import ActivityByType from 'features/activity-by-type/activity-by-type'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useApp, useAppDispatch } from 'features/app/app.hooks'
import {
  getRelatedDatasetByType,
  getRelatedDatasetsByType,
} from 'features/datasets/datasets.selectors'
import { selectDatasets } from 'features/datasets/datasets.slice'
import {
  selectDataviewsResources,
  selectGetVesselDataviewInstance,
} from 'features/dataviews/dataviews.selectors'
import { resetFilters } from 'features/event-filters/filters.slice'
import I18nDate from 'features/i18n/i18nDate'
// import Map from 'features/map/Map'
import { setHighlightedEvent, setVoyageTime } from 'features/map/map.slice'
import { fetchResourceThunk } from 'features/resources/resources.slice'
// import RiskSummary from 'features/risk-summary/risk-summary'
import RiskTitle from 'features/risk-title/risk-title'
import { countFilteredEventsHighlighted } from 'features/vessels/activity/vessels-activity.selectors'
import { selectVesselDataviewMatchesCurrentVessel } from 'features/vessels/vessels.selectors'
import {
  clearVesselDataview,
  fetchVesselByIdThunk,
  selectVesselById,
  selectVesselDataview,
  selectVesselsStatus,
  upsertVesselDataview,
} from 'features/vessels/vessels.slice'
import { NOT_AVAILABLE, parseVesselProfileId } from 'features/vessels/vessels.utils'
import { HOME } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectMergedVesselId,
  selectSearchableQueryParams,
  selectUrlAkaVesselQuery,
  selectVesselId,
  selectVesselProfileId,
} from 'routes/routes.selectors'
import { VesselAPISource } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

// import Activity from './components/activity/Activity'
import Info from './components/Info'
import { selectCurrentUserProfileHasInsurerPermission } from './profile.selectors'
import TabDeprecated from './TabDeprecated'

import styles from './Profile.module.css'

const Profile: React.FC = (props): React.ReactElement<any> => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { openFeedback } = useApp()
  const [lastPortVisit] = useState({ label: '', coordinates: null })
  const [lastPosition] = useState(null)
  const query = useSelector(selectSearchableQueryParams)
  const vesselProfileId = useSelector(selectVesselProfileId)
  const vesselId = useSelector(selectVesselId)
  const { dispatchLocation } = useLocationConnect()
  const vesselStatus = useSelector(selectVesselsStatus)
  const vesselDataview = useSelector(selectVesselDataview)
  const loading = useMemo(() => vesselStatus === AsyncReducerStatus.LoadingItem, [vesselStatus])
  const akaVesselProfileIds = useSelector(selectUrlAkaVesselQuery)
  const mergedVesselId = useSelector(selectMergedVesselId)
  const vessel = useSelector(selectVesselById(mergedVesselId))
  const datasets = useSelector(selectDatasets)
  const resourceQueries = useSelector(selectDataviewsResources)?.resources
  const vesselDataviewLoaded = useSelector(selectVesselDataviewMatchesCurrentVessel)
  const getVesselDataviewInstance = useSelector(selectGetVesselDataviewInstance)
  const isMergedVesselsView = useMemo(
    () => akaVesselProfileIds && akaVesselProfileIds.length > 0,
    [akaVesselProfileIds]
  )

  const { online } = useNavigatorOnline()
  const currentProfileIsInsurer = useSelector(selectCurrentUserProfileHasInsurerPermission)
  useEffect(() => {
    const fetchVessel = async () => {
      dispatch(clearVesselDataview(null))
      let [dataset] = (Array.from(new URLSearchParams(vesselProfileId).keys()).shift() ?? '').split(
        '_'
      )
      if (
        akaVesselProfileIds &&
        dataset.toLocaleLowerCase() === NOT_AVAILABLE.toLocaleLowerCase()
      ) {
        const gfwAka = akaVesselProfileIds.find((aka) => {
          const [akaDataset] = aka.split('_')
          return akaDataset.toLocaleLowerCase() !== NOT_AVAILABLE.toLocaleLowerCase()
        })
        if (gfwAka) {
          const [akaDataset] = gfwAka.split('_')
          dataset = akaDataset
        }
      }

      await dispatch(
        fetchVesselByIdThunk({
          id: vesselProfileId,
          akas: akaVesselProfileIds,
        })
      )
      dispatch(resetFilters())
      dispatch(setHighlightedEvent(undefined))
      dispatch(setVoyageTime(undefined))
    }

    if (datasets.length > 0 && !vessel) {
      fetchVessel()
    }
  }, [dispatch, datasets, vessel, vesselProfileId, akaVesselProfileIds])

  useEffect(() => {
    const updateDataview = async (dataset: string, gfwId: string, tmtId: string) => {
      const vesselDataset = datasets
        .filter((ds) => ds.id === dataset)
        .slice(0, 1)
        .shift()

      if (vesselDataset) {
        const trackDatasetId = getRelatedDatasetByType(vesselDataset, DatasetTypes.Tracks)?.id
        if (trackDatasetId || IS_STANDALONE_APP) {
          const eventsRelatedDatasets = getRelatedDatasetsByType(vesselDataset, DatasetTypes.Events)
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
              (akaVessel) => akaVessel.dataset === dataset && akaVessel.id && akaVessel.id !== gfwId
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
    let [dataset, gfwId, tmtId] = (
      Array.from(new URLSearchParams(vesselProfileId).keys()).shift() ?? ''
    ).split('_')
    if (akaVesselProfileIds && dataset.toLocaleLowerCase() === NOT_AVAILABLE.toLocaleLowerCase()) {
      const gfwAka = akaVesselProfileIds.find((aka) => {
        const [akaDataset] = aka.split('_')
        return akaDataset.toLocaleLowerCase() !== NOT_AVAILABLE.toLocaleLowerCase()
      })
      if (gfwAka) {
        const [akaDataset, akaGfwId] = gfwAka.split('_')
        dataset = akaDataset
        gfwId = akaGfwId
      }
    }

    // this is for update the vessel dataview in case that keep cached with the dataview of another vessel
    if (!vesselDataview || 'vessel-' + gfwId !== vesselDataview.id) {
      updateDataview(dataset, gfwId, tmtId)
    }
  }, [
    akaVesselProfileIds,
    datasets,
    dispatch,
    getVesselDataviewInstance,
    vesselDataview,
    vesselProfileId,
  ])

  const onBackClick = useCallback(() => {
    const params = query ? { replaceQuery: true, query } : {}
    dispatchLocation(HOME, params)
    trackEvent({
      category: TrackCategory.VesselDetail,
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

  const mapTab = useMemo(
    () => ({
      id: 'map',
      title: t('common.map', 'MAP').toLocaleUpperCase(),
      content: <TabDeprecated vessel={vessel} vesselId={vesselId} />,
    }),
    [t, vessel, vesselId]
  )
  const riskSummaryTab = useMemo(
    () => ({
      id: 'risk',
      title: <RiskTitle />,
      content: <TabDeprecated vessel={vessel} vesselId={vesselId} />,
    }),
    [vessel, vesselId]
  )

  const infoTab = useMemo(
    () => ({
      id: 'info',
      title: t('common.info', 'INFO').toLocaleUpperCase(),
      content: vessel ? (
        <Fragment>
          <TabDeprecated vessel={vessel} vesselId={vesselId} fullHeight={false} />
          <Info
            vessel={vessel}
            lastPosition={lastPosition}
            lastPortVisit={lastPortVisit}
            onMoveToMap={() => setActiveTab(mapTab)}
          />
        </Fragment>
      ) : loading ? (
        <Spinner className={styles.spinnerFull} />
      ) : (
        <TabDeprecated vessel={vessel} vesselId={vesselId} />
      ),
    }),
    [lastPortVisit, lastPosition, loading, mapTab, t, vessel, vesselId]
  )
  const activityTab = useMemo(
    () => ({
      id: 'activity',
      title: (
        <div className={styles.tagContainer}>
          {t('common.activity', 'ACTIVITY').toLocaleUpperCase()}
          {visibleHighlights > 0 && <span className={styles.tabLabel}>{visibleHighlights}</span>}
        </div>
      ),
      content: <TabDeprecated vessel={vessel} vesselId={vesselId} />,
    }),
    [t, vessel, vesselId, visibleHighlights]
  )

  const activityByTypeTab = useMemo(
    () => ({
      id: 'activity',
      title: (
        <div className={styles.tagContainer}>
          {t('common.activityByType', 'ACTIVITY BY TYPE').toLocaleUpperCase()}
          {visibleHighlights > 0 && <span className={styles.tabLabel}>{visibleHighlights}</span>}
        </div>
      ),
      content: <ActivityByType onMoveToMap={() => setActiveTab(mapTab)} />,
    }),
    [mapTab, t, visibleHighlights]
  )

  const tabs: Tab[] = useMemo(
    () =>
      IS_STANDALONE_APP
        ? [infoTab, activityByTypeTab]
        : currentProfileIsInsurer
          ? [riskSummaryTab, infoTab, activityByTypeTab, mapTab]
          : [infoTab, activityTab, mapTab, riskSummaryTab],
    [currentProfileIsInsurer, riskSummaryTab, infoTab, activityTab, mapTab, activityByTypeTab]
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
        {online && (
          <IconButton
            icon="feedback"
            className={styles.feedback}
            onClick={openFeedback}
            tooltip={t('common.feedback', 'Feedback')}
            tooltipPlacement="bottom"
          />
        )}
      </header>
      <div className={styles.profileContainer}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab?.id as string}
          onTabClick={(tab: Tab) => {
            setActiveTab(tab)
            if (tab.id === 'info') {
              trackEvent({
                category: TrackCategory.VesselDetailInfoTab,
                action: 'See Info Tab',
              })
            }
            if (tab.id === 'activity' && !currentProfileIsInsurer) {
              trackEvent({
                category: TrackCategory.VesselDetailActivityTab,
                action: 'See Activity Tab',
              })
            }
            if (tab.id === 'activity' && currentProfileIsInsurer) {
              trackEvent({
                category: TrackCategory.VesselDetailActivityByTypeTab,
                action: 'See ACTIVITY BY TYPE Tab',
              })
            }
            if (tab.id === 'risk') {
              trackEvent({
                category: TrackCategory.VesselDetailRiskSummaryTab,
                action: 'See RISK SUMMARY Tab',
              })
            }
            if (tab.id === 'map') {
              trackEvent({
                category: TrackCategory.VesselDetailMapTab,
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
