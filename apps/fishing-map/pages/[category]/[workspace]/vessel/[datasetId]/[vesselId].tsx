import path from 'path'
import { useEffect, useState } from 'react'
import { SplitView } from '@globalfishingwatch/ui-components'
import VesselDetail from 'features/vessel/VesselDetail'
import Index from '../../../../index'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

export async function getServerSideProps({ params }) {
  return {
    props: {
      id: params.vesselId,
      datasetId: params.datasetId,
    },
  }
}
const MapPlaceholder = () => {
  return <div style={{ backgroundColor: 'blue', width: '100%', height: '100%' }}></div>
}

const VesselInfo = ({ vesselId, datasetId }) => {
  return (
    <SplitView
      isOpen={true}
      showToggle={true}
      // onToggle={()}
      aside={<VesselDetail vesselId={vesselId} datasetId={datasetId} />}
      main={<MapPlaceholder />}
      asideWidth={'50%'}
      // showAsideLabel={getSidebarName()}
      // showMainLabel={t('common.map', 'Map')}
      className="split-container"
    />
  )
}
const Vessel = (props) => {
  // const isServer = typeof window !== 'undefined'
  const [isServer, setServer] = useState<boolean>(true)
  useEffect(() => setServer(false), [])

  if (isServer) {
    return <VesselInfo {...props} />
  }

  return <Index />
}
export default Vessel
