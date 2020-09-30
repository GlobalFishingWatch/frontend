/* eslint-disable @typescript-eslint/camelcase */
const search = [
  {
    dataset: 'test-alias-import-vessels-pipeline:latest',
    results: {
      query: '"Yu Hong"',
      total: {
        value: 677,
        relation: 'eq',
      },
      limit: 10,
      offset: 0,
      nextOffset: null,
      entries: [
        {
          id: 'bJxZ3HQBi2fy-lTCLGAi',
          callsign: 'BFAQ7',
          first_transmission_date: '2012-01-01T00:46:11Z',
          flag: 'CHN',
          imo: '0',
          last_transmission_date: '2019-04-17T06:32:39Z',
          mmsi: '413302720',
          other_callsigns: [
            {
              counter: 45483,
              name: 'BFAQ7',
            },
          ],
          other_imos: [
            {
              counter: 11849,
              name: '201052121',
            },
            {
              counter: 33634,
              name: '0',
            },
          ],
          other_shipnames: [
            {
              counter: 8682,
              name: 'YUHONG',
            },
            {
              counter: 36801,
              name: 'YU HONG',
            },
          ],
          shipname: 'YU HONG',
          vessel_id: '341bad010-0b7e-2ca0-ca07-398e130de035',
          dataset: 'dataset-vessels-alvaro',
        },
        {
          id: 'efJe3HQBlJz4oq1SnHKa',
          callsign: null,
          first_transmission_date: '2017-10-02T03:18:31Z',
          flag: 'TWN',
          imo: null,
          last_transmission_date: '2019-04-09T07:45:30Z',
          mmsi: '416004127',
          other_callsigns: [
            {
              counter: 36,
              name: null,
            },
            {
              counter: 1,
              name: 'BR3441',
            },
          ],
          other_imos: [
            {
              counter: 37,
              name: null,
            },
          ],
          other_shipnames: [
            {
              counter: 1,
              name: null,
            },
            {
              counter: 36,
              name: 'YU HONG',
            },
          ],
          shipname: 'YU HONG',
          vessel_id: '38a343d31-1353-7b42-5ed7-f6a0676f7ee1',
          dataset: 'dataset-vessels-alvaro',
        },
      ],
      metadata: {
        suggestion: 'YU HONG',
      },
    },
  },
]

export default search
