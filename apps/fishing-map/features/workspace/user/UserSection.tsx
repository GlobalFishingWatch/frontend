import { Fragment, useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { DrawFeatureType } from '@globalfishingwatch/deck-layers'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { useAddDataset } from 'features/datasets/datasets.hook'
import { selectCustomUserDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import Hint from 'features/help/Hint'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectUserContextDatasets } from 'features/user/selectors/user.permissions.selectors'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import LocalStorageLoginLink from 'routes/LoginLink'
import { getEventLabel } from 'utils/analytics'

import LayerPanelContainer from '../shared/LayerPanelContainer'

import LayerPanel from './UserLayerPanel'

import styles from 'features/workspace/shared/Sections.module.css'

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

function UserSection(): React.ReactElement<any> {
  const { t } = useTranslation()
  const { dispatchSetMapDrawing } = useMapDrawConnect()
  const guestUser = useSelector(selectIsGuestUser)
  const dispatch = useAppDispatch()
  const isSmallScreen = useSmallScreen()

  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectCustomUserDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

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
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={cx(styles.header, 'print-hidden')}>
        <h2 className={styles.sectionTitle}>{t('user.datasets', 'User datasets')}</h2>
        {!readOnly && (
          <Fragment>
            {!isSmallScreen && (
              <div className={styles.relative}>
                <Hint id="userContextLayers" />
                <UserLoggedIconButton
                  icon="upload"
                  type="border"
                  size="medium"
                  onClick={onUploadClick}
                  tooltip={t('dataset.upload', 'Upload dataset')}
                  tooltipPlacement="top"
                  loginTooltip={t(
                    'download.eventsDownloadLogin',
                    'Register and login to download vessel events (free, 2 minutes)'
                  )}
                />
              </div>
            )}
            <UserLoggedIconButton
              icon="draw"
              type="border"
              size="medium"
              tooltip={t('layer.drawPolygon', 'Draw a layer')}
              tooltipPlacement="top"
              onClick={() => onDrawClick('polygons')}
              loginTooltip={t(
                'download.eventsDownloadLogin',
                'Register and login to download vessel events (free, 2 minutes)'
              )}
            />
            <UserLoggedIconButton
              icon="draw-points"
              type="border"
              size="medium"
              tooltip={t('layer.drawPoints', 'Draw points')}
              tooltipPlacement="top"
              onClick={() => onDrawClick('points')}
              loginTooltip={t(
                'download.eventsDownloadLogin',
                'Register and login to download vessel events (free, 2 minutes)'
              )}
            />
            <IconButton
              icon="plus"
              type="border"
              size="medium"
              tooltip={t('dataset.addUser', 'Add an uploaded dataset')}
              tooltipPlacement="top"
              onClick={onAddClick}
            />
          </Fragment>
        )}
      </div>
      <Fragment>
        {dataviews?.length > 0 && (
          <SortableContext items={dataviews}>
            {dataviews?.map((dataview, index) => (
              <LayerPanelContainer key={dataview.id} dataview={dataview}>
                <LayerPanel dataview={dataview} onToggle={onToggleLayer(dataview)} />
              </LayerPanelContainer>
            ))}
          </SortableContext>
        )}
        {guestUser ? (
          <div className={styles.emptyStateBig}>
            <RegisterOrLoginToUpload />
          </div>
        ) : !dataviews.length ? (
          <div className={styles.emptyStateBig}>
            {t('workspace.emptyStateUser', 'Upload custom datasets clicking on the plus icon.')}
          </div>
        ) : null}
      </Fragment>
    </div>
  )
}

export default UserSection
