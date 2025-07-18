import type { IconButtonSize } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

type InfoErrorProps = {
  error?: boolean
  loading?: boolean
  tooltip: string
  className?: string
  onClick?: () => void
  size?: IconButtonSize
}

const InfoError = ({
  error,
  loading,
  tooltip,
  className,
  onClick,
  size = 'small',
}: InfoErrorProps) => {
  return (
    <IconButton
      icon={error ? 'warning' : 'info'}
      type={error ? 'warning' : 'default'}
      size={size}
      loading={loading}
      className={className}
      tooltip={tooltip}
      tooltipPlacement="top"
      onClick={onClick}
    />
  )
}

export default InfoError
