import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import { selectLocationDatasetId, selectLocationAreaId } from 'routes/routes.selectors'

export default function ReportPlaceholder() {
  const { t } = useTranslation()
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)
  return (
    <Fragment>
      <WorkspaceLoginError
        title={t('errors.privateReport', 'You need to login to see the vessels active in the area')}
        emailSubject={`Requesting access for ${datasetId}-${areaId} report`}
      />
    </Fragment>
  )
}
