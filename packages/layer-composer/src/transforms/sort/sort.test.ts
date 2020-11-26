import { Layer, Style } from 'mapbox-gl'
import { ExtendedLayer, Group } from '../../types'
import sort, { convertLegacyGroups } from './sort'

type MockStyle = Omit<Style, 'layers'> & { layers: Partial<Layer>[] }

const mock: MockStyle = {
  version: 8,
  layers: [
    {
      id: 'background',
      metadata: {
        group: Group.Background,
      },
    },
    {
      id: 'fishing',
      type: 'heatmap',
      metadata: {
        group: Group.Heatmap,
      },
    },
    {
      id: 'eez',
      type: 'line',
      metadata: {
        'mapbox:group': 'static',
      },
    },
    {
      id: 'rfmo',
      type: 'line',
      metadata: {
        group: Group.OutlinePolygons,
      },
    },
    {
      id: 'rulers',
      type: 'line',
      metadata: {
        'mapbox:group': 'tools',
      },
    },
    {
      id: 'basemapLabels',
      type: 'line',
      metadata: {
        group: Group.BasemapForeground,
      },
    },
    {
      id: 'custom',
      type: 'line',
    },
  ],
}

test('sort according to order', async () => {
  const sortedStyle = sort(convertLegacyGroups(mock as Style))
  const sortedIds = sortedStyle.layers?.map((l: ExtendedLayer) => l.id)

  expect(sortedIds?.join('|')).toMatch('background|fishing|eez|rfmo|custom|basemapLabels|rulers')
})
