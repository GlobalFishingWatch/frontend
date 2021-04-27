import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'

type RemoveProps = {
  error: boolean
  loading?: boolean
  tooltip: string
  className?: string
  onClick: (e: any) => void
}

const Remove = ({ onClick, className }: RemoveProps) => {
  const { t } = useTranslation()
  return (
    <IconButton
      icon="delete"
      size="small"
      tooltip={t('layer.remove', 'Remove layer')}
      tooltipPlacement="top"
      onClick={onClick}
      className={className}
    />
  )
}

export default Remove
