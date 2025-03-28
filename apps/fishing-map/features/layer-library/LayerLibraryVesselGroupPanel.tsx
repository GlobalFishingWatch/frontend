import { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Button, Icon, IconButton, Modal, Spinner } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectVesselGroupDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import VesselGroupReportLink from 'features/reports/report-vessel-group/VesselGroupReportLink'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import { getVesselGroupVesselsCount } from 'features/vessel-groups/vessel-groups.utils'
import InfoModalContent from 'features/workspace/shared/InfoModalContent'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatInfoField } from 'utils/info'

import styles from './LayerLibraryItem.module.css'

const LayerLibraryVesselGroupPanel = ({ searchQuery }: { searchQuery: string }) => {
  const [infoDataset, setInfoDataset] = useState<Dataset | undefined>()
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const dispatch = useAppDispatch()

  const dataviews = useSelector(selectVesselGroupDataviews)
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)

  const filteredDataview = useMemo(
    () =>
      dataviews.filter((dataview) => {
        return getDatasetLabel(dataview).toLowerCase().includes(searchQuery.toLowerCase())
      }),
    [dataviews, searchQuery]
  )

  const toggleAddToWorkspace = useCallback(
    (dataview: UrlDataviewInstance) => {
      upsertDataviewInstance({
        id: String(dataview.id),
        config: {
          visible: !dataview?.config?.visible,
        },
      })
      dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
    },
    [dispatch, upsertDataviewInstance]
  )

  const SectionComponent = () => {
    if (workspaceVesselGroupsStatus === AsyncReducerStatus.Loading) {
      return (
        <div className={cx(styles.emptyState, styles.center)}>
          <Spinner />
        </div>
      )
    }

    return (
      <Fragment>
        <ul className="pt-[var(--space-M)]">
          {filteredDataview.length > 0 ? (
            filteredDataview?.map((vesselGroup) => {
              return (
                <li className={`${styles.layer} `} key={vesselGroup.id}>
                  <div className={styles.container}>
                    <h2 className={styles.title}>
                      <Icon icon="vessel-group" />{' '}
                      {formatInfoField(vesselGroup?.vesselGroup?.name, 'shipname')}{' '}
                      {vesselGroup.vesselGroup?.vessels?.length &&
                        getVesselGroupVesselsCount(vesselGroup.vesselGroup)}
                    </h2>

                    <div className={styles.cta}>
                      <VesselGroupReportLink vesselGroupId={vesselGroup?.id}>
                        <IconButton
                          tooltip={t(
                            'vesselGroupReport.clickToSee',
                            'Click to see the vessel group report'
                          )}
                          icon="analysis"
                        />
                      </VesselGroupReportLink>
                      {!vesselGroup?.config?.visible ? (
                        <IconButton
                          tooltip={t('workspace.addLayer', 'Add to workspace')}
                          icon="plus"
                          onClick={() => toggleAddToWorkspace(vesselGroup)}
                          loading={workspaceVesselGroupsStatus !== AsyncReducerStatus.Finished}
                        />
                      ) : (
                        <IconButton
                          tooltip={t('workspace.remove', 'Remove workspace')}
                          icon="remove-from-map"
                          onClick={() => toggleAddToWorkspace(vesselGroup)}
                          loading={workspaceVesselGroupsStatus !== AsyncReducerStatus.Finished}
                        />
                      )}
                    </div>
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
    )
  }

  return (
    <Fragment>
      <div className={styles.titleContainer}>
        <label id={DataviewCategory.VesselGroups} className={styles.categoryLabel}>
          {t(`common.vesselGroups`, 'Vessel Groups')}
        </label>
      </div>
      <SectionComponent />
    </Fragment>
  )
}

export default LayerLibraryVesselGroupPanel
