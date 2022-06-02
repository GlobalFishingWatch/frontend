import React, { Fragment } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import TerminologyEncounterEvents from 'features/terminology/terminology-encounter-events'
import TerminologyFishingEvents from 'features/terminology/terminology-fishing-events'
import TerminologyLoiteringEvents from 'features/terminology/terminology-loitering-events'
import GuideAndVideo from '../GuideAndVideo'
import Faq from '../Faq'

const ActivityDataAndTerminology = (): React.ReactElement => {
  const { t } = useTranslation()

  return (
    <Fragment>
      <Faq source="Data and terminology" />
      <p>
        {t(
          'events.activityEventsDescription',
          'All activity data is estimated through algorithms by Global Fishing Watch (GFW). Data caveats can be found in the FAQ here'
        )}
      </p>
      <label>{t('events.fishingEvents', 'Fishing Events')}</label>
      <TerminologyFishingEvents></TerminologyFishingEvents>
      <label>{t('events.encounterEvents', 'Encounter Events')}</label>
      <TerminologyEncounterEvents></TerminologyEncounterEvents>
      <label>{t('events.loiteringEvents', 'Loitering Events')}</label>
      <TerminologyLoiteringEvents></TerminologyLoiteringEvents>
      <label>{t('events.portVisitEvents', 'Port Visits')}</label>
      <p>
        <Trans i18nKey="events.portVisitEventsDescription">
          A port visit occurs when a vessel has a port Entry, Stop or Gap, and Exit event. This
          means the vessel is within 3 km of an anchorage (Port Entry), and is moving between 0.5
          and 0.2 knots (Port Stop), or within an anchorage but has aa gap in AIS transmission for
          at least 4 hours (Port Gap), and then the vesselt transits more than 4 km outside of the
          anchorage point (Port Exit). Ports are based upon the Global Fishing Watch anchorages
          dataset, a global database of anchorage locations where vessels congregate.
        </Trans>
      </p>
      <GuideAndVideo source="Data and terminology" />
    </Fragment>
  )
}

export default ActivityDataAndTerminology
