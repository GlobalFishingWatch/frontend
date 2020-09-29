import { Workspace } from '@globalfishingwatch/dataviews-client'

const workspace: Workspace = {
  id: 1,
  name: 'Fishing Map',
  description: 'Default workspace used in fishing map 3.0',
  viewport: {
    latitude: 1,
    longitude: 2,
    zoom: 3,
  },
  start: '',
  end: '',
  dataviews: [] as any,
  dataviewsConfig: {} as any,
}

export default workspace
