import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'

export const dataviews: Dataview[] = [
  {
    id: 330,
    name: 'User track',
    slug: 'user-track',
    description: 'User track',
    app: 'fishing-map',
    config: {
      type: 'TRACK',
      color: '#F95E5E',
    },
    category: DataviewCategory.User,
    createdAt: '2023-02-21T20:32:02.152Z',
    updatedAt: '2023-02-21T20:32:02.152Z',
  },
  {
    id: 353,
    name: 'Default context layer',
    slug: 'default-context-layer',
    description: 'Default context layer',
    app: 'fishing-map',
    config: {
      type: 'USER_CONTEXT',
      color: '#F95E5E',
    },
    category: DataviewCategory.User,
    createdAt: '2023-02-21T20:32:32.709Z',
    updatedAt: '2023-02-21T20:32:32.709Z',
  },
  {
    id: 339,
    name: 'Default points layer',
    slug: 'default-points-layer',
    description: 'Default points layer',
    app: 'fishing-map',
    config: {
      type: 'USER_POINTS',
      color: '#00FFBC',
      colorRamp: 'teal',
    },
    category: DataviewCategory.User,
    createdAt: '2023-02-21T20:32:04.646Z',
    updatedAt: '2023-02-21T20:32:04.646Z',
  },
  {
    id: 347,
    name: 'Default environmental layer',
    slug: 'default-environmental-layer',
    description: 'Default environmental layer',
    app: 'fishing-map',
    config: {
      type: 'USER_CONTEXT',
      color: '#00FFBC',
      colorRamp: 'teal',
    },
    category: DataviewCategory.User,
    createdAt: '2023-02-21T20:32:23.719Z',
    updatedAt: '2023-02-21T20:32:23.719Z',
  },
]

export default dataviews
