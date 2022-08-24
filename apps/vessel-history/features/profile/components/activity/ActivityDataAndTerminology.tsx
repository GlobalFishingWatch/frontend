import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import TerminologyEncounterEvents from 'features/terminology/terminology-encounter-events'
import TerminologyFishingEvents from 'features/terminology/terminology-fishing-events'
import TerminologyLoiteringEvents from 'features/terminology/terminology-loitering-events'
import TerminologyPortVisitEvents from 'features/terminology/terminology-port-visit-events'
import TerminologyAisDisabling from 'features/terminology/terminology-ais-disabling'
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
      <TerminologyPortVisitEvents />
      <label>{t('events.gapEvents', 'Gap Events')}</label>
      <TerminologyAisDisabling />
      <GuideAndVideo source="Data and terminology" />
    </Fragment>
  )
}

export default ActivityDataAndTerminology
