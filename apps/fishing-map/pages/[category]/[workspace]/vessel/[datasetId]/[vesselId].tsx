import path from 'path'
import { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { RootState } from 'reducers'
import { stringify } from 'qs'
import { Logo, SplitView } from '@globalfishingwatch/ui-components'
import { GFWAPI } from '@globalfishingwatch/api-client'
import {
  APIPagination,
  ApiEvent,
  Dataset,
  DatasetTypes,
  EventType,
  Vessel,
} from '@globalfishingwatch/api-types'
import VesselIdentity from 'features/vessel/Vesseldentity'
import VesselSummary from 'features/vessel/VesselSummary'
import { AsyncReducerStatus } from 'utils/async-slice'
import CategoryTabsServer from 'features/sidebar/CategoryTabs.server'
import { WorkspaceCategory } from 'data/workspaces'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import VesselEvents from 'features/vessel/VesselEvents'
import Index from '../../../../index'
import styles from './styles.module.css'

// Workaround until we load the dataview TEMPLATE_VESSEL_DATAVIEW_SLUG to load the datasetConfig
const API_PARAMS_BY_EVENT_TYPE: Partial<Record<EventType, any>> = {
  port_visit: {
    confidences: 4,
  },
  encounter: {
    'encounter-types': ['carrier-fishing', 'fishing-carrier', 'fishing-support', 'support-fishing'],
  },
}

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

export async function getServerSideProps({ params }): Promise<{ props: VesselPageProps }> {
  const { vesselId, datasetId } = params
  // const vessel = await GFWAPI.fetch<Vessel>(`/vessels/${vesselId}?datasets=${datasetId}`)

  const promises = await Promise.allSettled([
    GFWAPI.fetch<Vessel>(`/vessels/${vesselId}?datasets=${datasetId}`),
    GFWAPI.fetch<Dataset>(`/datasets/${datasetId}`),
  ])
  const allSettledPromises = promises.map((res) => {
    return res.status === 'fulfilled' ? res.value : null
  })
  const vessel = allSettledPromises[0] as Vessel
  const dataset = allSettledPromises[1] as Dataset
  const eventsDatasetIds = getRelatedDatasetsByType(dataset, DatasetTypes.Events)?.map((e) => e.id)
  const eventDatasetsParams = {
    ids: eventsDatasetIds?.join(','),
    ...DEFAULT_PAGINATION_PARAMS,
  }
  const eventsDatasets = await GFWAPI.fetch<APIPagination<Dataset>>(
    `/datasets?${stringify(eventDatasetsParams)}`
  ).then((res) => res.entries)
  const eventPromises = await Promise.allSettled(
    eventsDatasets?.map((eventDataset) => {
      const paramsByType = API_PARAMS_BY_EVENT_TYPE[eventDataset.subcategory] || {}
      const eventsParams = {
        summary: true,
        vessels: vesselId,
        datasets: eventDataset.id,
        ...DEFAULT_PAGINATION_PARAMS,
        ...paramsByType,
      }
      return GFWAPI.fetch<APIPagination<ApiEvent>>(`/events?${stringify(eventsParams)}`)
    })
  )
  const events = eventPromises.flatMap((res) => {
    return res.status === 'fulfilled' ? res.value.entries : []
  })
  return {
    props: {
      workspaceCategory: params.category,
      datasetId,
      vessel,
      events,
    },
  }
}

const VesselComponent = ({
  vessel,
  events,
  workspaceCategory,
}: Pick<VesselPageProps, 'vessel' | 'workspaceCategory' | 'events'>) => {
  return (
    <div className={styles.container}>
      <CategoryTabsServer category={workspaceCategory} />
      <div className="scrollContainer">
        <div className={styles.sidebarHeader}>
          <a href="https://globalfishingwatch.org" className={styles.logoLink}>
            <Logo className={styles.logo} />
          </a>
        </div>
        <div className={styles.content}>
          <VesselSummary vessel={vessel} />
          <VesselIdentity vessel={vessel} />
          <VesselEvents events={events} />
        </div>
      </div>
    </div>
  )
}

const MapPlaceholder = () => {
  return <div className={styles.mapPlaceholder}></div>
}

const VesselServer = ({ workspaceCategory, vessel, events }: VesselPageProps) => {
  return (
    <SplitView
      isOpen={true}
      showToggle={true}
      // onToggle={()}
      aside={
        <VesselComponent workspaceCategory={workspaceCategory} vessel={vessel} events={events} />
      }
      main={<MapPlaceholder />}
      asideWidth={'50%'}
      // showAsideLabel={getSidebarName()}
      // showMainLabel={t('common.map', 'Map')}
      className="split-container"
    />
  )
}

type VesselPageProps = {
  workspaceCategory: WorkspaceCategory
  datasetId: string
  vessel: Vessel
  events: ApiEvent[]
}

const VesselPage = (props: VesselPageProps) => {
  const [isServer, setServer] = useState<boolean>(true)
  useEffect(() => setServer(false), [])

  const preloadedState: Pick<RootState, 'vessel'> = {
    vessel: {
      info: {
        status: AsyncReducerStatus.Finished,
        data: props.vessel,
      },
      events: {
        status: AsyncReducerStatus.Finished,
        data: props.events,
      },
    },
  }

  // return <VesselServer {...props} />

  if (isServer) {
    return (
      <div style={{ opacity: 0 }}>
        <VesselServer {...props} />
      </div>
    )
  }

  return <Index preloadedState={preloadedState} />
}
export default VesselPage
