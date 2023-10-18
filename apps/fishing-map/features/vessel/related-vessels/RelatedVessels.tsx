import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { VesselRelatedSubsection } from 'types'
import { selectVesselRelatedSubsection } from 'features/vessel/vessel.config.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import RelatedEncounterVessels from 'features/vessel/related-vessels/RelatedEncounterVessels'
import RelatedOwnersVessels from 'features/vessel/related-vessels/RelatedOwnersVessels'
import { VesselActivitySummary } from 'features/vessel/activity/VesselActivitySummary'
import styles from './RelatedVessels.module.css'

const RelatedVessels = () => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselRelatedSubsection = useSelector(selectVesselRelatedSubsection)

  const relatedOptions: ChoiceOption<VesselRelatedSubsection>[] = useMemo(
    () => [
      {
        id: 'encounters',
        label: t('event.encounter_other', 'Encounter events'),
      },
      {
        id: 'owners',
        label: t('vessel.owners', 'Owners'),
      },
    ],
    [t]
  )

  const changeVesselRelatedSubsection = useCallback(
    (option: ChoiceOption<VesselRelatedSubsection>) => {
      dispatchQueryParams({ vesselRelated: option.id })
    },
    [dispatchQueryParams]
  )

  return (
    <div className={styles.container}>
      <h2 className="print-only">{t('vessel.sectionRelatedVessel', 'Related vessels')}</h2>
      <div className="print-hidden">
        <VesselActivitySummary />
      </div>
      <Choice
        options={relatedOptions}
        size="small"
        activeOption={vesselRelatedSubsection}
        className={styles.choice}
        onSelect={changeVesselRelatedSubsection}
      />
      {vesselRelatedSubsection === 'encounters' && <RelatedEncounterVessels />}
      {vesselRelatedSubsection === 'owners' && <RelatedOwnersVessels />}
    </div>
  )
}

export default RelatedVessels
