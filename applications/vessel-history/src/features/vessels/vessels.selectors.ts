import { createSelector } from 'reselect'
import { selectVesselProfileId } from 'routes/routes.selectors'
import { selectVessels } from './vessels.slice'

export const getVesselInfo = createSelector(
  [selectVessels, selectVesselProfileId],
  (vessels, id) => {
    if (vessels && vessels[id]) {
      return vessels[id]
    }

    return null
  }
)
