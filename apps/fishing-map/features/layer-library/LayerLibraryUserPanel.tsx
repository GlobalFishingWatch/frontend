import { Trans, useTranslation } from 'react-i18next'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Icon, IconButton, Modal } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetStatus, DataviewCategory } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import { getDatasetLabel, getDatasetTypeIcon } from 'features/datasets/datasets.utils'
import { sortByCreationDate } from 'utils/dates'
import InfoError from 'features/workspace/common/InfoError'
import { ROOT_DOM_ELEMENT } from 'data/config'
import DatasetLabel from 'features/datasets/DatasetLabel'
import InfoModalContent from 'features/workspace/common/InfoModalContent'
import LocalStorageLoginLink from 'routes/LoginLink'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getDataviewInstanceByDataset, useAddDataset } from 'features/datasets/datasets.hook'
import { setModalOpen } from 'features/modals/modals.slice'
import { fetchAllDatasetsThunk } from 'features/datasets/datasets.slice'
import { getHighlightedText } from 'features/layer-library/layer-library.utils'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { selectUserDatasets } from 'features/user/selectors/user.permissions.selectors'
import styles from './LayerLibraryUserPanel.module.css'

const LayerLibraryUserPanel = ({ searchQuery }: { searchQuery: string }) => {
  const [infoDataset, setInfoDataset] = useState<Dataset | undefined>()
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const dispatch = useAppDispatch()
  const { dispatchSetMapDrawing } = useMapDrawConnect()
  const datasets = useSelector(selectUserDatasets)
  const guestUser = useSelector(selectIsGuestUser)
  const onAddNewClick = useAddDataset({})

  const filteredDatasets = useMemo(
    () =>
      datasets.filter((dataset) => {
        return getDatasetLabel(dataset).toLowerCase().includes(searchQuery.toLowerCase())
      }),
    [datasets, searchQuery]
  )

  useEffect(() => {
    if (!guestUser) {
      dispatch(fetchAllDatasetsThunk())
    }
  }, [dispatch, guestUser])

  const onAddToWorkspaceClick = useCallback(
    (dataset: Dataset) => {
      const dataviewInstanceWithDataset = getDataviewInstanceByDataset(dataset)
      if (!dataviewInstanceWithDataset) {
        return
      }
      upsertDataviewInstance({
        ...dataviewInstanceWithDataset,
        id: `${dataviewInstanceWithDataset.id}-${Date.now()}`,
      })
      dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
    },
    [dispatch, upsertDataviewInstance]
  )

  const onInfoClick = useCallback((dataset: Dataset) => {
    setInfoDataset(dataset)
  }, [])

  const onUploadClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Open panel to upload new reference layer`,
      value: datasets.length,
    })
    onAddNewClick()
    dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
  }, [datasets.length, onAddNewClick, dispatch])

  const onDrawClick = useCallback(() => {
    dispatchSetMapDrawing(true)
    dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Draw a custom reference layer - Start`,
    })
  }, [dispatch, dispatchSetMapDrawing])

  return (
    <Fragment>
      <div className={styles.titleContainer}>
        <label id={DataviewCategory.User} className={styles.categoryLabel}>
          {t(`common.user`, 'User')}
        </label>
        <LoginButtonWrapper
          tooltip={t(
            'dataset.uploadLogin',
            'Register and login to upload datasets (free, 2 minutes)'
          )}
        >
          <IconButton
            icon="upload"
            type="border"
            size="medium"
            tooltip={t('dataset.upload', 'Upload dataset')}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={onUploadClick}
          />
        </LoginButtonWrapper>
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
        <Fragment>
          <ul>
            {filteredDatasets && filteredDatasets.length > 0 ? (
              sortByCreationDate<Dataset>(filteredDatasets).map((dataset) => {
                const datasetError = dataset.status === DatasetStatus.Error
                const datasetImporting = dataset.status === DatasetStatus.Importing
                const datasetDescription = dataset.description !== dataset.name
                let infoTooltip = t(`layer.seeDescription`, 'Click to see layer description')
                if (datasetImporting) {
                  infoTooltip = t('dataset.importing', 'Dataset is being imported')
                }
                if (datasetError) {
                  infoTooltip = `${t(
                    'errors.uploadError',
                    'There was an error uploading your dataset'
                  )} - ${dataset.importLogs}`
                }
                const datasetIcon = getDatasetTypeIcon(dataset)
                return (
                  <li className={styles.dataset} key={dataset.id}>
                    <span>
                      {datasetIcon && (
                        <Icon icon={datasetIcon} style={{ transform: 'translateY(25%)' }} />
                      )}
                      {getHighlightedText(getDatasetLabel(dataset), searchQuery, styles)}
                    </span>
                    <div>
                      {(datasetError || datasetDescription) && (
                        <InfoError
                          error={datasetError}
                          loading={datasetImporting}
                          tooltip={infoTooltip}
                          size="default"
                          onClick={() => !datasetError && onInfoClick(dataset)}
                        />
                      )}
                      {!datasetError && (
                        <IconButton
                          icon="view-on-map"
                          onClick={() => onAddToWorkspaceClick(dataset)}
                          tooltip={t('user.seeDataset', 'See on map')}
                        />
                      )}
                    </div>
                  </li>
                )
              })
            ) : (
              <div className={styles.placeholder}>
                {t('dataset.emptyState', 'Your datasets will appear here')}
              </div>
            )}
          </ul>
          <Modal
            appSelector={ROOT_DOM_ELEMENT}
            title={<DatasetLabel dataset={infoDataset} />}
            isOpen={infoDataset !== undefined}
            onClose={() => setInfoDataset(undefined)}
          >
            {infoDataset && <InfoModalContent dataset={infoDataset} />}
          </Modal>
        </Fragment>
      )}
    </Fragment>
  )
}

export default LayerLibraryUserPanel
