import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { event as uaEvent } from 'react-ga'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Choice, { ChoiceOption } from '@globalfishingwatch/ui-components/dist/choice'
import { Generators } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectActivityDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import {
  getFishingDataviewInstance,
  getPresenceDataviewInstance,
  getViirsDataviewInstance,
} from 'features/dataviews/dataviews.utils'
import { WorkspaceActivityCategory, WorkspacePresenceCategory } from 'types'
import {
  selectBivariateDataviews,
  selectActivityCategory,
  selectReadOnly,
} from 'features/app/app.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import TooltipContainer, { TooltipListContainer } from '../shared/TooltipContainer'
import LayerPanel from './ActivityLayerPanel'
import activityStyles from './ActivitySection.module.css'

function ActivitySection(): React.ReactElement {
  const { t } = useTranslation()
  const [addedDataviewId, setAddedDataviewId] = useState<string | undefined>()
  const [newLayerOpen, setNewLayerOpen] = useState<boolean>(false)
  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectActivityDataviews)
  const activityCategory = useSelector(selectActivityCategory)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const bivariateDataviews = useSelector(selectBivariateDataviews)
  const { start, end } = useTimerangeConnect()

  const ACTIVITY_OPTIONS: ChoiceOption[] = useMemo(
    () => [
      {
        id: 'fishing',
        title: t('common.fishing', 'Fishing'),
      },
      {
        id: 'presence',
        title: t('common.presence', 'Presence'),
      },
    ],
    [t]
  )

  useEffect(() => {
    setAddedDataviewId(undefined)
  }, [activityCategory])

  const onActivityOptionClick = useCallback(
    (activityOption: ChoiceOption) => {
      const queryParams: Record<string, any> = {
        activityCategory: activityOption.id as WorkspaceActivityCategory,
      }
      if (activityOption.id === 'presence' && start && end) {
        const intervalInDays = DateTime.fromISO(end).diff(DateTime.fromISO(start)).as('days')
        if (intervalInDays < 1) {
          // Force a minimum of 1 day range when in presence mode
          queryParams.start = start
          queryParams.end = DateTime.fromISO(start).toUTC().plus({ days: 1 }).toISO()
        }
      }
      dispatchQueryParams(queryParams)
    },
    [dispatchQueryParams, start, end]
  )

  const onAddFishingClick = useCallback(() => {
    dispatchQueryParams({ bivariateDataviews: undefined })
    const dataviewInstance = getFishingDataviewInstance()
    upsertDataviewInstance(dataviewInstance)
    setAddedDataviewId(dataviewInstance.id)
  }, [dispatchQueryParams, upsertDataviewInstance])

  const onAddPresenceClick = useCallback(
    (presenceCategory: WorkspacePresenceCategory) => {
      dispatchQueryParams({ bivariateDataviews: undefined })
      const dataviewInstance =
        presenceCategory === 'presence' ? getPresenceDataviewInstance() : getViirsDataviewInstance()
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
      uaEvent({
        category: 'Activity data',
        action: 'Click on bivariate option',
        label: getEventLabel([
          'combine',
          dataview1.name ?? dataview1.id,
          getActivitySources(dataview1),
          ...getActivityFilters(dataview1.config?.filters),
          dataview2.name ?? dataview2.id,
          getActivitySources(dataview2),
          ...getActivityFilters(dataview2.config?.filters),
        ]),
      })
    },
    [dataviews, dispatchQueryParams, upsertDataviewInstance]
  )

  const onToggleLayer = useCallback(
    (dataview: UrlDataviewInstance) => () => {
      const isVisible = dataview?.config?.visible ?? false
      const action = isVisible ? 'disable' : 'enable'
      uaEvent({
        category: 'Activity data',
        action: `Toggle ${dataview.category} layer`,
        label: getEventLabel([
          action,
          getActivitySources(dataview),
          ...getActivityFilters(dataview.config?.filters),
        ]),
      })
    },
    []
  )
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const presenceOptions = useMemo(
    () => [
      {
        id: 'presence' as WorkspacePresenceCategory,
        label: t('common.presence', 'Fishing presence'),
      },
      { id: 'viirs' as WorkspacePresenceCategory, label: t('common.viirs', 'VIIRS') },
    ],
    [t]
  )

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
        {!readOnly && (
          <div className={cx('print-hidden', styles.sectionButtons)}>
            {activityCategory === 'presence' ? (
              <TooltipContainer
                visible={newLayerOpen}
                onClickOutside={() => {
                  setNewLayerOpen(false)
                }}
                component={
                  <TooltipListContainer>
                    {presenceOptions.map(({ id, label }) => (
                      <li key={id}>
                        <button onClick={() => onAddPresenceClick(id)}>{label}</button>
                      </li>
                    ))}
                  </TooltipListContainer>
                }
              >
                <div className={styles.lastBtn}>
                  <IconButton
                    icon="plus"
                    type="border"
                    size="medium"
                    tooltip={t('layer.add', 'Add layer')}
                    tooltipPlacement="top"
                    onClick={() => setNewLayerOpen(true)}
                  />
                </div>
              </TooltipContainer>
            ) : (
              <IconButton
                icon="plus"
                type="border"
                size="medium"
                tooltip={t('layer.add', 'Add layer')}
                tooltipPlacement="top"
                onClick={() => onAddFishingClick()}
              />
            )}
          </div>
        )}
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
              onToggle={onToggleLayer(dataview)}
            />
            {showBivariateIcon && (
              <div className={cx(activityStyles.bivariateToggleContainer, 'print-hidden')}>
                <IconButton
                  icon={bivariateDataviews ? 'split' : 'compare'}
                  type="border"
                  size="small"
                  className={activityStyles.bivariateToggle}
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

export default ActivitySection
