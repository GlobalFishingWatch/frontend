import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDataviewInstancesConnect } from '../workspace.hook'

type RemoveProps = {
  className?: string
  dataview?: UrlDataviewInstance
  onClick?: (e: any) => void
}

const Remove = ({ onClick, className, dataview }: RemoveProps) => {
  const { t } = useTranslation()
  const { deleteDataviewInstance } = useDataviewInstancesConnect()

  const onClickInternal = useCallback(
    (e: any) => {
      if (onClick) {
        onClick(e)
        return
      }
      if (dataview) {
        deleteDataviewInstance(dataview.id)
      }
    },
    [onClick, dataview, deleteDataviewInstance]
  )

  return (
    <IconButton
      icon="delete"
      size="small"
      tooltip={t('layer.remove', 'Remove layer')}
      tooltipPlacement="top"
      onClick={onClickInternal}
      className={className}
    />
  )
}

export default Remove
