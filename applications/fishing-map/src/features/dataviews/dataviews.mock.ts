import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types/dist'

export const dataviews: Dataview[] = [
  {
    id: 1,
    name: 'Encounter events',
    description: '',
    app: 'fishing-map',
    config: {
      type: 'TILE_CLUSTER',
      color: '#FAE9A0',
    },
    category: DataviewCategory.Events,
    datasetsConfig: [],
  },
]
export default dataviews
