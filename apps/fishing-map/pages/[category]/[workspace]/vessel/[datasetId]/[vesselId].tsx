import path from 'path'
import { useEffect, useState } from 'react'
import { RootState } from 'reducers'
import { Logo, SplitView } from '@globalfishingwatch/ui-components'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { Vessel } from '@globalfishingwatch/api-types'
import VesselIdentity from 'features/vessel/Vesseldentity'
import VesselSummary from 'features/vessel/VesselSummary'
import { AsyncReducerStatus } from 'utils/async-slice'
import CategoryTabsServer from 'features/sidebar/CategoryTabs.server'
import { WorkspaceCategory } from 'data/workspaces'
import Index from '../../../../index'
import styles from './styles.module.css'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

export async function getServerSideProps({ params }): Promise<{ props: VesselPageProps }> {
  const { vesselId, datasetId } = params
  const vessel = await GFWAPI.fetch<Vessel>(`/vessels/${vesselId}?datasets=${datasetId}`)
  return {
    props: {
      category: params.category,
      vesselId: params.vesselId,
      datasetId: params.datasetId,
      vessel,
    },
  }
}

const VesselComponent = ({ vessel, category }: Pick<VesselPageProps, 'vessel' | 'category'>) => {
  return (
    <div className={styles.container}>
      <CategoryTabsServer category={category} />
      <div className="scrollContainer">
        <div className={styles.sidebarHeader}>
          <a href="https://globalfishingwatch.org" className={styles.logoLink}>
            <Logo className={styles.logo} />
          </a>
        </div>
        <div className={styles.content}>
          <VesselSummary vessel={vessel} />
          <VesselIdentity vessel={vessel} />
        </div>
      </div>
    </div>
  )
}

const MapPlaceholder = () => {
  return <div className={styles.mapPlaceholder}></div>
}

const VesselServer = ({ category, vessel }: VesselPageProps) => {
  return (
    <SplitView
      isOpen={true}
      showToggle={true}
      // onToggle={()}
      aside={<VesselComponent category={category} vessel={vessel} />}
      main={<MapPlaceholder />}
      asideWidth={'50%'}
      // showAsideLabel={getSidebarName()}
      // showMainLabel={t('common.map', 'Map')}
      className="split-container"
    />
  )
}

type VesselPageProps = {
  category: WorkspaceCategory
  vesselId: string
  datasetId: string
  vessel: Vessel
}
const VesselPage = (props: VesselPageProps) => {
  // const isServer = typeof window !== 'undefined'
  const [isServer, setServer] = useState<boolean>(true)
  useEffect(() => setServer(false), [])

  const preloadedState: Pick<RootState, 'vessel'> = {
    vessel: {
      status: AsyncReducerStatus.Finished,
      data: props.vessel,
    },
  }

  return <VesselServer {...props} />

  if (isServer) {
    return <VesselServer {...props} />
  }

  return <Index preloadedState={preloadedState} />
}
export default VesselPage
