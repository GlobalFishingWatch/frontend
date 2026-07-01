import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { IconButtonSize } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import {
  usePinVessel,
  type UsePinVesselParams,
  type VesselPinClickProps,
  type VesselPinOnClickCb,
  type VesselToResolve,
  type VesselToSearch,
} from './vessel-pin.hooks'

export type { VesselToResolve, VesselToSearch, VesselPinClickProps, VesselPinOnClickCb }

type VesselPinProps = UsePinVesselParams & {
  className?: string
  disabled?: boolean
  size?: IconButtonSize
  style?: React.CSSProperties
}

export function VesselPin({
  vessel,
  vesselToResolve,
  vesselToSearch,
  disabled,
  className = '',
  size = 'small',
  origin,
  onClick,
  config,
  dataviewTemplateId,
  style,
}: VesselPinProps) {
  const { t } = useTranslation()
  const { onPinClick, loading, vesselInWorkspace } = usePinVessel({
    vessel,
    vesselToResolve,
    vesselToSearch,
    origin,
    onClick,
    config,
    dataviewTemplateId,
  })

  const vesselName = useMemo(
    () => vessel?.selfReportedInfo?.[0].shipname?.toLowerCase()?.replace(/\s/g, '-') || '',
    [vessel]
  )

  return (
    <IconButton
      data-testid={`vessel-pin-button-${vesselName}`}
      icon={vesselInWorkspace ? 'pin-filled' : 'pin'}
      loading={loading}
      disabled={disabled}
      className={cx(className, 'print-hidden')}
      style={{
        color: vesselInWorkspace ? vesselInWorkspace.config?.color : '',
        ...(style || {}),
      }}
      tooltip={
        vesselInWorkspace
          ? t((t) => t.search.vesselAlreadyInWorkspace)
          : t((t) => t.vessel.addToWorkspace)
      }
      onClick={onPinClick}
      size={size}
    />
  )
}

export default VesselPin
