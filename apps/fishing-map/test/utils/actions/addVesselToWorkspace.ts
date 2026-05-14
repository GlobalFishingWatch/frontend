import { setLocation } from 'router/location.slice'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/**
 * Pre-built `location/setLocation` action that seeds Redux state to match the
 * default fishing-activity workspace with the Gabu Reefer vessel track added.
 */
export const addVesselToWorkspaceAction = setLocation({
  type: 'WORKSPACE',
  payload: {
    category: 'fishing-activity',
    workspaceId: 'default-public',
  },
  pathname: '/fishing-activity/default-public',
  to: ROUTE_PATHS.WORKSPACE,
  query: {
    longitude: 26,
    latitude: 19,
    zoom: 1.49,
    dataviewInstances: [
      {
        id: 'vessel-9827ea1ea-a120-f374-0cc6-138b38bd8130',
        dataviewId: 'fishing-map-vessel-track-v-4',
        config: {
          track: 'public-global-all-tracks:v4.0',
          info: 'public-global-vessel-identity:v4.0',
          events: [
            'public-global-fishing-events:v4.0',
            'public-global-port-visits-events:v4.0',
            'public-global-encounters-events:v4.0',
            'public-global-loitering-events:v4.0',
            'public-global-gaps-events:v4.0',
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
  } as unknown as QueryParams,
})
