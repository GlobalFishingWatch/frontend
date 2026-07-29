import type { IdentityVesselData } from 'features/vessels/vessel/vessel.slice'

export const getSearchVesselId = (vessel: IdentityVesselData) => `${vessel.dataset.id}-${vessel.id}`
