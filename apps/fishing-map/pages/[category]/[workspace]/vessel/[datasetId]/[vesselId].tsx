import path from 'path'
import { useEffect, useState } from 'react'
import { RootState } from 'reducers'
import { SplitView } from '@globalfishingwatch/ui-components'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { Vessel } from '@globalfishingwatch/api-types'
import VesselIdentity from 'features/vessel/Vesseldentity'
import VesselSummary from 'features/vessel/VesselSummary'
import { AsyncReducerStatus } from 'utils/async-slice'
import Index from '../../../../index'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

export async function getServerSideProps({ params }) {
  const { vesselId, datasetId } = params
  const data = await GFWAPI.fetch(`/vessels/${vesselId}?datasets=${datasetId}`)
  console.log('🚀 ~ getServerSideProps ~ data:', data)
  return {
    props: {
      vesselId: params.vesselId,
      datasetId: params.datasetId,
      data,
    },
  }
}
const VesselComponent = ({ vessel }: { vessel: Vessel }) => {
  return (
    <div>
      <VesselSummary vessel={vessel} />
      <VesselIdentity vessel={vessel} />
    </div>
  )
}
const MapPlaceholder = () => {
  return <div style={{ backgroundColor: 'blue', width: '100%', height: '100%' }}></div>
}

const VesselServer = ({ vesselId, datasetId, data }) => {
  return (
    <SplitView
      isOpen={true}
      showToggle={true}
      // onToggle={()}
      aside={<VesselComponent vessel={data} />}
      main={<MapPlaceholder />}
      asideWidth={'50%'}
      // showAsideLabel={getSidebarName()}
      // showMainLabel={t('common.map', 'Map')}
      className="split-container"
    />
  )
}

type VesselPageProps = {
  vesselId: string
  datasetId: string
  data: Vessel
}
const VesselPage = (props: VesselPageProps) => {
  // const isServer = typeof window !== 'undefined'
  const [isServer, setServer] = useState<boolean>(true)
  useEffect(() => setServer(false), [])

  const preloadedState: Pick<RootState, 'vessel'> = {
    vessel: {
      status: AsyncReducerStatus.Finished,
      data: props.data,
    },
  }

  if (isServer) {
    return <VesselServer {...props} />
  }

  return <Index preloadedState={preloadedState} />
}
export default VesselPage
