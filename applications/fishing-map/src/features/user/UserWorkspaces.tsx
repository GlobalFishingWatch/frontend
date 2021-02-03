import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { WORKSPACE } from 'routes/routes'
import { WorkspaceCategories } from 'data/workspaces'
import { selectWorkspaceListStatus } from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'types'
import styles from './User.module.css'
import { selectUserWorkspaces } from './user.selectors'

function UserWorkspaces() {
  const { t } = useTranslation()
  const workspaces = useSelector(selectUserWorkspaces)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)

  const loading = workspacesStatus === AsyncReducerStatus.Loading

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t('workspace.title_plural', 'Workspaces')}</label>
        <Button disabled={loading} type="secondary" tooltip="Coming soon">
          {t('workspace.new', 'New Workspace') as string}
        </Button>
      </div>
      {loading ? (
        <div className={styles.placeholder}>
          <Spinner size="small" />
        </div>
      ) : (
        <ul>
          {workspaces && workspaces?.length > 0 ? (
            workspaces.map((workspace) => {
              return (
                <li className={styles.workspace} key={workspace.id}>
                  <Link
                    className={styles.workspaceLink}
                    to={{
                      type: WORKSPACE,
                      payload: {
                        category: workspace.category || WorkspaceCategories.FishingActivity,
                        workspaceId: workspace.id,
                      },
                      query: {},
                    }}
                  >
                    <span className={styles.workspaceTitle}>{workspace.name}</span>
                    <IconButton icon="arrow-right" />
                  </Link>
                </li>
              )
            })
          ) : (
            <div className={styles.placeholder}>
              {t('workspace.emptyState', 'Your workspaces will appear here')}
            </div>
          )}
        </ul>
      )}
    </div>
  )
}

export default UserWorkspaces
