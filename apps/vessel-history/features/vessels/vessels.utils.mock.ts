import { GFWDetail, TMTDetail } from 'types'

export const gfwVessel: GFWDetail = {
  callsign: 'IRNZ',
  firstTransmissionDate: '2013-05-14T03:31:40Z',
  flag: 'ITA',
  geartype: 'trawlers',
  id: 'ea39ee174-4f61-cf0a-9ed8-fa5c25459890',
  imo: '0',
  lastTransmissionDate: '2021-08-17T09:08:00Z',
  mmsi: '247099420',
  normalized_shipname: 'MARIA MARIA 2',
  shipname: 'MARIA MARIA 2',
  source: 'AIS',
  dataset: 'public-global-fishing-vessels:v20201001',
  otherCallsigns: [],
  otherImos: [],
  otherShipnames: [],
  vesselType: 'some vessel type',
  years: []
}

export const tmtVessel: TMTDetail = {
  vesselMatchId: 'd0876b71-9cff-4586-bf27-bb84d1d8a322',
  valueList: {
    builtYear: [{ value: '1951', firstSeen: '1991-02-02T00:00:00.000Z' }],
    flag: [{ value: 'ITA', firstSeen: '1991-02-02T00:00:00.000Z' }],
    gt: [{ value: '51.000', firstSeen: '1991-02-02T00:00:00.000Z' }],
    imo: [],
    loa: [{ value: '18.550', firstSeen: '1991-02-02T00:00:00.000Z' }],
    mmsi: [],
    name: [
      {
        value: 'MAAAARIA',
        originalFirstSeen: 19710000,
        originalEndDate: 19720000,
      },
      {
        value: 'MAR',
        originalFirstSeen: 19800100,
        originalEndDate: 19810100,
      },
      {
        value: 'MARIA MARIA',
        firstSeen: '1981-02-02T00:00:00.000Z',
        endDate: '1991-02-02T00:00:00.000Z',
      },
      {
        value: 'MARIA MADRE II',
        firstSeen: '1991-02-02T00:00:00.000Z',
        endDate: '2013-05-14T03:31:40Z',
      },
    ],
    ircs: [{ value: 'IRNZ' }],
    vesselType: [{ value: 'Fishing Vessel', firstSeen: '1991-02-02T00:00:00.000Z' }],
    gear: [
      { value: 'Otter trawl', firstSeen: '1991-02-02T00:00:00.000Z' },
      { value: 'Pole and line', firstSeen: '2001-02-02T00:00:00.000Z' },
      { value: 'Purse seine' },
    ],
    depth: [],
  },
  relationList: { vesselOwnership: [], vesselOperations: [] },
  authorisationList: [],
  imageList: [],
  iuuStatus: 0,
}
