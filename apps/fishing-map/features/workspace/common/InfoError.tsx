import { IconButton } from '@globalfishingwatch/ui-components'

type InfoErrorProps = {
  error?: boolean
  loading?: boolean
  tooltip: string
  className?: string
  onClick?: () => void
}

const InfoError = ({ error, loading, tooltip, className, onClick }: InfoErrorProps) => {
  return (
    <IconButton
      icon={error ? 'warning' : 'info'}
      type={error ? 'warning' : 'default'}
      size="small"
      loading={loading}
      className={className}
      tooltip={tooltip}
      tooltipPlacement="top"
      onClick={onClick}
    />
  )
}

export default InfoError
