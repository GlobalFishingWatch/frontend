import type { Vessel} from 'types';

import { VesselAPISource } from 'types'

import { getVesselAPISource } from './vessel'

describe('getVesselAPISource', () => {
  const vessel: Vessel = {
    callsign: 'CB5527',
    firstTransmissionDate: '2012-01-19T14:24:39Z',
    flag: 'CHL',
    id: '9e075a986-6162-fe6e-b25e-81188438a00c',
    imo: null,
    lastTransmissionDate: '2020-12-13T23:51:36Z',
    mmsi: '725000410',
    otherCallsigns: [],
    otherImos: [],
    otherShipnames: [],
    shipname: 'DON TITO',
    source: 'AIS',
    dataset: 'mocked-dataset-for-test',
    vesselMatchId: '6dd26b05-c055-5b5a-b396-2cc6503fdd4c',
  }

  it('returns TMT source only when vesselMatchId is present and id not', () => {
    const mockVessel = { ...vessel }
    delete mockVessel['id']
    const result = getVesselAPISource(mockVessel)
    expect(result).toEqual([VesselAPISource.TMT])

    expect(getVesselAPISource({ ...mockVessel, id: null })).toEqual([VesselAPISource.TMT])
    expect(getVesselAPISource({ ...mockVessel, id: '' })).toEqual([VesselAPISource.TMT])
  })

  it('returns GFW source only when id is present and vesselMatchId not', () => {
    const mockVessel = { ...vessel }
    delete mockVessel['vesselMatchId']
    const result = getVesselAPISource(mockVessel)
    expect(result).toEqual([VesselAPISource.GFW])

    expect(getVesselAPISource({ ...mockVessel, vesselMatchId: null })).toEqual([
      VesselAPISource.GFW,
    ])
    expect(getVesselAPISource({ ...mockVessel, vesselMatchId: '' })).toEqual([VesselAPISource.GFW])
  })

  it('returns GFW and TMT source when id is present and vesselMatchId too', () => {
    const mockVessel = { ...vessel }
    const result = getVesselAPISource(mockVessel)
    expect(result).toEqual([VesselAPISource.GFW, VesselAPISource.TMT])
  })

  it('returns empty array when id and vesselMatchId are missing', () => {
    const mockVessel = { ...vessel }
    delete mockVessel['vesselMatchId']
    delete mockVessel['id']
    const result = getVesselAPISource(mockVessel)
    expect(result).toEqual([])
  })
})
