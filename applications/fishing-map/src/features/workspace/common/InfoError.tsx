import { IconButton } from '@globalfishingwatch/ui-components'

type InfoErrorProps = {
  error?: boolean
  loading?: boolean
  tooltip: string
  className?: string
}

const InfoError = ({ error, loading, tooltip, className }: InfoErrorProps) => {
  return (
    <IconButton
      icon={error ? 'warning' : 'info'}
      type={error ? 'warning' : 'default'}
      size="small"
      loading={loading}
      className={className}
      tooltip={tooltip}
      tooltipPlacement="top"
    />
  )
}

export default InfoError
