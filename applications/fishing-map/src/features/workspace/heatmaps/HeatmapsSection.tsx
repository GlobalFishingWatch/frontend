import React, { useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectActivityDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import { selectBivariate } from 'features/app/app.selectors'
import { getHeatmapDataviewInstance } from 'features/dataviews/dataviews.utils'
import LayerPanel from './HeatmapLayerPanel'

function HeatmapsSection(): React.ReactElement {
  const { t } = useTranslation()
  const [heatmapSublayersAddedIndex, setHeatmapSublayersAddedIndex] = useState<number | undefined>()
  const dataviews = useSelector(selectActivityDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const bivariate = useSelector(selectBivariate)
  const supportBivariateToggle =
    dataviews?.filter((dataview) => dataview?.config?.visible)?.length === 2

  const onAddClick = useCallback(() => {
    setHeatmapSublayersAddedIndex(dataviews ? dataviews.length : 0)
    dispatchQueryParams({ bivariate: false })
    const usedRamps = dataviews?.flatMap((dataview) => dataview.config?.colorRamp || [])
    const dataviewInstance = getHeatmapDataviewInstance(usedRamps)
    upsertDataviewInstance(dataviewInstance)
  }, [dispatchQueryParams, dataviews, upsertDataviewInstance])

  const onToggleCombinationMode = useCallback(() => {
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
  }, [bivariate, dataviews, dispatchQueryParams, upsertDataviewInstance])

  let bivariateTooltip = bivariate
    ? t('layer.toggleCombinationMode.split', 'Split layers')
    : t('layer.toggleCombinationMode.combine', 'Combine layers')
  if (!supportBivariateToggle) {
    bivariateTooltip = t(
      'layer.toggleCombinationMode.disabled',
      'Combine mode is only available with two activity layers'
    )
  }

  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.activity', 'Activity')}</h2>
        <div className={cx('print-hidden', styles.sectionButtons)}>
          <IconButton
            icon={bivariate ? 'split' : 'compare'}
            type="border"
            size="medium"
            disabled={!supportBivariateToggle}
            tooltip={bivariateTooltip}
            tooltipPlacement="top"
            onClick={onToggleCombinationMode}
          />
          <IconButton
            icon="plus"
            type="border"
            size="medium"
            tooltip={t('layer.add', 'Add layer')}
            tooltipPlacement="top"
            onClick={onAddClick}
          />
        </div>
      </div>
      {dataviews?.map((dataview, index) => (
        <LayerPanel
          key={dataview.id}
          dataview={dataview}
          index={index}
          isOpen={index === heatmapSublayersAddedIndex}
        />
      ))}
    </div>
  )
}

export default HeatmapsSection
