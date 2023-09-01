import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { VesselRelatedSubsection } from 'types'
import { selectVesselRelatedSubsection } from 'features/vessel/vessel.config.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import RelatedEncounterVessels from 'features/vessel/related-vessels/RelatedEncounterVessels'
import RelatedOwnerVessels from 'features/vessel/related-vessels/RelatedOwnerVessels'
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
        id: 'owner',
        label: t('vessel.owner', 'Owner'),
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
      <div className={styles.titleContainer}>
        <label className={styles.title}>{t('vessel.relatedVessels', 'Related vessels')}</label>
        <Choice
          options={relatedOptions}
          size="small"
          activeOption={vesselRelatedSubsection}
          onSelect={changeVesselRelatedSubsection}
        />
      </div>
      {vesselRelatedSubsection === 'encounters' && <RelatedEncounterVessels />}
      {vesselRelatedSubsection === 'owner' && <RelatedOwnerVessels owner="pepe" />}
    </div>
  )
}

export default RelatedVessels
