import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'
import type { ValueItem } from 'types'

import RiskIdentityIndicator from 'features/risk-identity-indicator/risk-identity-indicator'
import { VesselFieldLabel } from 'types/vessel'

export interface RiskIdentityFlagsOnMouIndicatorProps {
  name: string
  flags: string[]
  flagsHistory?: ValueItem[]
  hideTMTDate?: boolean
  vesselName: string
}

export function RiskIdentityFlagsOnMouIndicator({
  name,
  flags,
  flagsHistory = [],
  hideTMTDate = false,
  vesselName,
}: RiskIdentityFlagsOnMouIndicatorProps) {
  const { t } = useTranslation()
  const subtitle = useMemo(() => {
    const listFlags = Array.from(new Set(flags)).map((flag) =>
      t(`flags:${flag}` as any, flag.toLocaleUpperCase())
    )
    return `(${listFlags})`
  }, [flags, t])
  return (
    <RiskIdentityIndicator
      title={
        t(
          'risk.vesselWithFlagOnMOU',
          'Vessel flying under a flag on the {{mou_name}} MOU black or grey list',
          {
            mou_name: capitalize(name),
          }
        ) as string
      }
      subtitle={subtitle}
      field={VesselFieldLabel.flag}
      history={flagsHistory}
      hideTMTDate={hideTMTDate}
      vesselName={vesselName}
    ></RiskIdentityIndicator>
  )
}

export default RiskIdentityFlagsOnMouIndicator
