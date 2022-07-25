import { capitalize } from 'lodash'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import RiskIdentityIndicator from 'features/risk-identity-indicator/risk-identity-indicator'
import InfoFieldHistory from 'features/profile/components/InfoFieldHistory'
import { VesselFieldLabel } from 'types/vessel'
import { ValueItem } from 'types'

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

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => {
    if (flagsHistory.length > 0) {
      setModalOpen(true)
    }
  }, [flagsHistory.length])
  const closeModal = useCallback(() => setModalOpen(false), [])

  const subtitle = useMemo(() => {
    const listFlags = Array.from(new Set(flags)).map((flag) =>
      t(`flags:${flag}` as any, flag.toLocaleUpperCase())
    )
    return `(${listFlags})`
  }, [flags, t])
  return (
    <Fragment>
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
        onInfoClick={openModal}
      ></RiskIdentityIndicator>
      <InfoFieldHistory
        label={VesselFieldLabel.flag}
        history={flagsHistory}
        isOpen={modalOpen}
        hideTMTDate={hideTMTDate}
        onClose={closeModal}
        vesselName={vesselName}
      ></InfoFieldHistory>
    </Fragment>
  )
}

export default RiskIdentityFlagsOnMouIndicator
