import { Dexie } from 'dexie'
import { OfflineVessel } from 'types/vessel'

export class VesselHistoryIdb extends Dexie {
  vessels: Dexie.Table<OfflineVessel, string>

  constructor() {
    super('VesselHistory')

    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(1).stores({
      vessels: [
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
      ].join(','),
    })

    // The following lines are needed for it to work across typescipt using babel-preset-typescript:
    this.vessels = this.table('vessels')
  }
}

const db = new VesselHistoryIdb()
export default db
