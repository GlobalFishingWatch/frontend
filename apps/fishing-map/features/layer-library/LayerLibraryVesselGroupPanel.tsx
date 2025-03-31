import { Fragment, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Icon, IconButton, Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import {
  selectActiveVesselGroupDataviews,
  selectVesselGroupDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { getVesselGroupDataviewInstance } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import VesselGroupReportLink from 'features/reports/report-vessel-group/VesselGroupReportLink'
import { selectAllVisibleVesselGroups } from 'features/vessel-groups/vessel-groups.selectors'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import { getVesselGroupVesselsCount } from 'features/vessel-groups/vessel-groups.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatInfoField } from 'utils/info'

import styles from './LayerLibraryUserPanel.module.css'

const LayerLibraryVesselGroupPanel = ({ searchQuery }: { searchQuery: string }) => {
  const { t } = useTranslation()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const dispatch = useAppDispatch()

  const dataviews = useSelector(selectAllVisibleVesselGroups)

  const activeDataviews = useSelector(selectActiveVesselGroupDataviews)
  console.log('activeDataviews', activeDataviews)
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)

  const filteredDataview = useMemo(
    () =>
      dataviews.filter((dataview) => {
        return getDatasetLabel(dataview).toLowerCase().includes(searchQuery.toLowerCase())
      }),
    [dataviews, searchQuery]
  )

  const toggleAddToWorkspace = useCallback(
    (vesselGroupId: string, action: 'remove' | 'add') => {
      const dataviewInstance = getVesselGroupDataviewInstance(vesselGroupId)
      if (dataviewInstance && action === 'add') {
        upsertDataviewInstance(dataviewInstance)
      } else if (dataviewInstance && action === 'remove') {
        deleteDataviewInstance(dataviewInstance.id)
      }
      dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
    },
    [dispatch, deleteDataviewInstance, upsertDataviewInstance]
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
      <ul className={styles.userDatasetList}>
        {filteredDataview.length > 0 ? (
          filteredDataview?.map((vesselGroup) => {
            return (
              <li className={styles.dataset} key={vesselGroup?.id}>
                <span className={styles.datasetLabel}>
                  <Icon icon="vessel-group" />
                  {formatInfoField(vesselGroup?.name, 'shipname')} (
                  {vesselGroup?.vessels?.length && getVesselGroupVesselsCount(vesselGroup)})
                </span>

                <div>
                  <VesselGroupReportLink vesselGroupId={vesselGroup?.id ?? ''}>
                    <IconButton
                      tooltip={t(
                        'vesselGroupReport.clickToSee',
                        'Click to see the vessel group report'
                      )}
                      icon="analysis"
                    />
                  </VesselGroupReportLink>
                  <IconButton
                    tooltip={t('workspace.addLayer', 'Add to workspace')}
                    icon="plus"
                    onClick={() => toggleAddToWorkspace(vesselGroup.id, 'add')}
                    disabled={!!activeDataviews.find((d) => d.vesselGroup?.id === vesselGroup.id)}
                  />
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
