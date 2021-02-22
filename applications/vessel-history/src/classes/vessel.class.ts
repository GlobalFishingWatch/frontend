import { GFWDetail, TMTDetail, VesselAPISource } from 'types'
import { getFlagById } from 'utils/flags'
import { getVesselValueSource } from 'utils/vessel'

export interface VesselInfoValue {
  value: string | Array<string> | null
  source: VesselAPISource[]
}

export class VesselInfo {
  gfwData?: GFWDetail | null
  tmtData?: TMTDetail | null

  constructor(gfwData: GFWDetail | null, tmtData: TMTDetail | null) {
    this.gfwData = gfwData
    this.tmtData = tmtData
  }

  returnValue(gfwValue: any, tmtValue: any) {
    if (tmtValue && tmtValue.length) {
      return tmtValue[0].value
    }

    return gfwValue
  }

  getName() {
    return {
      value: this.returnValue(this.gfwData?.shipname, this.tmtData?.valueList.name),
      source: getVesselValueSource(this.gfwData?.shipname, this.tmtData?.valueList.name),
    }
  }

  getType() {
    return {
      value: this.returnValue(null, this.tmtData?.valueList.vesselType),
      source: getVesselValueSource(null, this.tmtData?.valueList.vesselType),
    }
  }

  getFlag() {
    return {
      value: getFlagById(this.returnValue(this.gfwData?.flag, this.tmtData?.valueList.flag))?.label,
      source: getVesselValueSource(this.gfwData?.flag, this.tmtData?.valueList.flag),
    }
  }

  getMMSI() {
    return {
      value: this.returnValue(this.gfwData?.mmsi, this.tmtData?.valueList.mmsi),
      source: getVesselValueSource(this.gfwData?.mmsi, this.tmtData?.valueList.mmsi),
    }
  }
}
