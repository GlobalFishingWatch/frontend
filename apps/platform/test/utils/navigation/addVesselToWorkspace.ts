import { PIPE_DATASET_VERSION } from '@globalfishingwatch/datasets-client/constants'
import { TEMPLATE_VESSEL_DATAVIEW_SLUG } from '@platform/config/map/dataviews'
import { ROUTE_PATHS } from '@platform/config/routes'

import type { NavigationConfig } from './navigation-config'

// Derived from the app's pipe version, not hard-coded: the helpers stayed on v4.0 after the app
// moved to v5.0, and under the v4.0 identity Gabu Reefer has no registry records any more.
const V = `v${PIPE_DATASET_VERSION}.0`

export function addVesselToWorkspace(): NavigationConfig<typeof ROUTE_PATHS.WORKSPACE> {
  return {
    to: ROUTE_PATHS.WORKSPACE,
    params: {
      category: 'fishing-activity',
      workspaceId: 'default-public',
    },
    search: {
      longitude: 26,
      latitude: 19,
      zoom: 1.49,
      dataviewInstances: [
        {
          id: 'vessel-9827ea1ea-a120-f374-0cc6-138b38bd8130',
          dataviewId: TEMPLATE_VESSEL_DATAVIEW_SLUG,
          config: {
            track: `public-global-all-tracks:${V}`,
            info: `public-global-vessel-identity:${V}`,
            events: [
              `public-global-fishing-events:${V}`,
              `public-global-port-visits-events:${V}`,
              `public-global-encounters-events:${V}`,
              `public-global-loitering-events:${V}`,
              `public-global-gaps-events:${V}`,
            ],
            relatedVesselIds: [
              '1da8dbc23-3c48-d5ce-95f1-1ffb6cc00161',
              '0b7047cb5-58c8-6e63-4bfd-96a6af515c91',
              '58cf536b1-1fca-dac3-ad31-7411a3708dcd',
            ],
            color: '#F95E5E',
          },
          deleted: false,
        },
      ],
      lastTransmissionDate: '',
      firstTransmissionDate: '',
      timebarVisualisation: 'vessel',
    },
  }
}
