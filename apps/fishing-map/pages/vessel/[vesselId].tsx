import path from 'path'
import { useEffect, useState } from 'react'
import { RootState } from 'reducers'
import { GetServerSideProps } from 'next'
import { Logo, SplitView } from '@globalfishingwatch/ui-components'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { APIPagination, ApiEvent, Dataset, Vessel } from '@globalfishingwatch/api-types'
import VesselIdentity from 'features/vessel/Vesseldentity'
import VesselSummary from 'features/vessel/VesselSummary'
import { AsyncReducerStatus } from 'utils/async-slice'
import CategoryTabsServer from 'features/sidebar/CategoryTabs.server'
import { WorkspaceCategory } from 'data/workspaces'
import VesselEvents from 'features/vessel/VesselEvents'
import {
  DEFAULT_VESSEL_DATASET_ID,
  getEventsParamsFromVesselDataset,
} from 'features/vessel/vessel.slice'
import Index from 'pages'
import styles from './styles.module.css'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

type VesselPageParams = { category: WorkspaceCategory; workspace: string; vesselId: string }
type VesselPageProps = {
  params: VesselPageParams
  reduxState: Pick<RootState, 'vessel'>
}

export const getServerSideProps: GetServerSideProps<VesselPageProps, VesselPageParams> = async ({
  params,
  query,
}): Promise<{ props: VesselPageProps }> => {
  const { vesselId } = params
  const { vesselDatasetId = DEFAULT_VESSEL_DATASET_ID } = query
  const promises = await Promise.allSettled([
    GFWAPI.fetch<Vessel>(`/vessels/${vesselId}?datasets=${vesselDatasetId}`),
    GFWAPI.fetch<Dataset>(`/datasets/${vesselDatasetId}`),
  ])
  const allSettledPromises = promises.map((res) => {
    return res.status === 'fulfilled' ? res.value : null
  })
  const vessel = allSettledPromises[0] as Vessel
  const dataset = allSettledPromises[1] as Dataset
  const eventParams = await getEventsParamsFromVesselDataset(dataset, vessel.id)
  const eventPromises = await Promise.allSettled(
    eventParams?.map((eventParams) => {
      return GFWAPI.fetch<APIPagination<ApiEvent>>(`/events?${eventParams}`)
    })
  )
  const events = eventPromises.flatMap((res) => {
    return res.status === 'fulfilled' ? res.value.entries : []
  })
  const reduxState: Pick<RootState, 'vessel'> = {
    vessel: {
      info: {
        data: vessel,
        status: AsyncReducerStatus.Finished,
      },
      events: {
        data: events,
        status: AsyncReducerStatus.Finished,
      },
    },
  }
  return {
    props: {
      params,
      reduxState,
    },
  }
}

const VesselComponent = ({ params, reduxState }: VesselPageProps) => {
  return (
    <div className={styles.container}>
      <CategoryTabsServer category={params.category} />
      <div className="scrollContainer">
        <div className={styles.sidebarHeader}>
          <a href="https://globalfishingwatch.org" className={styles.logoLink}>
            <Logo className={styles.logo} />
          </a>
        </div>
        <div className={styles.content}>
          <VesselSummary vessel={reduxState?.vessel?.info?.data} />
          <VesselIdentity vessel={reduxState?.vessel?.info?.data} />
          <VesselEvents events={reduxState?.vessel?.events?.data} />
        </div>
      </div>
    </div>
  )
}

const MapPlaceholder = () => {
  return <div className={styles.mapPlaceholder}></div>
}

const VesselServer = ({ params, reduxState }: VesselPageProps) => {
  return (
    <SplitView
      isOpen={true}
      showToggle={true}
      // onToggle={()}
      aside={<VesselComponent params={params} reduxState={reduxState} />}
      main={<MapPlaceholder />}
      asideWidth={'50%'}
      // showAsideLabel={getSidebarName()}
      // showMainLabel={t('common.map', 'Map')}
      className="split-container"
    />
  )
}

const VesselPage = (props) => {
  const [isServer, setServer] = useState<boolean>(true)
  useEffect(() => setServer(false), [])

  // return <VesselServer {...props} />

  if (isServer) {
    return (
      <div style={{ opacity: 0 }}>
        <VesselServer {...props} />
      </div>
    )
  }

  return <Index />
}
export default VesselPage
