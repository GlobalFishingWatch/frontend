import type { JSX,ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import type { ValueItem } from 'types';

import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import I18nDate from 'features/i18n/i18nDate'
import { Iuu } from 'types'
import type { VesselFieldLabel } from 'types/vessel'

import Faq from './Faq'
import InfoFieldHistory from './InfoFieldHistory'

import styles from './Info.module.css'

interface ListItemProps {
  label: VesselFieldLabel
  modalTitle?: string
  value?: string
  className?: string
  valuesHistory?: ValueItem[]
  vesselName: string
  columnHeaders?: {
    field?: ReactNode
    dates?: ReactNode
    source?: ReactNode
  }
  hideTMTDate?: boolean
  includeFaq?: boolean
  helpText?: React.ReactNode
  datesTemplate?: (firstSeen, originalFirstSeen) => JSX.Element
}

const InfoField: React.FC<ListItemProps> = ({
  value = DEFAULT_EMPTY_VALUE,
  label,
  className = '',
  valuesHistory = [],
  vesselName,
  columnHeaders,
  modalTitle = null,
  datesTemplate,
  hideTMTDate = false,
  includeFaq = false,
  helpText,
}): React.ReactElement<any> => {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => {
    if (valuesHistory.length > 0) {
      setModalOpen(true)
      trackEvent({
        category: TrackCategory.VesselDetailInfoTab,
        action: 'Vessel detail INFO tab is open and user click in the history by each field',
        label: JSON.stringify({ [label]: valuesHistory.length }),
      })
    }
  }, [label, valuesHistory.length])
  const closeModal = useCallback(() => setModalOpen(false), [])

  const since = useMemo(() => valuesHistory.slice(0, 1)?.shift()?.firstSeen, [valuesHistory])
  return (
    <div className={cx(styles.identifierField, styles[className])}>
      <label className={styles.infoLabel}>
        {t(`vessel.${label}` as any, label)}
        {helpText && (
          <DataAndTerminology size="tiny" type="default" title={t(`vessel.${label}` as any, label)}>
            {helpText}
            {includeFaq && <Faq source={label} />}
          </DataAndTerminology>
        )}
      </label>
      <div>
        <div onClick={openModal}>{value}</div>
        {valuesHistory.length > 0 && (
          <button className={styles.moreValues} onClick={openModal}>
            {t('vessel.formatValues', '{{quantity}} values', {
              quantity: valuesHistory.length,
            })}
          </button>
        )}
        {valuesHistory.length === 1 && since && (
          <p className={styles.rangeLabel}>
            {t('common.since', 'Since')} <I18nDate date={since} />
          </p>
        )}
        <InfoFieldHistory
          label={label}
          modalTitle={modalTitle}
          history={valuesHistory}
          isOpen={modalOpen}
          hideTMTDate={hideTMTDate}
          onClose={closeModal}
          datesTemplate={datesTemplate}
          vesselName={vesselName}
          columnHeaders={columnHeaders}
        ></InfoFieldHistory>
      </div>
    </div>
  )
}

export default InfoField
