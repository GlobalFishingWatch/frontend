import React, { Fragment, useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Choice, { ChoiceOption } from '@globalfishingwatch/ui-components/dist/choice'
import { Generators } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectActivityDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import { selectBivariateDataviews } from 'features/app/app.selectors'
import {
  getFishingDataviewInstance,
  getPresenceDataviewInstance,
} from 'features/dataviews/dataviews.utils'
import { ACTIVITY_OPTIONS } from 'data/config'
import { WorkspaceActivityCategory } from 'types'
import { selectActivityCategory } from 'routes/routes.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import LayerPanel from './HeatmapLayerPanel'
import heatmapStyles from './HeatmapsSection.module.css'

function HeatmapsSection(): React.ReactElement {
  const { t } = useTranslation()
  const [addedDataviewId, setAddedDataviewId] = useState<string | undefined>()
  const dataviews = useSelector(selectActivityDataviews)
  const activityCategory = useSelector(selectActivityCategory)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const bivariateDataviews = useSelector(selectBivariateDataviews)
  const { start } = useTimerangeConnect()

  useEffect(() => {
    setAddedDataviewId(undefined)
  }, [activityCategory])

  const onActivityOptionClick = useCallback(
    (activityOption: ChoiceOption) => {
      const queryParams: Record<string, any> = {
        activityCategory: activityOption.id as WorkspaceActivityCategory,
      }
      // TODO check that range is < 1 day
      if (activityOption.id === 'presence' && start) {
        // Force a minimum of 1 day range when in presence mode
        queryParams.start = start
        // TODO check while it still throws
        queryParams.end = DateTime.fromISO(start).toUTC().plus({ days: 1 }).toISO()
      }
      dispatchQueryParams(queryParams)
    },
    [dispatchQueryParams, start]
  )

  const onAddClick = useCallback(
    (category: WorkspaceActivityCategory) => {
      dispatchQueryParams({ bivariateDataviews: undefined })
      const dataviewInstance =
        category === 'fishing' ? getFishingDataviewInstance() : getPresenceDataviewInstance()
      upsertDataviewInstance(dataviewInstance)
      setAddedDataviewId(dataviewInstance.id)
    },
    [dispatchQueryParams, upsertDataviewInstance]
  )

  const onBivariateDataviewsClick = useCallback(
    (dataview1: UrlDataviewInstance, dataview2: UrlDataviewInstance) => {
      dispatchQueryParams({ bivariateDataviews: [dataview1.id, dataview2.id] })
      // automatically set other animated heatmaps to invisible
      const dataviewsToDisable = dataviews?.filter(
        (dataview) =>
          dataview.id !== dataview1.id &&
          dataview.id !== dataview2.id &&
          dataview.config?.type === Generators.Type.HeatmapAnimated
      )
      dataviewsToDisable?.forEach((dataview) => {
        upsertDataviewInstance({
          id: dataview.id,
          config: {
            visible: false,
          },
        })
      })
    },
    [dataviews, dispatchQueryParams, upsertDataviewInstance]
  )

  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.activity', 'Activity')}</h2>
        <Choice
          size="small"
          className={cx('print-hidden')}
          options={ACTIVITY_OPTIONS}
          activeOption={activityCategory}
          onOptionClick={onActivityOptionClick}
        />
        <div className={cx('print-hidden', styles.sectionButtons)}>
          <IconButton
            icon="plus"
            type="border"
            size="medium"
            tooltip={t('layer.add', 'Add layer')}
            tooltipPlacement="top"
            onClick={() => onAddClick(activityCategory)}
          />
        </div>
      </div>
      {dataviews?.map((dataview, index) => {
        const isLastElement = index === dataviews?.length - 1
        const isVisible = dataview?.config?.visible ?? false
        const isNextVisible = dataviews[index + 1]?.config?.visible ?? false
        const showBivariateIcon =
          bivariateDataviews === undefined && isVisible && isNextVisible && !isLastElement
        return (
          <Fragment key={dataview.id}>
            <LayerPanel
              key={dataview.id}
              dataview={dataview}
              showBorder={!showBivariateIcon}
              isOpen={dataview.id === addedDataviewId}
            />
            {showBivariateIcon && (
              <div className={cx(heatmapStyles.bivariateToggleContainer, 'print-hidden')}>
                <IconButton
                  icon={bivariateDataviews ? 'split' : 'compare'}
                  type="border"
                  size="small"
                  className={heatmapStyles.bivariateToggle}
                  tooltip={t('layer.toggleCombinationMode.combine', 'Combine layers')}
                  tooltipPlacement="top"
                  onClick={() => onBivariateDataviewsClick(dataview, dataviews[index + 1])}
                />
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default HeatmapsSection
