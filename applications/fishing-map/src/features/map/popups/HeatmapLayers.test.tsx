import { Fragment, Suspense } from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Dataset } from '@globalfishingwatch/api-types/dist'
import datasets from 'features/datasets/datasets.mock'
import store from 'store'
import { TooltipEventFeature } from '../map.hooks'
import HeatmapTooltipRow from './HeatmapLayers'

jest.useFakeTimers()

describe('HeatmapTooltipRow', () => {
  const feature: TooltipEventFeature = {
    title: 'Some tooltip title',
    color: 'cyan',
    unit: 'meters',
    source: 'my unit test',
    sourceLayer: 'fake layer',
    layerId: 'some layer id',
    value: '7654',
    properties: { foo: 'bar' },
    vesselsInfo: {
      overflow: true,
      numVessels: 5,
      vessels: [
        {
          shipname: 'Grand Test',
          id: 'vessel-1',
          dataset: datasets.slice(0, 1).shift() as Dataset,
          hours: 12,
        },
        {
          shipname: 'Santa Partner',
          id: 'vessel-2',
          dataset: datasets.slice(0, 1).shift() as Dataset,
          hours: 20,
        },
      ],
    },
  }

  it('renders vessel info in tooltip', () => {
    const component = render(
      <Provider store={store}>
        <Suspense fallback={<Fragment />}>
          <HeatmapTooltipRow feature={feature} showFeaturesDetails={true} />
        </Suspense>
      </Provider>
    )
    jest.runAllTimers()
    expect(component.container).toMatchSnapshot()
  })
})
