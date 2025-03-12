import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button, Choice, InputText, Modal, Select, Tag } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME, ROOT_DOM_ELEMENT } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectUserData } from 'features/user/selectors/user.selectors'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { getCurrentIdentityVessel } from 'features/vessel/vessel.utils'
import { useLocationConnect } from 'routes/routes.hook'
import { formatInfoField } from 'utils/info'

import VesselRegistryField from '../identity/VesselRegistryField'

import styles from './InfoCorrectionModal.module.css'

type InfoCorrectionModalProps = {
  isOpen?: boolean
  onClose: () => void
}

  type ValidField =
    | 'shipname'
    | 'flag'
    | 'shiptypes'
    | 'geartypes'
    | 'registryOwners'
    | 'vesselType'
    | 'fleet'


  const VALID_FIELDS = ['shipname', 'flag', 'shiptypes', 'geartypes', 'registryOwners', 'vesselType', 'fleet']


function InfoCorrectionModal({ isOpen = false, onClose }: InfoCorrectionModalProps) {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const [loading, setLoading] = useState(false)
  const [suficientData, setSuficientData] = useState(false)
  const userData = useSelector(selectUserData)


  const [correctedVesselData, setCorrectedVesselData] = useState<{
    userId: number | undefined
    field: ValidField
    originalValue: string
    proposedValue: string
    description: string
  }>({
    userId: userData?.id,
    field: 'shipname',
    originalValue: '',
    proposedValue: '',
    description: '',
  })

  useEffect(() => {
    const { proposedValue } = correctedVesselData
    const hasSuficientData = proposedValue !== undefined && proposedValue !== ''
    setSuficientData(hasSuficientData)
  }, [correctedVesselData])

  const { dispatchQueryParams } = useLocationConnect()

  const vesselIdentity = getCurrentIdentityVessel(vesselData, {
    identityId,
    identitySource,
  })

  console.log(vesselIdentity)

  const onSourceClick = (choice: ChoiceOption<any>) => {
    dispatchQueryParams({ vesselIdentitySource: choice.id })
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: 'click_info_correction_source',
      label: String(choice.label),
    })
  }

  const registryDisabled = !vesselData.identities.some(
    (i) => i.identitySource === VesselIdentitySourceEnum.Registry
  )
  const selfReportedIdentities = vesselData.identities.filter(
    (i) => i.identitySource === VesselIdentitySourceEnum.SelfReported
  )

  useEffect(() => {
    if (identitySource === VesselIdentitySourceEnum.Registry && registryDisabled) {
      dispatchQueryParams({
        vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
      })
    }
  }, [dispatchQueryParams, identitySource, registryDisabled])

  const identitySources: ChoiceOption<VesselIdentitySourceEnum>[] = useMemo(
    () => [
      {
        id: VesselIdentitySourceEnum.Registry,
        label: t('vessel.infoSources.registry', 'Registry'),
        disabled: registryDisabled,
      },
      {
        id: VesselIdentitySourceEnum.SelfReported,
        label: uniq(selfReportedIdentities.flatMap((i) => i.sourceCode || [])).join(',') || 'AIS',
        disabled: selfReportedIdentities.length === 0,
      },
    ],
    [registryDisabled, selfReportedIdentities, t]
  )

  const sendCorrection = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      const url = window.location.href

      const finalFeedbackData = {
        ...correctedVesselData,
        url,
        userId: correctedVesselData.userId,
      }

      const response = await fetch(`${PATH_BASENAME}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'feedback', data: finalFeedbackData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }
      setLoading(false)
      onClose()
    } catch (e: any) {
      setLoading(false)
      console.error('Error: ', e)
    }
  }

  const identityFields = useMemo(() => {
    return VALID_FIELDS.map((key) => ({
      label: t(`vessel.${key}` as any, key),
      id: key,
    }))
  }, [t, VALID_FIELDS])

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={<Fragment>{t('infoCorrection.title', 'Vessel Info Correction')}</Fragment>}
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <div className={styles.container}>
        <div className={styles.info}>
          <div>
            <label>{t('common.vessel', 'Vessel')}</label>
            <Tag>{vesselIdentity.shipname || vesselIdentity.nShipname}</Tag>
          </div>
        </div>
        <div>
          <label>{t('infoCorrection.source', 'Source')}</label>
          <Choice
            options={identitySources}
            size="small"
            activeOption={identitySource}
            onSelect={onSourceClick}
          />
        </div>
        <div>
          <label>{t('infoCorrection.field', 'Field')}</label>
          <Select
            placeholder={t('selects.placeholder', 'Select an option')}
            options={identityFields}
            selectedOption={identityFields.find(
              (option) => option.id === correctedVesselData.field
            )}
            onSelect={(option) =>
              setCorrectedVesselData({
                ...correctedVesselData,
                field: option.id as ValidField,
                originalValue: (vesselIdentity[option.id as keyof typeof vesselIdentity]) as string,
              })
            }
          />
        </div>

        <div>
          <label>{t('infoCorrection.format', 'Current value')}</label>

          {identitySource === VesselIdentitySourceEnum.Registry &&
          correctedVesselData.field === 'registryOwners' ? (
            <VesselRegistryField
              key={'registryOwners'}
              registryField={{
                key: 'registryOwners',
              }}
              vesselIdentity={vesselIdentity}
            />
          ) : (
            <VesselIdentityField
              value={ formatInfoField(
                  correctedVesselData.originalValue,
                  correctedVesselData.field as Exclude<ValidField, 'registryOwners'>
                ) as string
              }
            />
          )}
        </div>
        <div>
          <label>{t('infoCorrection.format', 'Proposed value')}</label>
          <InputText
            value={correctedVesselData.proposedValue}
            className={styles.input}
            onChange={(e) =>
              setCorrectedVesselData({
                ...correctedVesselData,
                proposedValue: e.target.value,
              })
            }
            disabled={loading}
          />
        </div>

        <div>
          <label>{t('infoCorrection.description', 'Description (optional)')}</label>
          <InputText
            placeholder={t(
              'infoCorrection.descriptionPlaceholder',
              'Please describe the source of the correction and the time range it is relevant for.'
            )}
            value={correctedVesselData.description}
            className={styles.input}
            onChange={(e) =>
              setCorrectedVesselData({
                ...correctedVesselData,
                description: e.target.value,
              })
            }
            disabled={loading}
          />
        </div>

        <div className={styles.footer}>
          <Button
            tooltip={
              !suficientData
                ? t('infoCorrection.insuficientData', 'Please fill in all mandatory fields')
                : ''
            }
            disabled={loading || !suficientData}
            onClick={sendCorrection}
            loading={loading}
            className={styles.cta}
          >
            {t('infoCorrection.send', 'Send correction')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default InfoCorrectionModal
