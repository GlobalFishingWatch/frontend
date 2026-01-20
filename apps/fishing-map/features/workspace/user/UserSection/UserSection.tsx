import { Fragment, useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { getMergedDataviewId, type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { DrawFeatureType } from '@globalfishingwatch/deck-layers'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useAddDataset } from 'features/datasets/datasets.hook'
import { selectCustomUserDataviewsGrouped } from 'features/dataviews/selectors/dataviews.categories.selectors'
import Hint from 'features/help/Hint'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectUserContextDatasets } from 'features/user/selectors/user.permissions.selectors'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import LayerPanelContainer from 'features/workspace/shared/LayerPanelContainer'
import Section from 'features/workspace/shared/Section'
import LocalStorageLoginLink from 'routes/LoginLink'
import { getEventLabel } from 'utils/analytics'

import LayerPanel from '../UserLayerPanel'

import styles from 'features/workspace/shared/Section.module.css'

export function RegisterOrLoginToUpload() {
  return (
    <Trans i18nKey="dataset.uploadLogin">
      <a
        className={styles.link}
        href={GFWAPI.getRegisterUrl(
          typeof window !== 'undefined' ? window.location.toString() : ''
        )}
      >
        Register
      </a>
      or
      <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink>
      to upload datasets (free, 2 minutes)
    </Trans>
  )
}

export function UserSection(): React.ReactElement<any> {
  const { t } = useTranslation()
  const { dispatchSetMapDrawing } = useMapDrawConnect()
  const guestUser = useSelector(selectIsGuestUser)
  const dispatch = useAppDispatch()
  const isSmallScreen = useSmallScreen()

  const dataviewsGrouped = useSelector(selectCustomUserDataviewsGrouped)
  const allDataviews = Object.values(dataviewsGrouped)
  const dataviews = allDataviews.flat()
  const visibleDataviews = dataviews?.filter((dataview) => dataview.config?.visible === true)
  const hasVisibleDataviews = visibleDataviews.length >= 1

  const onAddNewClick = useAddDataset()

  const onDrawClick = useCallback(
    (drawFeatureType: DrawFeatureType) => {
      dispatchSetMapDrawing(drawFeatureType)
      trackEvent({
        category: TrackCategory.ReferenceLayer,
        action: `Draw a custom reference layer - Start`,
      })
    },
    [dispatchSetMapDrawing]
  )

  const userDatasets = useSelector(selectUserContextDatasets)

  const onUploadClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Open panel to upload new reference layer`,
      value: userDatasets.length,
    })
    onAddNewClick()
  }, [onAddNewClick, userDatasets.length])

  const onAddClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Open panel to add a reference layer`,
      value: userDatasets.length,
    })
    dispatch(setModalOpen({ id: 'layerLibrary', open: DataviewCategory.User }))
  }, [dispatch, userDatasets.length])

  const onToggleLayer = useCallback(
    (dataview: UrlDataviewInstance) => () => {
      const isVisible = dataview?.config?.visible ?? false
      const dataset = dataview.datasets?.find(
        (d) => d.type === DatasetTypes.Context || d.type === DatasetTypes.UserContext
      )
      const layerTitle = dataset?.name ?? dataset?.id ?? 'Unknown layer'
      const action = isVisible ? 'disable' : 'enable'
      trackEvent({
        category: TrackCategory.ReferenceLayer,
        action: `Toggle reference layer`,
        label: getEventLabel([action, layerTitle]),
      })
    },
    []
  )
  return (
    <Section
      id={DataviewCategory.User}
      data-testid="user-section"
      title={
        <span>
          {t('user.datasets')}
          {hasVisibleDataviews && (
            <span className={styles.layersCount}>{` (${visibleDataviews.length})`}</span>
          )}
        </span>
      }
      hasVisibleDataviews={hasVisibleDataviews}
      headerOptions={
        <Fragment>
          {!isSmallScreen && (
            <div className={styles.relative}>
              <Hint id="userContextLayers" />
              <UserLoggedIconButton
                icon="upload"
                type="border"
                size="medium"
                onClick={onUploadClick}
                tooltip={t('dataset.upload')}
                tooltipPlacement="top"
                loginTooltip={t('download.eventsDownloadLogin')}
              />
            </div>
          )}
          <UserLoggedIconButton
            icon="draw"
            type="border"
            size="medium"
            tooltip={t('layer.drawPolygon')}
            tooltipPlacement="top"
            onClick={() => onDrawClick('polygons')}
            loginTooltip={t('download.eventsDownloadLogin')}
          />
          <UserLoggedIconButton
            icon="draw-points"
            type="border"
            size="medium"
            tooltip={t('layer.drawPoints')}
            tooltipPlacement="top"
            onClick={() => onDrawClick('points')}
            loginTooltip={t('download.eventsDownloadLogin')}
          />
          <IconButton
            icon="plus"
            type="border"
            size="medium"
            tooltip={t('dataset.addUser')}
            tooltipPlacement="top"
            onClick={onAddClick}
          />
        </Fragment>
      }
    >
      <SortableContext items={allDataviews.flat()}>
        {allDataviews.map((dataviews) => {
          if (!dataviews?.length) return null
          const visibleDataviews = dataviews.filter(
            (dataview) => dataview.config?.visible !== false
          )
          return dataviews?.map((dataview) => (
            <LayerPanelContainer key={dataview.id} dataview={dataview}>
              <LayerPanel
                dataview={dataview}
                onToggle={onToggleLayer(dataview)}
                mergedDataviewId={
                  visibleDataviews?.length > 0 ? getMergedDataviewId(visibleDataviews) : undefined
                }
              />
            </LayerPanelContainer>
          ))
        })}
        {guestUser ? (
          <div className={cx(styles.emptyStateBig, 'print-hidden')}>
            <RegisterOrLoginToUpload />
          </div>
        ) : !dataviews.length ? (
          <div className={cx(styles.emptyStateBig, 'print-hidden')}>
            {t('workspace.emptyStateUser')}
          </div>
        ) : null}
      </SortableContext>
    </Section>
  )
}

export default UserSection
