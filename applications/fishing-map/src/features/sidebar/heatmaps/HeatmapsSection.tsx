import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/sidebar/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import { selectBivariate } from 'features/app/app.selectors'
import LayerPanel from './HeatmapLayerPanel'

function HeatmapsSection(): React.ReactElement {
  const { t } = useTranslation()
  const dataviews = useSelector(selectTemporalgridDataviews)
  const { removeDataviewInstance, upsertDataviewInstance } = useDataviewInstancesConnect()
  const onAddClick = useCallback(() => {
    removeDataviewInstance('fishing-1')
  }, [removeDataviewInstance])

  const { dispatchQueryParams } = useLocationConnect()
  const bivariate = useSelector(selectBivariate)
  const onToggleCombinationMode = () => {
    const newBivariateValue = !bivariate
    dispatchQueryParams({ bivariate: newBivariateValue })
    // automatically set 2 first animated heatmaps to visible
    if (newBivariateValue) {
      let heatmapAnimatedIndex = 0
      dataviews?.forEach((dataview) => {
        if (dataview.config?.type === Generators.Type.HeatmapAnimated) {
          const visible = heatmapAnimatedIndex < 2
          upsertDataviewInstance({
            id: dataview.id,
            config: {
              visible,
            },
          })
          heatmapAnimatedIndex++
        }
      })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.fishing', 'Fishing')}</h2>
        <div className={styles.sectionButtons}>
          <IconButton
            icon={bivariate ? 'split' : 'compare'}
            type="border"
            size="medium"
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
            size="medium"
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
