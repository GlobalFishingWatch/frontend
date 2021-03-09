import { createSelector } from 'reselect'
import { VesselInfo } from 'classes/vessel.class'
import { selectVesselProfileId } from 'routes/routes.selectors'
// import { selectVessels } from './vessels.slice'

// export const getVesselInfo = createSelector(
//   [selectVessels, selectVesselProfileId],
//   (vessels, id) => {
//     if (vessels && vessels[id]) {
//       return new VesselInfo(vessels[id].gfwData, vessels[id].tmtData)
//     }

//     return null
//   }
// )
export default {}
