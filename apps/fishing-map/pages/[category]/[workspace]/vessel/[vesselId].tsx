import path from 'path'
import VesselPage from 'pages/vessel/[vesselId]'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

// export { getServerSideProps } from 'pages/vessel/[vesselId]'

export default VesselPage
