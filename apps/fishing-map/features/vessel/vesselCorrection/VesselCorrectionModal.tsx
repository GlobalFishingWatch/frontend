import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { GEAR_TYPES, VESSEL_TYPES, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { Button, InputText, Modal, Select, Tag } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME, ROOT_DOM_ELEMENT } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import GFWOnly from 'features/user/GFWOnly'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { formatTransmissionDate, getCurrentIdentityVessel } from 'features/vessel/vessel.utils'
import { formatInfoField, getVesselGearTypeLabel, getVesselShipTypeLabel } from 'utils/info'

import type { InfoCorrectionSendFormat, RelevantDataFields } from './VesselCorrection.types'
import { VALID_AIS_FIELDS, VALID_REGISTRY_FIELDS } from './VesselCorrection.types'

import styles from './VesselCorrectionModal.module.css'

type InfoCorrectionModalProps = {
  isOpen?: boolean
  onClose: () => void
}

function VesselCorrectionModal({ isOpen = false, onClose }: InfoCorrectionModalProps) {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)

  const fields =
    identitySource === VesselIdentitySourceEnum.Registry ? VALID_REGISTRY_FIELDS : VALID_AIS_FIELDS

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
        reviewer: userData!.email || '',
        source: vesselIdentity.sourceCode?.[0] || '',
        workspaceLink: window.location.href,
        dateSubmitted: now,
        timeRange: formatTransmissionDate(vesselIdentity),
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

      const response = await fetch(`${PATH_BASENAME}/api/corrections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: finalFeedbackData }),
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
          {t('vessel.vesselCorrection.title', 'Vessel Info Correction')}
          <GFWOnly userGroup="any" />
        </Fragment>
      }
      isOpen={isOpen}
      onClose={onClose}
      size="auto"
      contentClassName={styles.modalContent}
    >
      <div className={styles.container}>
        <div className={styles.top}>
          <div>
            <label>{t('common.vessel', 'Vessel')}</label>
            <Tag>
              {formatInfoField(vesselIdentity.shipname || vesselIdentity.nShipname, 'shipname')}
            </Tag>
            <Tag>{formatTransmissionDate(vesselIdentity, true)}</Tag>
          </div>
          <div>
            <label>{t('layer.source', 'Source')}</label>
            <Tag>
              {identitySource === VesselIdentitySourceEnum.Registry
                ? t('vessel.infoSources.registry', 'Registry')
                : identitySource === VesselIdentitySourceEnum.SelfReported &&
                  t('vessel.infoSources.selfReported', 'Self Reported')}
            </Tag>
          </div>
          <div>
            <label>{t('common.vesselId', 'Vessel ID')}</label>
            <Tag>{vesselIdentity.id} </Tag>
          </div>
        </div>

        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <label>{t('common.field', 'Field')}</label>
                </th>
                <th>
                  <label>{t('common.value', 'Value')}</label>
                </th>
                <th>
                  <label>{t('common.feedback', 'Feedback')}</label>
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((key) => (
                <tr key={key}>
                  <td>
                    {t(
                      `vessel.${
                        identitySource === VesselIdentitySourceEnum.SelfReported &&
                        (key === 'geartypes' || key === 'shiptypes')
                          ? 'gfw_' + key
                          : key
                      }`,
                      key
                    )}
                  </td>
                  <td>
                    {key === 'geartypes'
                      ? getVesselGearTypeLabel({
                          geartypes: Array.isArray(vesselIdentity.geartypes)
                            ? vesselIdentity.geartypes[0]
                            : vesselIdentity.geartypes,
                        }) ||
                        (Array.isArray(vesselIdentity.geartypes)
                          ? vesselIdentity.geartypes[0]
                          : vesselIdentity.geartypes) ||
                        '----'
                      : key === 'shiptypes'
                        ? getVesselShipTypeLabel({
                            shiptypes: Array.isArray(vesselIdentity.shiptypes)
                              ? vesselIdentity.shiptypes[0]
                              : vesselIdentity.shiptypes,
                          }) ||
                          (Array.isArray(vesselIdentity.shiptypes)
                            ? vesselIdentity.shiptypes[0]
                            : vesselIdentity.shiptypes) ||
                          '----'
                        : (vesselIdentity[key as keyof typeof vesselIdentity] as string) || '----'}
                  </td>
                  <td>
                    {key === 'geartypes' || key === 'shiptypes' ? (
                      <Select
                        placeholder={t('selects.placeholder', 'Select an option')}
                        type="secondary"
                        options={
                          key === 'geartypes'
                            ? gearSelectOptions
                            : key === 'shiptypes'
                              ? shipSelectOptions
                              : []
                        }
                        selectedOption={(key === 'geartypes'
                          ? gearSelectOptions
                          : shipSelectOptions
                        ).find((option) => option.label === proposedValues?.[key])}
                        onSelect={(option) =>
                          setProposedValues({
                            ...proposedValues,
                            [key]: option.label as string,
                          })
                        }
                        onCleanClick={() =>
                          setProposedValues({
                            ...proposedValues,
                            [key]: undefined,
                          })
                        }
                      />
                    ) : (
                      <InputText
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
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <label>
            {t('vessel.vesselCorrection.analystComments', 'Analyst comments (optional)')}
          </label>
          <InputText
            placeholder={t(
              'vessel.vesselCorrection.commentPlaceholder',
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
                ? t('vessel.vesselCorrection.insuficientData', 'Please fill in at least one field')
                : ''
            }
            disabled={
              loading ||
              proposedValues === undefined ||
              Object.values(proposedValues).filter(Boolean).length === 0
            }
            onClick={sendCorrection}
            loading={loading}
            className={styles.cta}
          >
            {t('vessel.vesselCorrection.send', 'Send correction')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default VesselCorrectionModal
