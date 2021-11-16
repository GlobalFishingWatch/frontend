import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'

export const dataviews: Dataview[] = [
  {
    id: 999,
    name: 'Default points layer',
    description: 'Default points layer',
    app: 'fishing-map',
    config: {
      type: 'USER_POINTS',
      color: '#00FFBC',
      colorRamp: 'teal',
    },
    category: DataviewCategory.Context,
    datasetsConfig: [],
  },
]

export default dataviews
