import path from 'path'
import { useEffect, useState } from 'react'
import { RootState } from 'reducers'
import { Logo, SplitView } from '@globalfishingwatch/ui-components'
import { TOKEN_REGEX } from '@globalfishingwatch/dataviews-client'
import VesselIdentity from 'features/vessel/Vesseldentity'
import VesselSummary from 'features/vessel/VesselSummary'
import CategoryTabsServer from 'features/sidebar/CategoryTabs.server'
import { WorkspaceCategory } from 'data/workspaces'
import VesselEvents from 'features/vessel/VesselEvents'
import { wrapper } from 'store'
import { fetchVesselEventsThunk, fetchVesselInfoThunk } from 'features/vessel/vessel.slice'
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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, query }) => {
      const { vesselId } = params
      const queryVesselDatasetId = query.vesselDatasetId as string
      const datasetMatchesToken = queryVesselDatasetId.match(TOKEN_REGEX)
      const vesselDatasetId = datasetMatchesToken
        ? query[`tk[${datasetMatchesToken[1]}]`]
        : queryVesselDatasetId

      await store.dispatch(
        fetchVesselInfoThunk({
          vesselId: vesselId as string,
          datasetId: vesselDatasetId as string,
        }) as any
      )
      await store.dispatch(
        fetchVesselEventsThunk({
          vesselId: vesselId as string,
          datasetId: vesselDatasetId as string,
        }) as any
      )
      return {
        props: {
          params: {
            ...(params || {}),
          },
          reduxState: { vessel: store.getState()?.vessel },
        },
      }
    }
)

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
