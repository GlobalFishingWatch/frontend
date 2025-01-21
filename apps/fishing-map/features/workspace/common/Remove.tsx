import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useDataviewInstancesConnect } from '../workspace.hook'

type RemoveProps = {
  className?: string
  dataview?: UrlDataviewInstance
  onClick?: (e: any) => void
  loading?: boolean
}

const Remove = ({ onClick, className, dataview, loading }: RemoveProps) => {
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
      loading={loading}
      tooltip={t('layer.remove', 'Remove layer')}
      tooltipPlacement="top"
      onClick={onClickInternal}
      className={className}
    />
  )
}

export default Remove
