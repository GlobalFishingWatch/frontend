import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/sidebar/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import { selectBivariate } from 'routes/routes.selectors'
import LayerPanel from './HeatmapLayerPanel'

function HeatmapsSection(): React.ReactElement {
  const { t } = useTranslation()
  const dataviews = useSelector(selectTemporalgridDataviews)
  const { removeDataviewInstance } = useDataviewInstancesConnect()
  const onAddClick = useCallback(() => {
    removeDataviewInstance('fishing-1')
  }, [removeDataviewInstance])

  const { dispatchQueryParams } = useLocationConnect()
  const bivariate = useSelector(selectBivariate)
  const onToggleCombinationMode = () => {
    dispatchQueryParams({ bivariate: !bivariate })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.fishing', 'Fishing')}</h2>
        <div className={styles.sectionButtons}>
          <IconButton
            icon={bivariate ? 'split' : 'compare'}
            type="border"
            tooltip={
              bivariate
                ? t('layer.toggleCombinationMode.compare', 'Show fishing layers in comparison mode')
                : t(
                    'layer.toggleCombinationMode.bivariate',
                    'Show fishing layers in bivariate mode'
                  )
            }
            tooltipPlacement="top"
            onClick={onToggleCombinationMode}
          />
          <IconButton
            icon="plus"
            type="border"
            tooltip="Add layer"
            tooltipPlacement="top"
            onClick={onAddClick}
            disabled={dataviews && dataviews.length > 0}
          />
        </div>
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default HeatmapsSection
