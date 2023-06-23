import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import TerminologyEncounterEvents from 'features/vessel/terminology/terminology-encounter-events'
import TerminologyFishingEvents from 'features/vessel/terminology/terminology-fishing-events'
import TerminologyLoiteringEvents from 'features/vessel/terminology/terminology-loitering-events'
import TerminologyPortVisitEvents from 'features/vessel/terminology/terminology-port-visit-events'
import TerminologyAisDisabling from 'features/vessel/terminology/terminology-ais-disabling'
//import GuideAndVideo from '../GuideAndVideo'
//import Faq from '../Faq'

const ActivityDataAndTerminology = (): React.ReactElement => {
  const { t } = useTranslation()

  return (
    <Fragment>
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
      <label>{t('events.gapEvents', 'Likely disabling events')}</label>
      <TerminologyAisDisabling />
    </Fragment>
  )
}

export default ActivityDataAndTerminology
