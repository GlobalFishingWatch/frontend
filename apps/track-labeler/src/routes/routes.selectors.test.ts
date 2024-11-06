import { selectProjectColors } from './routes.selectors'

describe('selectProjectColors', () => {
  const expectedGlobal = {
    btw_set_haul: '#5D88FF',
    bottom_trawling: '#6FE9FE',
    discharging: '#6FE9FE',
    dredging: '#FC9B98',
    fishing: '#FFD714',
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

  test('adds project specific colors', () => {
    const project = {
      name: 'foo',
      dataset: 'some-dataset',
      labels: [
        {
          id: 'bar',
          name: 'some-name',
          color: '#123456',
        },
      ],
      available_filters: [],
      display_options: [],
    }
    const expected = {
      ...expectedGlobal,
      bar: '#123456',
    }
    const result = selectProjectColors.resultFunc(project)
    expect(result).toEqual(expected)
  })

  test('overrides global color with project specific colors', () => {
    const project = {
      name: 'foo',
      dataset: 'some-dataset',
      labels: [
        {
          id: 'fishing',
          name: 'Fishin on this project',
          color: '#123456',
        },
      ],
      available_filters: [],
      display_options: [],
    }
    const expected = {
      ...expectedGlobal,
      fishing: '#123456',
    }
    const result = selectProjectColors.resultFunc(project)
    expect(result).toEqual(expected)
  })
})
