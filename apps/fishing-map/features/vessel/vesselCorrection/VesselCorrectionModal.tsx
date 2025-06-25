import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { GEAR_TYPES, VESSEL_TYPES, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { Button, InputText, Modal, Select, Tag } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME, ROOT_DOM_ELEMENT } from 'data/config'
import flags from 'data/flags'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import I18nFlag from 'features/i18n/i18nFlag'
import GFWOnly from 'features/user/GFWOnly'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { formatTransmissionDate, getCurrentIdentityVessel } from 'features/vessel/vessel.utils'
import {
  formatInfoField,
  getVesselGearTypeLabel,
  getVesselShipTypeLabel,
  sortOptionsAlphabetically,
} from 'utils/info'

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
        source: vesselIdentity.identitySource || '',
        workspaceLink: window.location.href,
        dateSubmitted: now,
        timeRange: formatTransmissionDate(vesselIdentity),
        vesselId:
          VesselIdentitySourceEnum.Registry && vesselIdentity.recordId
            ? vesselIdentity.recordId
            : vesselIdentity.id,
        originalValues: {
          flag: vesselIdentity.flag || '',
          shipname: vesselIdentity.shipname || vesselIdentity.nShipname || '',
          geartypes:
            (
              getCurrentIdentityVessel(vesselData, {
                identityId,
                identitySource: VesselIdentitySourceEnum.Registry,
              })?.geartypes || []
            ).join(', ') || '',
          gfw_geartypes:
            (
              getCurrentIdentityVessel(vesselData, {
                identityId,
                identitySource: VesselIdentitySourceEnum.SelfReported,
              })?.geartypes || []
            ).join(', ') || '',
          shiptypes: (vesselIdentity.shiptypes || []).join(', ') || '',
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

  const flagSelectOptions = flags.map((key) => ({
    label: key.id + ' - ' + key.label,
    id: key.id,
  }))

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={
        <Fragment>
          {t('vessel.vesselCorrection.title')}
          <GFWOnly userGroup="any" />
        </Fragment>
      }
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <div className={styles.container}>
        <div className={styles.top}>
          <div>
            <label>{t('common.vessel')}</label>
            <Tag>
              {formatInfoField(vesselIdentity.shipname || vesselIdentity.nShipname, 'shipname')}
            </Tag>
            <Tag>{formatTransmissionDate(vesselIdentity, true)}</Tag>
          </div>
          <div>
            <label>{t('layer.source')}</label>
            <Tag>
              {identitySource === VesselIdentitySourceEnum.Registry
                ? t('vessel.infoSources.registry') //
                : t('vessel.infoSources.gfw-source')}
            </Tag>
          </div>
          <div>
            <label>
              {identitySource === VesselIdentitySourceEnum.Registry
                ? t('vessel.recordId')
                : t('common.vesselId')}
            </label>
            <Tag>
              {identitySource === VesselIdentitySourceEnum.Registry
                ? vesselIdentity.recordId?.replaceAll('|', ' ')
                : vesselIdentity.id}
            </Tag>
          </div>
        </div>

        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <label>{t('common.field')}</label>
                </th>
                <th>
                  <label>{t('common.value')}</label>
                </th>
                <th>
                  <label>{t('layer.vessel_info_correction')}</label>
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
                    {key === 'geartypes' ? (
                      (() => {
                        const label = getVesselGearTypeLabel({
                          geartypes: vesselIdentity.geartypes,
                        })
                        return Array.isArray(label)
                          ? label.join(', ')
                          : label || vesselIdentity.geartypes || '----'
                      })()
                    ) : key === 'shiptypes' ? (
                      getVesselShipTypeLabel({
                        shiptypes: Array.isArray(vesselIdentity.shiptypes)
                          ? vesselIdentity.shiptypes.join(', ')
                          : vesselIdentity.shiptypes,
                      }) ||
                      (Array.isArray(vesselIdentity.shiptypes)
                        ? vesselIdentity.shiptypes.join(', ')
                        : vesselIdentity.shiptypes) ||
                      '----'
                    ) : key === 'flag' ? (
                      <I18nFlag iso={vesselIdentity.flag} />
                    ) : (
                      (vesselIdentity[key as keyof typeof vesselIdentity] as string) || '----'
                    )}
                  </td>
                  <td>
                    {key === 'geartypes' || key === 'shiptypes' || key === 'flag' ? (
                      <Select
                        placeholder={t('selects.placeholder')}
                        type="secondary"
                        options={
                          key === 'geartypes'
                            ? sortOptionsAlphabetically(gearSelectOptions)
                            : key === 'shiptypes'
                              ? sortOptionsAlphabetically(shipSelectOptions)
                              : key === 'flag'
                                ? sortOptionsAlphabetically(flagSelectOptions)
                                : []
                        }
                        selectedOption={(key === 'geartypes'
                          ? gearSelectOptions
                          : key === 'flag'
                            ? flagSelectOptions
                            : shipSelectOptions
                        ).find((option) => option.id === proposedValues?.[key])}
                        onSelect={(option) =>
                          setProposedValues({
                            ...proposedValues,
                            [key]: option.id as string,
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
          <label>{t('vessel.vesselCorrection.analystComments')}</label>
          <InputText
            placeholder={t(
              'vessel.vesselCorrection.commentPlaceholder',
              'Please provide supportive source reference(s) to your correction and describe your correction rationale.'
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
              proposedValues === undefined ? t('vessel.vesselCorrection.insuficientData') : ''
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
            {t('vessel.vesselCorrection.send')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default VesselCorrectionModal
