import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

type ColorProps = {
  open: boolean
  dataview: UrlDataviewInstance
  onClick: (e: any) => void
  className: string
}

const Color = ({ open, dataview, onClick, className }: ColorProps) => {
  const { t } = useTranslation()
  return (
    <IconButton
      icon={open ? 'color-picker' : 'color-picker-filled'}
      size="small"
      style={open ? {} : { color: dataview.config?.color }}
      tooltip={t('layer.color_change', 'Change color')}
      tooltipPlacement="top"
      onClick={onClick}
      className={className}
    />
  )
}

export default Color
