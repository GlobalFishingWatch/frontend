import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { GEAR_TYPES, VESSEL_TYPES, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import {
  Button,
  Choice,
  InputDate,
  InputText,
  Modal,
  Select,
  Tag,
} from '@globalfishingwatch/ui-components'

import { PATH_BASENAME, ROOT_DOM_ELEMENT } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import type { VesselLastIdentity } from 'features/search/search.slice'
import GFWOnly from 'features/user/GFWOnly'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { useVesselIdentityChoice } from 'features/vessel/identity/vessel-identity.hooks'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { getCurrentIdentityVessel } from 'features/vessel/vessel.utils'
import { useLocationConnect } from 'routes/routes.hook'
import { formatInfoField, getVesselGearTypeLabel, getVesselShipTypeLabel } from 'utils/info'

import VesselRegistryField from '../identity/VesselRegistryField'

import styles from './InfoCorrectionModal.module.css'

type InfoCorrectionSendFormat = {
  date: string
  userId?: number | typeof GUEST_USER_TYPE
  name?: string
  email?: string
  vesselId: string
  source: string
  sourceCode: string
  transmissionDate: string
  field: string | null
  originalValue: string
  proposedValue: string
  description: string
  url: string
}

type InfoCorrectionModalProps = {
  isOpen?: boolean
  onClose: () => void
}

const VALID_REGISTRY_FIELDS = [
  'shipname',
  'flag',
  'ssvid',
  'imo',
  'callsign',
  'geartypes',
  'shiptypes',
  'builtYear',
  'depthM',
  'lengthM',
  'tonnageGt',
  'registryOwners',
  'operator',
  'registryPublicAuthorizations',
  'other',
]

const VALID_AIS_FIELDS = ['geartypes', 'shiptypes']

function formatTransmissionDate(vesselIdentity: VesselLastIdentity, format: boolean = false) {
  if (!vesselIdentity) return ''
  if (format) {
    return `${formatI18nDate(vesselIdentity.transmissionDateFrom)} - ${formatI18nDate(vesselIdentity.transmissionDateTo)}`
  }
  return `${vesselIdentity.transmissionDateFrom} - ${vesselIdentity.transmissionDateTo}`
}

function InfoCorrectionModal({ isOpen = false, onClose }: InfoCorrectionModalProps) {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const [loading, setLoading] = useState(false)
  const [suficientData, setSuficientData] = useState(false)
  const userData = useSelector(selectUserData)
  const identitySources = useVesselIdentityChoice()

  const vesselIdentity = getCurrentIdentityVessel(vesselData, {
    identityId,
    identitySource,
  })

  const [correctedVesselData, setCorrectedVesselData] = useState<InfoCorrectionSendFormat>({
    date: getUTCDate().toISOString(),
    ...(userData && {
      userId: userData.id,
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
    }),
    vesselId: vesselIdentity.id,
    source: vesselIdentity.identitySource,
    sourceCode: (vesselIdentity.sourceCode || []).join(', ') || '',
    transmissionDate: formatTransmissionDate(vesselIdentity),
    field: null,
    originalValue: '',
    proposedValue: '',
    description: '',
    url: window.location.href,
  })

  useEffect(() => {
    const { proposedValue } = correctedVesselData
    const hasSuficientData = proposedValue !== undefined && proposedValue !== ''
    setSuficientData(hasSuficientData)
  }, [correctedVesselData])

  const { dispatchQueryParams } = useLocationConnect()

  const onSourceClick = useCallback(
    (choice: ChoiceOption<VesselIdentitySourceEnum>) => {
      dispatchQueryParams({ vesselIdentitySource: choice.id })
    },
    [dispatchQueryParams]
  )

  useEffect(() => {
    if (vesselIdentity?.id !== correctedVesselData.vesselId) {
      setCorrectedVesselData((currentVesselData) => ({
        ...currentVesselData,
        vesselId: vesselIdentity.id,
        transmissionDate: formatTransmissionDate(vesselIdentity),
        source: identitySource,
        sourceCode: vesselIdentity.identitySource,
        field: null,
        originalValue: '',
        proposedValue: '',
        description: '',
      }))
    }
  }, [correctedVesselData.vesselId, vesselIdentity])

  const sendCorrection = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      const finalFeedbackData = {
        ...correctedVesselData,
        userId: correctedVesselData.userId,
        originalValue: Array.isArray(correctedVesselData.originalValue)
          ? correctedVesselData.originalValue.join(', ')
          : correctedVesselData.originalValue,
      }

      const response = await fetch(`${PATH_BASENAME}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'corrections', data: finalFeedbackData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }
      setLoading(false)
      onClose()

      trackEvent({
        category: TrackCategory.VesselProfile,
        action: 'send_vessel_info_correction',
      })
    } catch (e: any) {
      setLoading(false)
      console.error('Error: ', e)
    }
  }

  const identityFields = useMemo(() => {
    return identitySource === VesselIdentitySourceEnum.Registry
      ? VALID_REGISTRY_FIELDS.map((key) => ({
          label: t(`vessel.${key}` as any, key),
          id: key,
        }))
      : identitySource === VesselIdentitySourceEnum.SelfReported
        ? VALID_AIS_FIELDS.map((key) => ({
            label: t(`vessel.ais-${key}` as any, key),
            id: key,
          }))
        : []
  }, [identitySource, t])

  const gearSelectOptions = GEAR_TYPES.map((key) => ({
    label: getVesselGearTypeLabel({ geartypes: key }) || key,
    id: key,
  }))

  const shipSelectOptions = VESSEL_TYPES.map((key) => ({
    label: getVesselShipTypeLabel({ shiptypes: key }) || key,
    id: key,
  }))

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={
        <Fragment>
          {t('vessel.infoCorrection.title', 'Vessel Info Correction')}
          <GFWOnly userGroup="any" />
        </Fragment>
      }
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <div className={styles.container}>
        <div className={styles.info}>
          <label>{t('common.vessel', 'Vessel')}</label>
          <Tag>
            {formatInfoField(vesselIdentity.shipname || vesselIdentity.nShipname, 'shipname')}{' '}
          </Tag>
          <Tag>{formatTransmissionDate(vesselIdentity, true)}</Tag>
        </div>
        <div>
          <label>{t('layer.source', 'Source')}</label>
          <Choice
            options={identitySources}
            size="small"
            activeOption={identitySource}
            onSelect={onSourceClick}
          />
        </div>
        <div>
          <label>{t('vessel.infoCorrection.field', 'Field')}</label>
          <Select
            placeholder={t('selects.placeholder', 'Select an option')}
            options={identityFields}
            selectedOption={identityFields.find(
              (option) => option.id === correctedVesselData.field
            )}
            onSelect={(option) => {
              setCorrectedVesselData({
                ...correctedVesselData,
                field: option.id,
                originalValue: vesselIdentity[option.id as keyof typeof vesselIdentity] as string,
              })
            }}
          />
        </div>

        <div>
          <label>{t('vessel.infoCorrection.currentValue', 'Current value')}</label>
          {identitySource === VesselIdentitySourceEnum.Registry &&
          (correctedVesselData.field === 'registryOwners' ||
            correctedVesselData.field === 'operator' ||
            correctedVesselData.field === 'registryPublicAuthorizations') ? (
            <VesselRegistryField
              key={'registryOwners'}
              registryField={{
                key: correctedVesselData.field,
              }}
              vesselIdentity={vesselIdentity}
              showLabel={false}
            />
          ) : correctedVesselData.field === null ? (
            <span className={styles.secondary}>
              {t(
                'vessel.infoCorrection.selectAField',
                'Please select a field to view its current value'
              )}
            </span>
          ) : (
            <VesselIdentityField
              value={
                formatInfoField(
                  correctedVesselData.originalValue,
                  correctedVesselData.field as any
                ) as string
              }
            />
          )}
        </div>
        <div>
          <label>{t('vessel.infoCorrection.proposedValue', 'Proposed value')}</label>
          {correctedVesselData.field === 'transmissionDateFrom' ||
          correctedVesselData.field === 'transmissionDateTo' ? (
            <InputDate
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
          ) : correctedVesselData.field === 'geartypes' ? (
            <Select
              placeholder={t('selects.placeholder', 'Select an option')}
              options={gearSelectOptions}
              selectedOption={gearSelectOptions.find(
                (option) => option.label === correctedVesselData.proposedValue
              )}
              onSelect={(option) =>
                setCorrectedVesselData({
                  ...correctedVesselData,
                  proposedValue: option.label as string,
                })
              }
            />
          ) : correctedVesselData.field === 'shiptypes' ? (
            <Select
              placeholder={t('selects.placeholder', 'Select an option')}
              options={shipSelectOptions}
              selectedOption={shipSelectOptions.find(
                (option) => option.label === correctedVesselData.proposedValue
              )}
              onSelect={(option) =>
                setCorrectedVesselData({
                  ...correctedVesselData,
                  proposedValue: option.label as string,
                })
              }
            />
          ) : (
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
          )}
        </div>

        <div>
          <label>{t('vessel.infoCorrection.description', 'Description (optional)')}</label>
          <InputText
            placeholder={t(
              'vessel.infoCorrection.descriptionPlaceholder',
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
                ? t('vessel.infoCorrection.insuficientData', 'Please fill in all mandatory fields')
                : ''
            }
            disabled={loading || !suficientData}
            onClick={sendCorrection}
            loading={loading}
            className={styles.cta}
          >
            {t('vessel.infoCorrection.send', 'Send correction')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default InfoCorrectionModal
