import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.slice'

interface ActivityDescriptionProps {
  event: RenderedEvent
}

const ActivityDescription: React.FC<ActivityDescriptionProps> = (props): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()

  return (
    <Fragment>
      {`${capitalize(event.description)} ${t('common.in', 'in')} ${event.regionDescription}`}
    </Fragment>
  )
}

export default ActivityDescription
