import { Fragment, Suspense } from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Dataset, DataviewCategory } from '@globalfishingwatch/api-types/dist'
import datasets from 'features/datasets/datasets.mock'
import store from 'store'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getRelatedDatasetByType } from 'features/datasets/datasets.selectors'
import { TooltipEventFeature } from '../map.hooks'
import HeatmapTooltipRow from './FishingLayers'

jest.mock('features/workspace/workspace.selectors')
jest.mock('features/workspace/workspace.hook')

describe('HeatmapTooltipRow', () => {
  const feature: TooltipEventFeature = {
    title: 'Some tooltip title',
    category: DataviewCategory.Fishing,
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

  const setup = () => {
    const component = render(
      <Provider store={store}>
        <Suspense fallback={<Fragment />}>
          <HeatmapTooltipRow feature={feature} showFeaturesDetails={true} />
        </Suspense>
      </Provider>
    )
    const getVesselInfoButton = (id: string) => component.getByLabelText(`vessel-info-${id}`)
    return {
      component,
      getVesselInfoButton,
    }
  }

  const spyGetRelatedDatasetByType: jest.Mock = getRelatedDatasetByType as jest.Mock
  const spyUseDataviewInstancesConnect: jest.Mock = useDataviewInstancesConnect as jest.Mock
  const spyUpsertDataviewInstance = jest.fn()

  beforeEach(() => {
    spyGetRelatedDatasetByType.mockReturnValue(datasets)
    spyUseDataviewInstancesConnect.mockImplementation(() => ({
      upsertDataviewInstance: spyUpsertDataviewInstance,
    }))
  })
  afterAll(() => {
    jest.clearAllMocks()
  })
  it('renders vessel info in tooltip', () => {
    const { component } = setup()
    expect(component.container).toMatchSnapshot()
  })

  it('upserts the vessel when clicking on it', () => {
    const { getVesselInfoButton } = setup()
    const id = 'vessel-1'
    const firstVesselInfoButton = getVesselInfoButton(id)

    fireEvent.click(firstVesselInfoButton)

    expect(spyUpsertDataviewInstance).toHaveBeenCalledWith([
      {
        config: { color: expect.any(String) },
        datasetsConfig: [
          {
            datasetId: undefined,
            endpoint: 'carriers-tracks',
            params: [{ id: 'vesselId', value: 'vessel-1' }],
          },
          {
            datasetId: undefined,
            endpoint: 'carriers-vessel',
            params: [{ id: 'vesselId', value: 'vessel-1' }],
          },
        ],
        dataviewId: 92,
        id: 'vessel-vessel-1',
      },
      {
        config: {},
        datasetsConfig: [
          {
            datasetId: undefined,
            endpoint: 'carriers-events',
            params: [],
            query: [{ id: 'vessels', value: 'vessel-1' }],
          },
        ],
        dataviewId: 99999,
        id: 'vessel_events-vessel-1',
      },
    ])
  })
})
