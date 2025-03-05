import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { VesselGroup } from '@globalfishingwatch/api-types'
import { Button, Icon, IconButton, InputText, Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectDatasetsStatus } from 'features/datasets/datasets.slice'
import { useEditVesselGroupModal } from 'features/reports/report-vessel-group/vessel-group-report.hooks'
import VesselGroupReportLink from 'features/reports/report-vessel-group/VesselGroupReportLink'
import { selectUserVesselGroups } from 'features/vessel-groups/vessel-groups.selectors'
import {
  deleteVesselGroupThunk,
  selectVesselGroupsStatus,
  selectVesselGroupsStatusId,
} from 'features/vessel-groups/vessel-groups.slice'
import {
  getVesselGroupLabel,
  getVesselGroupVesselsCount,
  isOutdatedVesselGroup,
} from 'features/vessel-groups/vessel-groups.utils'
import {
  selectVesselGroupEditId,
  setVesselGroupsModalOpen,
} from 'features/vessel-groups/vessel-groups-modal.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { sortByCreationDate } from 'utils/dates'
import { getHighlightedText } from 'utils/text'

import styles from './User.module.css'

function UserVesselGroups() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const vesselGroups = useSelector(selectUserVesselGroups)
  const vesselGroupStatus = useSelector(selectVesselGroupsStatus)
  const vesselGroupStatusId = useSelector(selectVesselGroupsStatusId)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const loading =
    datasetsStatus === AsyncReducerStatus.Loading ||
    vesselGroupStatus === AsyncReducerStatus.Loading
  const editingGroupId = useSelector(selectVesselGroupEditId)
  const onEditClick = useEditVesselGroupModal()
  const [searchQuery, setSearchQuery] = useState('')

  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const onNewGroupClick = useCallback(() => {
    dispatch(setVesselGroupsModalOpen(true))
  }, [dispatch])

  const onDeleteClick = useCallback(
    (vesselGroup: VesselGroup) => {
      const confirmation = window.confirm(
        `${t(
          'vesselGroup.confirmRemove',
          'Are you sure you want to permanently delete this vessel group?'
        )}\n${vesselGroup.name}`
      )
      if (confirmation) {
        dispatch(deleteVesselGroupThunk(vesselGroup.id.toString()))
      }
    },
    [dispatch, t]
  )

  return (
    <Fragment>
      <div className={styles.search}>
        <InputText
          type="search"
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search"
        />
      </div>
      <div className={styles.views}>
        <div className={styles.viewsHeader}>
          <label>{t('vesselGroup.vesselGroups', 'Vessel Groups')}</label>
          <Button disabled={loading} type="secondary" onClick={onNewGroupClick}>
            {t('vesselGroup.new', 'New vessel group') as string}
          </Button>
        </div>
        {loading ? (
          <div className={styles.placeholder}>
            <Spinner size="small" />
          </div>
        ) : (
          <ul>
            {vesselGroups && vesselGroups.length > 0 ? (
              sortByCreationDate<VesselGroup>(vesselGroups).map((vesselGroup) => {
                const label = getVesselGroupLabel(vesselGroup)
                if (!label.toLowerCase().includes(searchQuery.toLowerCase())) {
                  return null
                }
                const isOutdated = isOutdatedVesselGroup(vesselGroup)
                return (
                  <li className={styles.dataset} key={vesselGroup.id}>
                    {isOutdated ? (
                      <span>
                        {getHighlightedText(label as string, searchQuery, styles)}{' '}
                        <span className={styles.secondary}>
                          ({getVesselGroupVesselsCount(vesselGroup)})
                        </span>
                      </span>
                    ) : (
                      <VesselGroupReportLink vesselGroupId={vesselGroup.id}>
                        <span className={styles.workspaceLink} data-test="workspace-name">
                          {getHighlightedText(label as string, searchQuery, styles)}{' '}
                          <span className={cx(styles.secondary, styles.marginLeft)}>
                            ({getVesselGroupVesselsCount(vesselGroup)})
                          </span>
                          <IconButton icon="analysis" className={styles.right} />
                        </span>
                      </VesselGroupReportLink>
                    )}
                    <div>
                      {isOutdated ? (
                        <Button
                          type="border-secondary"
                          size="small"
                          tooltip={
                            isOutdated
                              ? t(
                                  'vesselGroup.clickToUpdateLong',
                                  'Click to update your vessel group to view the latest data and features'
                                )
                              : t('vesselGroup.edit', 'Edit list of vessels')
                          }
                          loading={
                            vesselGroup.id === editingGroupId &&
                            vesselGroupStatus === AsyncReducerStatus.LoadingUpdate
                          }
                          onClick={() => onEditClick(vesselGroup)}
                          className={styles.warningButton}
                        >
                          <Icon icon="warning" />
                          {t('vesselGroup.updateRequired', 'Update Required')}
                        </Button>
                      ) : (
                        <IconButton
                          icon="edit"
                          tooltip={t('vesselGroup.edit', 'Edit list of vessels')}
                          loading={
                            vesselGroup.id === editingGroupId &&
                            vesselGroupStatus === AsyncReducerStatus.LoadingUpdate
                          }
                          onClick={() => onEditClick(vesselGroup)}
                        />
                      )}
                      <IconButton
                        icon="delete"
                        type="warning"
                        loading={
                          vesselGroup.id === vesselGroupStatusId &&
                          vesselGroupStatus === AsyncReducerStatus.LoadingDelete
                        }
                        tooltip={t('vesselGroup.remove', 'Remove vessel group')}
                        onClick={() => onDeleteClick(vesselGroup)}
                      />
                    </div>
                  </li>
                )
              })
            ) : (
              <div className={styles.placeholder}>
                {t('vesselGroup.emptyState', 'Your vessel groups will appear here')}
              </div>
            )}
          </ul>
        )}
      </div>
    </Fragment>
  )
}

export default UserVesselGroups
