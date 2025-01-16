import { Dexie } from 'dexie'

import type { OfflineVessel } from 'types/vessel'

export class VesselHistoryIdb extends Dexie {
  vessels: Dexie.Table<OfflineVessel, string>

  constructor() {
    super('VesselHistory')
    const vesselFieldsV1 = [
      '++profileId',
      'id',
      'flag',
      'shipname',
      'firstTransmissionDate',
      'lastTransmissionDate',
      'imo',
      'mmsi',
      'callsign',
      'fleet',
      'origin',
      'type',
      'gearType',
      'length',
      'depth',
      'grossTonnage',
      'owner',
      'operator',
      'builtYear',
      'authorizations',
      'registeredGearType',
      'dataset',
      'source',
      'vesselMatchId',
      'savedOn',
    ]
    const vesselFieldsV2 = [...vesselFieldsV1, 'activities']
    // Need to set an initial empty version so that the schemaDiff error does not appear
    this.version(1)

    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(2).stores({
      vessels: vesselFieldsV1.join(','),
    })

    // The following lines are needed for it to work across typescipt using babel-preset-typescript:
    this.vessels = this.table('vessels')

    this.version(3).stores({
      vessels: vesselFieldsV2.join(','),
    })

    //this.activity = this.table('activity')
  }
}

const db = new VesselHistoryIdb()
export default db
