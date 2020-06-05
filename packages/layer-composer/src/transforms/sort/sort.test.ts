import { Style } from 'mapbox-gl'
import { ExtendedLayer, Group } from '../../types'
import sort, { convertLegacyGroups } from './sort'

const mock: Style = {
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
      metadata: {
        group: Group.Heatmap,
      },
    },
    {
      id: 'eez',
      metadata: {
        'mapbox:group': 'static',
      },
    },
    {
      id: 'rfmo',
      metadata: {
        group: Group.OutlinePolygons,
      },
    },
    {
      id: 'rulers',
      metadata: {
        'mapbox:group': 'tools',
      },
    },
    {
      id: 'basemapLabels',
      metadata: {
        group: Group.BasemapForeground,
      },
    },
    {
      id: 'custom',
    },
  ],
}

test('sort according to order', async () => {
  const sortedStyle = sort(convertLegacyGroups(mock))
  const sortedIds = sortedStyle.layers?.map((l: ExtendedLayer) => l.id)

  expect(sortedIds?.join('|')).toMatch('background|fishing|eez|rfmo|custom|basemapLabels|rulers')
})
