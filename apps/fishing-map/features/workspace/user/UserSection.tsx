import { Fragment, useCallback } from 'react'
import cx from 'classnames'
import { SortableContext } from '@dnd-kit/sortable'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DatasetCategory, DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { selectCustomUserDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { getEventLabel } from 'utils/analytics'
import { selectReadOnly } from 'features/app/app.selectors'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import { selectUserDatasetsByCategory } from 'features/user/user.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { isGuestUser } from 'features/user/user.slice'
import LocalStorageLoginLink from 'routes/LoginLink'
import { useAddDataset } from 'features/datasets/datasets.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import LayerPanel from './UserLayerPanel'

function UserSection(): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchSetMapDrawing } = useMapDrawConnect()
  const guestUser = useSelector(isGuestUser)
  const dispatch = useAppDispatch()

  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectCustomUserDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  const onAddNewClick = useAddDataset({})

  const onDrawClick = useCallback(() => {
    dispatchSetMapDrawing(true)
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Draw a custom reference layer - Start`,
    })
  }, [dispatchSetMapDrawing])

  const userDatasets = useSelector(selectUserDatasetsByCategory(DatasetCategory.Context))

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
      <div className={styles.header}>
        <h2 className={cx('print-hidden', styles.sectionTitle)}>
          {t('user.datasets', 'User datasets')}
        </h2>
        {!readOnly && (
          <Fragment>
            <IconButton
              icon="upload"
              type="border"
              size="medium"
              tooltip={t('dataset.upload', 'Upload dataset')}
              tooltipPlacement="top"
              className="print-hidden"
              onClick={onUploadClick}
            />
            <LoginButtonWrapper
              tooltip={t(
                'layer.drawPolygonLogin',
                'Register and login to draw a layer (free, 2 minutes)'
              )}
            >
              <IconButton
                icon="draw"
                type="border"
                size="medium"
                tooltip={t('layer.drawPolygon', 'Draw a layer')}
                tooltipPlacement="top"
                className="print-hidden"
                onClick={onDrawClick}
              />
            </LoginButtonWrapper>
            <IconButton
              icon="plus"
              type="border"
              size="medium"
              tooltip={t('dataset.addContext', 'Add context dataset')}
              tooltipPlacement="top"
              className="print-hidden"
              onClick={onAddClick}
            />
          </Fragment>
        )}
      </div>
      {guestUser ? (
        <div className={styles.emptyState}>
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
        </div>
      ) : (
        <SortableContext items={dataviews}>
          {dataviews?.length ? (
            dataviews?.map((dataview) => (
              <LayerPanelContainer key={dataview.id} dataview={dataview}>
                <LayerPanel dataview={dataview} onToggle={onToggleLayer(dataview)} />
              </LayerPanelContainer>
            ))
          ) : (
            <div className={styles.emptyState}>
              {t(
                'workspace.emptyStateEnvironment',
                'Upload custom datasets like animal telemetry clicking on the plus icon.'
              )}
            </div>
          )}
        </SortableContext>
      )}
    </div>
  )
}

export default UserSection
