import { DateTime } from 'luxon'
import {
  AnyHistoricValue,
  AnyValueList,
  GFWDetail,
  TMTDetail,
  VesselAPISource,
  AuthorizationList,
} from 'types'
import { getFlagById } from 'utils/flags'
import { getVesselValueSource } from 'utils/vessel'

export interface HistoricValue {
  data: string
  start: DateTime | null
  end: DateTime | null
}
export interface InfoValue {
  data: string | null
  historic: Array<HistoricValue>
}
export interface VesselInfoValue {
  value: InfoValue | null
  source: VesselAPISource[]
}

export class VesselInfo {
  gfwData?: GFWDetail | null
  tmtData?: TMTDetail | null

  constructor(gfwData: GFWDetail | null, tmtData: TMTDetail | null) {
    this.gfwData = gfwData
    this.tmtData = tmtData
  }

  returnValue(
    gfwValue?: string | null,
    tmtValue?: AnyValueList[] | null,
    gfwData?: GFWDetail | null,
    gfwHistoricValue?: AnyHistoricValue[]
  ): InfoValue {
    if ((!tmtValue || !tmtValue.length) && !gfwValue) {
      return {
        data: null,
        historic: [],
      }
    }
    const dataValues =
      tmtValue?.map((historicValue: AnyValueList) => {
        const value: HistoricValue = {
          data: historicValue.value,
          start: historicValue.firstSeen
            ? DateTime.fromISO(historicValue.firstSeen, { zone: 'UTC' })
            : null,
          end: historicValue.endDate
            ? DateTime.fromISO(historicValue.endDate, { zone: 'UTC' })
            : null,
        }
        return value
      }) || []
    if (gfwValue) {
      dataValues.push({
        data: gfwValue,
        start: gfwData?.firstTransmissionDate
          ? DateTime.fromISO(gfwData?.firstTransmissionDate, { zone: 'UTC' })
          : null,
        end: gfwData?.lastTransmissionDate
          ? DateTime.fromISO(gfwData?.lastTransmissionDate, { zone: 'UTC' })
          : null,
      })
    }
    if (gfwHistoricValue && gfwHistoricValue.length) {
      gfwHistoricValue
        .slice()
        .sort((a: AnyHistoricValue, b: AnyHistoricValue) => a.counter - b.counter)
        .forEach((value: AnyHistoricValue) => {
          dataValues.push({
            data: value.name,
            start: gfwData?.firstTransmissionDate
              ? DateTime.fromISO(gfwData?.firstTransmissionDate, { zone: 'UTC' })
              : null,
            end: gfwData?.lastTransmissionDate
              ? DateTime.fromISO(gfwData?.lastTransmissionDate, { zone: 'UTC' })
              : null,
          })
        })
    }

    return {
      data: dataValues.shift()?.data as string,
      historic: dataValues,
    }
  }

  getName(): VesselInfoValue {
    return {
      value: this.returnValue(
        this.gfwData?.shipname,
        this.tmtData?.valueList.name,
        this.gfwData,
        this.gfwData?.otherShipnames
      ),
      source: getVesselValueSource(this.gfwData?.shipname, this.tmtData?.valueList.name),
    }
  }

  getType(): VesselInfoValue {
    return {
      value: this.returnValue(null, this.tmtData?.valueList.vesselType, this.gfwData),
      source: getVesselValueSource(null, this.tmtData?.valueList.vesselType),
    }
  }

  getFlag(): VesselInfoValue {
    const flag = this.returnValue(this.gfwData?.flag, this.tmtData?.valueList.flag, this.gfwData)
    if (!flag || !flag.data) {
      return {
        value: {
          data: null,
          historic: [],
        },
        source: getVesselValueSource(this.gfwData?.flag, this.tmtData?.valueList.flag),
      }
    }

    return {
      value: {
        data: getFlagById(flag.data)?.label as string,
        historic: flag.historic.map((f: HistoricValue) => {
          const historicFlag: HistoricValue = {
            ...f,
            data: getFlagById(f.data)?.label as string,
          }
          return historicFlag
        }),
      },
      source: getVesselValueSource(this.gfwData?.flag, this.tmtData?.valueList.flag),
    }
  }

  getMMSI(): VesselInfoValue {
    return {
      value: this.returnValue(
        this.gfwData?.mmsi,
        this.tmtData?.valueList.mmsi,
        this.gfwData,
        this.gfwData?.otherImos
      ),
      source: getVesselValueSource(this.gfwData?.mmsi, this.tmtData?.valueList.mmsi),
    }
  }

  getCallsign(): VesselInfoValue {
    return {
      value: this.returnValue(
        this.gfwData?.callsign,
        this.tmtData?.valueList.ircs,
        this.gfwData,
        this.gfwData?.otherCallsigns
      ),
      source: getVesselValueSource(this.gfwData?.callsign, this.tmtData?.valueList.ircs),
    }
  }

  getGearType(): VesselInfoValue {
    return {
      value: this.returnValue(null, this.tmtData?.valueList.gear, this.gfwData),
      source: getVesselValueSource(null, this.tmtData?.valueList.gear),
    }
  }

  getImo(): VesselInfoValue {
    return {
      value: this.returnValue(this.gfwData?.imo, this.tmtData?.valueList.imo, this.gfwData),
      source: getVesselValueSource(this.gfwData?.imo, this.tmtData?.valueList.imo),
    }
  }

  getLength(): VesselInfoValue {
    return {
      value: this.returnValue(null, this.tmtData?.valueList.loa, this.gfwData),
      source: getVesselValueSource(null, this.tmtData?.valueList.loa),
    }
  }

  getDepth(): VesselInfoValue {
    return {
      value: this.returnValue(null, this.tmtData?.valueList.depth, this.gfwData),
      source: getVesselValueSource(null, this.tmtData?.valueList.depth),
    }
  }

  getGrossTonnage(): VesselInfoValue {
    return {
      value: this.returnValue(null, this.tmtData?.valueList.gt, this.gfwData),
      source: getVesselValueSource(null, this.tmtData?.valueList.gt),
    }
  }

  getOwner(): VesselInfoValue {
    return {
      value: this.returnValue(null, this.tmtData?.relationList.vesselOwnership, this.gfwData),
      source: getVesselValueSource(null, this.tmtData?.relationList.vesselOwnership),
    }
  }

  getOperator(): VesselInfoValue {
    return {
      value: this.returnValue(null, this.tmtData?.relationList.vesselOperations, this.gfwData),
      source: getVesselValueSource(null, this.tmtData?.relationList.vesselOperations),
    }
  }

  getBuiltYear(): VesselInfoValue {
    const yearMonth = this.returnValue(null, this.tmtData?.valueList.builtYear, this.gfwData)

    return {
      value: {
        data: yearMonth && yearMonth.data ? yearMonth.data.slice(0, 4) : null,
        historic: yearMonth?.historic,
      },
      source: getVesselValueSource(null, this.tmtData?.valueList.builtYear),
    }
  }

  getAuthorisations(): Array<string> {
    return (
      this.tmtData?.authorisationList.map((auth: AuthorizationList) => {
        return auth.source
      }) || []
    )
  }
}
