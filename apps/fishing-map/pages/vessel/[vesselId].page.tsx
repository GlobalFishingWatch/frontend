import path from 'path'
import { useEffect, useState } from 'react'
import { TOKEN_REGEX } from '@globalfishingwatch/dataviews-client'
import { wrapper } from 'store'
import { fetchVesselInfoThunk } from 'features/vessel/vessel.slice'
import Index from 'pages/index.page'
import VesselServerComponent from 'pages/vessel/vessel'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

// type VesselPageParams = { category: WorkspaceCategory; workspace: string; vesselId: string }
// type VesselPageProps = {
//   params: VesselPageParams
//   reduxState: Pick<RootState, 'vessel'>
// }

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
      // await store.dispatch(
      //   fetchVesselEventsThunk({
      //     vesselId: vesselId as string,
      //     datasetId: vesselDatasetId as string,
      //   }) as any
      // )
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

const VesselPage = (props) => {
  const [isServer, setServer] = useState<boolean>(true)
  useEffect(() => setServer(false), [])

  if (isServer) {
    return <VesselServerComponent {...props} />
  }

  return <Index />
}
export default VesselPage
