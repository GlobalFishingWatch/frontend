import { render } from '@testing-library/react'
import { Vessel } from 'types'
import VesselListItem from './VesselListItem'

const mockShowSourceAPI = jest.fn()
jest.mock('data/constants', () => ({
  get SHOW_VESSEL_API_SOURCE() {
    return mockShowSourceAPI() // set some default value
  },
}))
jest.mock('redux-first-router-link')

describe('<VesselListItem />', () => {
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
    dataset: 'public-global-vessels:v20190502',
    vesselMatchId: '6dd26b05-c055-5b5a-b396-2cc6503fdd4c',
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows source API in environments others than production', () => {
    mockShowSourceAPI.mockReturnValueOnce(true)
    const component = render(<VesselListItem vessel={vessel} />)
    expect(component.getAllByText('SOURCE').length).toBe(1)
    expect(component.getAllByText('GFW+TMT').length).toBe(1)
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('does not show source API in production environment', () => {
    mockShowSourceAPI.mockReturnValueOnce(false)
    const component = render(<VesselListItem vessel={vessel} />)
    expect(() => component.getAllByText('SOURCE')).toThrow(
      'Unable to find an element with the text: SOURCE.'
    )
    expect(component.asFragment()).toMatchSnapshot()
  })
})
