import React, { Fragment, useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import { Segment, segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { IconButton, Spinner, Tabs } from '@globalfishingwatch/ui-components'
import { Tab } from '@globalfishingwatch/ui-components/dist/tabs'
import { DatasetTypes } from '@globalfishingwatch/api-types/dist'
import I18nDate from 'features/i18n/i18nDate'
import { selectQueryParam, selectVesselProfileId } from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import {
  fetchVesselByIdThunk,
  selectVesselById,
  selectVesselsStatus,
  upsertVesselDataview,
} from 'features/vessels/vessels.slice'
import Map from 'features/map/Map'
import { getRelatedDatasetByType } from 'features/datasets/datasets.selectors'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectActiveVesselsDataviews } from 'features/dataviews/dataviews.selectors'
import { selectDatasets } from 'features/datasets/datasets.slice'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { selectDataviewsResourceQueries } from 'features/resources/resources.selectors'
import { fetchResourceThunk, selectResourceByUrl } from 'features/resources/resources.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { Bbox } from 'types'
import Info from './components/Info'
import styles from './Profile.module.css'

const Profile: React.FC = (props): React.ReactElement => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const fitBounds = useMapFitBounds()
  const [lastPortVisit] = useState({ label: '', coordinates: null })
  const [lastPosition] = useState(null)
  const q = useSelector(selectQueryParam('q'))
  const vesselProfileId = useSelector(selectVesselProfileId)
  const vesselStatus = useSelector(selectVesselsStatus)
  const loading = useMemo(() => vesselStatus === AsyncReducerStatus.LoadingItem, [vesselStatus])
  const vessel = useSelector(selectVesselById(vesselProfileId))
  const datasets = useSelector(selectDatasets)
  const resourceQueries = useSelector(selectDataviewsResourceQueries)
  const [vesselDataview] = useSelector(selectActiveVesselsDataviews) ?? []
  const { url: trackUrl = '' } = vesselDataview
    ? resolveDataviewDatasetResource(vesselDataview, DatasetTypes.Tracks)
    : { url: '' }
  const trackResource = useSelector(selectResourceByUrl<Segment[]>(trackUrl))

  useEffect(() => {
    if (resourceQueries) {
      resourceQueries.forEach((resourceQuery) => {
        dispatch(fetchResourceThunk(resourceQuery))
      })
    }
  }, [dispatch, resourceQueries])

  useEffect(() => {
    const fetchVessel = async () => {
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
            const vesselDataviewInstance = getVesselDataviewInstance(
              { id: gfwId },
              {
                trackDatasetId: trackDatasetId as string,
                infoDatasetId: dataset,
              }
            )
            dispatch(upsertVesselDataview(vesselDataviewInstance))
          }
        }
      }
    }
    fetchVessel()
  }, [dispatch, vesselProfileId, datasets])

  const onFitLastSegment = useCallback(() => {
    if (!trackResource?.data || trackResource?.data.length === 0) return
    const lastSegment = [trackResource?.data.flat().slice(-2)] as Segment[]
    const bbox = lastSegment?.length ? segmentsToBbox(lastSegment) : undefined
    if (bbox) {
      fitBounds(bbox as Bbox, { padding: 200 })
    } else {
      // TODO use prompt to ask user if wants to update the timerange to fit the track
      alert('The vessel has no activity in your selected timerange')
    }
  }, [fitBounds, trackResource])

  useEffect(() => {
    if (!vessel || !vesselDataview) return
    onFitLastSegment()
  }, [vesselDataview, vessel, onFitLastSegment])

  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 'info',
        title: t('common.info', 'INFO').toLocaleUpperCase(),
        content: vessel ? (
          <Info vessel={vessel} lastPosition={lastPosition} lastPortVisit={lastPortVisit} />
        ) : (
          <Fragment>{loading && <Spinner className={styles.spinnerFull} />}</Fragment>
        ),
      },
      {
        id: 'activity',
        title: t('common.activity', 'ACTIVITY').toLocaleUpperCase(),
        content: <div>{t('common.commingSoon', 'Comming Soon!')}</div>,
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

  const backLink = useMemo(() => {
    return q ? { type: HOME, replaceQuery: true, query: { q } } : { type: HOME }
  }, [q])

  return (
    <Fragment>
      <header className={styles.header}>
        <Link to={backLink}>
          <IconButton
            type="border"
            size="default"
            icon="arrow-left"
            className={styles.backButton}
          />
        </Link>
        {vessel && (
          <h1>
            {vessel.shipname}
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
          activeTab={activeTab?.id}
          onTabClick={(tab: Tab) => setActiveTab(tab)}
        ></Tabs>
      </div>
    </Fragment>
  )
}

export default Profile
