import { TRACK_COLORS } from 'types'

import { selectActionColors } from './map.selectors'

describe('selectActionColors', () => {
  test('find colors by label id', () => {
    const project = {
      name: 'foo',
      dataset: 'some-dataset',
      labels: [
        {
          id: 'bar',
          name: 'some-name',
        },
        {
          id: 'foo',
          name: 'other-name',
        },
      ],
      available_filters: [],
      display_options: [],
    }
    const expected = {
      bar: '#800000',
      btw_set_haul: '#5D88FF',
      bottom_trawling: '#6FE9FE',
      discharging: '#6FE9FE',
      dredging: '#FC9B98',
      fishing: '#FFD714',
      foo: '#000080',
      hauling: '#ff00ff',
      mid_trawling: '#9966FF',
      nondredging: '#B3DF8A',
      notfishing: '#FDA16F',
      other: '#E1B57B',
      selected: '#ffffff',
      setting: '#00ff00',
      transiting: '#5D88FF',
      transporting: '#FF5F00',
      trawling: '#FF5F00',
      untracked: '#8091AB',
      dumping: '#9966FF',
    }
    const result = selectActionColors.resultFunc(project, TRACK_COLORS)
    expect(result).toEqual(expected)
  })
})
