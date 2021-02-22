import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectUserData } from 'features/user/user.slice'
import { UrlDataviewInstance } from 'types'
import ReportLayerPanel from './ReportLayerPanel'
import { DateRange } from './report.slice'

type FishingActivityProps = {
  className?: string
  dataviews: UrlDataviewInstance[]
  staticTime: DateRange | null
}

function FishingActivity({
  dataviews,
  staticTime,
  className = '',
}: FishingActivityProps): React.ReactElement {
  const { t } = useTranslation()
  const userData = useSelector(selectUserData)
  const isAvailable = dataviews.length > 0

  const reportDescription = t(
    'report.fishingActivityByEEZDescription',
    'A fishing activity report for the selected date ranges and filters will be generated and sent to your email account'
  )

  return (
    <Fragment>
      <div>
        <h1>{t('report.fishingActivityByEEZ', 'Fishing Activity by EEZ')}</h1>
      </div>
      <div>
        {isAvailable &&
          dataviews?.map((dataview, index) => (
            <ReportLayerPanel key={dataview.id} dataview={dataview} index={index} />
          ))}
      </div>
      <p>
        {reportDescription}: {userData?.email}
      </p>
    </Fragment>
  )
}
export default FishingActivity
