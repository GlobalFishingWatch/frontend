import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { GEAR_TYPES, VESSEL_TYPES } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { Button, InputText, Modal, Select, Tag } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME, ROOT_DOM_ELEMENT } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import GFWOnly from 'features/user/GFWOnly'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { useVesselIdentityChoice } from 'features/vessel/identity/vessel-identity.hooks'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { formatTransmissionDate, getCurrentIdentityVessel } from 'features/vessel/vessel.utils'
import { formatInfoField, getVesselGearTypeLabel, getVesselShipTypeLabel } from 'utils/info'

import VesselIdentityField from '../identity/VesselIdentityField'

import styles from './InfoCorrectionModal.module.css'

type RelevantDataFields = {
  flag: string
  shipname: string
  geartypes: string
  shiptypes: string
  ssvid: string
  imo: string
  callsign: string
  comments?: string
}

type InfoCorrectionSendFormat = {
  reviewer?: {
    userId?: number | typeof GUEST_USER_TYPE
    name?: string
    email?: string
  }
  source?: string
  workspaceLink?: string
  dateSubmitted?: string
  transmissionDate?: string
  vesselId?: string

  originalValues: RelevantDataFields
  proposedCorrections?: Partial<RelevantDataFields>
}

type InfoCorrectionModalProps = {
  isOpen?: boolean
  onClose: () => void
}

const VALID_REGISTRY_FIELDS = [
  'ssvid',
  'shipname',
  'callsign',
  'imo',
  'flag',
  'shiptypes',
  'geartypes',

  // 'builtYear',
  // 'depthM',
  // 'lengthM',
  // 'tonnageGt',
  // 'registryOwners',
  // 'operator',
  // 'registryPublicAuthorizations',
]

function InfoCorrectionModal({ isOpen = false, onClose }: InfoCorrectionModalProps) {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const identitySources = useVesselIdentityChoice()

  const vesselIdentity = getCurrentIdentityVessel(vesselData, {
    identityId,
    identitySource,
  })

  const [loading, setLoading] = useState(false)
  const userData = useSelector(selectUserData)

  const [proposedValues, setProposedValues] = useState<Partial<RelevantDataFields>>()

  const sendCorrection = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      const now = getUTCDate().toISOString()

      const finalFeedbackData: InfoCorrectionSendFormat = {
        reviewer: userData
          ? {
              userId: userData.id,
              name: `${userData.firstName} ${userData.lastName}`,
              email: userData.email,
            }
          : undefined,
        source: vesselIdentity.sourceCode?.[0] || '',
        workspaceLink: window.location.href,
        dateSubmitted: now,
        transmissionDate: formatTransmissionDate(vesselIdentity),
        vesselId: vesselIdentity.id,
        originalValues: {
          flag: vesselIdentity.flag || '',
          shipname: vesselIdentity.shipname || vesselIdentity.nShipname || '',
          geartypes: (vesselIdentity.geartypes || [])[0] || '',
          shiptypes: (vesselIdentity.shiptypes || [])[0] || '',
          ssvid: vesselIdentity.ssvid || '',
          imo: vesselIdentity.imo || '',
          callsign: vesselIdentity.callsign || '',
        },
        proposedCorrections: proposedValues,
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
        <div>
          <label>{t('common.vessel', 'Vessel')}</label>
          <Tag>
            {formatInfoField(vesselIdentity.shipname || vesselIdentity.nShipname, 'shipname')}{' '}
          </Tag>
          <Tag>{formatTransmissionDate(vesselIdentity, true)}</Tag>
        </div>
        <div>
          <label>{t('layer.source', 'Source')}</label>
          <div className={styles.columns}>
            <div>
              <div className={styles.tabTitle}>
                <VesselIdentityField
                  tooltip={vesselIdentity?.sourceCode?.filter(Boolean)?.join(', ')}
                  className={styles.help}
                  value={`${vesselIdentity?.sourceCode?.slice(0, 3).join(', ')}${
                    vesselIdentity?.sourceCode?.length > 3 ? '...' : ''
                  }`}
                />
              </div>
              {VALID_REGISTRY_FIELDS.map((key) => (
                <div key={key} className={styles.info}>
                  {vesselIdentity[key as keyof typeof vesselIdentity] as string}
                </div>
              ))}
            </div>

            <div className={styles.info}>
              <span>Feedback</span>
              {VALID_REGISTRY_FIELDS.map((key) =>
                key === 'geartypes' ? (
                  <>
                    <label key={key}>{t(`vessel.${key}` as any, key)}</label>
                    <Select
                      placeholder={t('selects.placeholder', 'Select an option')}
                      options={gearSelectOptions}
                      selectedOption={gearSelectOptions.find(
                        (option) => option.label === proposedValues?.[key]
                      )}
                      onSelect={(option) =>
                        setProposedValues({
                          ...proposedValues,
                          geartypes: option.label as string,
                        })
                      }
                    />
                  </>
                ) : key === 'shiptypes' ? (
                  <>
                    <label key={key}>{t(`vessel.${key}` as any, key)}</label>
                    <Select
                      placeholder={t('selects.placeholder', 'Select an option')}
                      options={shipSelectOptions}
                      selectedOption={shipSelectOptions.find(
                        (option) => option.label === proposedValues?.[key]
                      )}
                      onSelect={(option) =>
                        setProposedValues({
                          ...proposedValues,
                          shiptypes: option.label as string,
                        })
                      }
                    />
                  </>
                ) : (
                  <InputText
                    label={t(`vessel.${key}` as any, key)}
                    key={key}
                    inputSize="small"
                    className={styles.input}
                    onChange={(e) =>
                      setProposedValues({
                        ...proposedValues,
                        [key]: e.target.value,
                      })
                    }
                    disabled={loading}
                  />
                )
              )}
            </div>
          </div>
        </div>
        {/* <label>{t('vessel.infoCorrection.field', 'Field')}</label>
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
          /> */}

        <div>
          <label>{t('vessel.infoCorrection.analystComments', 'Analyst comments (optional)')}</label>
          <InputText
            placeholder={t(
              'vessel.infoCorrection.commentPlaceholder',
              'Please describe the source of the correction.'
            )}
            value={proposedValues?.comments || ''}
            className={styles.input}
            onChange={(e) =>
              setProposedValues({
                ...proposedValues,
                comments: e.target.value,
              })
            }
            disabled={loading}
          />
        </div>

        <div className={styles.footer}>
          <Button
            tooltip={
              proposedValues === undefined
                ? t('vessel.infoCorrection.insuficientData', 'Please fill in at least one field')
                : ''
            }
            disabled={loading || proposedValues === undefined}
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
