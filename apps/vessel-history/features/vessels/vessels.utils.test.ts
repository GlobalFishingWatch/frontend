import { VesselAPISource } from 'types'

import * as gfwSlice from './sources/gfw.slice'
import * as tmtSlice from './sources/tmt.slice'
import { mergeVesselFromSources } from './vessels.utils'
import { gfwVessel, tmtVessel } from './vessels.utils.mock'

describe('vessels.utils', () => {
  it('merges vessel data from two sources', () => {
    const vesselData = [
      {
        source: VesselAPISource.GFW,
        vessel: gfwSlice.toVessel(gfwVessel),
      },
      {
        source: VesselAPISource.TMT,
        vessel: tmtSlice.toVessel(tmtVessel),
      },
    ]
    const result = mergeVesselFromSources(vesselData)
    expect(result).toMatchSnapshot()
  })
})
