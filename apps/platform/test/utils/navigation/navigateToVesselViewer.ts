import { PIPE_DATASET_VERSION } from '@globalfishingwatch/datasets-client/constants'
import { ROUTE_PATHS } from '@platform/config/routes'

import type { QueryParams } from 'types'

import type { NavigationConfig } from './navigation-config'

/** Gabu Reefer */
const DEFAULT_VESSEL_ID = '9827ea1ea-a120-f374-0cc6-138b38bd8130'
// Registry ids belong to an identity dataset version: under v4.0 Gabu Reefer has no registry
// records at all (checked 2026-11-19), under v5.0 this one, owned by FISHING CARGO SERVICES.
// Re-check it whenever PIPE_DATASET_VERSION changes.
const DEFAULT_REGISTRY_ID = 'b16ca93ea690fc725e9237d5cf9a798d'

type VesselViewerParams = {
  vesselId?: string
  vesselDatasetId?: string
  vesselIdentitySource?: 'registryInfo' | 'selfReportedInfo'
  vesselRegistryId?: string
  vesselSelfReportedId?: string
}

export function navigateToVesselViewer(
  params?: VesselViewerParams
): NavigationConfig<typeof ROUTE_PATHS.WORKSPACE_VESSEL> {
  const {
    vesselId = DEFAULT_VESSEL_ID,
    vesselDatasetId = `public-global-vessel-identity:v${PIPE_DATASET_VERSION}.0`,
    vesselIdentitySource = 'registryInfo',
    vesselRegistryId = DEFAULT_REGISTRY_ID,
    vesselSelfReportedId,
  } = params ?? {}

  return {
    to: ROUTE_PATHS.WORKSPACE_VESSEL,
    params: {
      category: 'fishing-activity',
      workspaceId: 'default-public',
      vesselId,
    },
    search: {
      longitude: 28.5658211188976,
      latitude: 17.122983665325915,
      zoom: 1.388758970309439,
      vesselDatasetId,
      vesselIdentitySource,
      ...(vesselIdentitySource === 'selfReportedInfo'
        ? { vesselSelfReportedId }
        : { vesselRegistryId }),
      visibleEvents: ['loitering', 'encounter', 'port_visit', 'gaps'],
    } as QueryParams,
  }
}
