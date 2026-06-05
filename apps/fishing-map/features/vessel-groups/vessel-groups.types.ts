import type { IdentityVessel, VesselGroupVessel } from '@globalfishingwatch/api-types'

import type { ReportTableVessel } from 'features/reports/shared/vessels/report-vessels.types'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'

export type VesselGroupVesselIdentity = VesselGroupVessel & { identity?: IdentityVessel }

export type AddVesselGroupVessel = IdentityVesselData | VesselGroupVesselIdentity | ReportTableVessel
