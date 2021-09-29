import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { Authorization } from '@globalfishingwatch/api-types/dist'
import { Modal } from '@globalfishingwatch/ui-components'
import { I18nSpecialDate } from 'features/i18n/i18nDate'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { VesselFieldLabel } from 'types/vessel'
import styles from './Info.module.css'

interface ListItemProps {
  label: VesselFieldLabel
  authorizations?: Authorization[]
  vesselName: string
}

const AutorizationsField: React.FC<ListItemProps> = ({
  label,
  authorizations = [],
  vesselName,
}): React.ReactElement => {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => {
    if (authorizations.length > 0) {
      setModalOpen(true)
      uaEvent({
        category: 'Vessel Detail INFO Tab',
        action: 'Vessel detail INFO tab is open and user click in the history by each field',
        label: JSON.stringify({ [label]: authorizations.length }),
      })
    }
  }, [label, authorizations.length])
  const closeModal = useCallback(() => setModalOpen(false), [])

  const defaultTitle = useMemo(() => {
    return `${label} History for ${vesselName}`
  }, [label, vesselName])

  const sortedAuthorizations = [...authorizations].sort((a: Authorization, b: Authorization) => {
    return a.originalEndDate - b.originalEndDate
  })
  const auths: Authorization[] = sortedAuthorizations.length
    ? Array.from(new Map(sortedAuthorizations.map((item) => [item.source, item])).values())
    : []

  return (
    <div className={styles.identifierField}>
      <label>{t('vessel.authorization_plural', 'authorizations')}</label>
      {auths?.map((auth, index) => (
        <p key={index}>
          {auth.source}{' '}
          <Fragment>
            {t('common.from', 'from')}{' '}
            {auth.startDate ?? auth.originalStartDate ? (
              <I18nSpecialDate date={auth.startDate ?? auth.originalStartDate} />
            ) : (
              DEFAULT_EMPTY_VALUE
            )}{' '}
            {t('common.to', 'to')}{' '}
            {auth.endDate ?? auth.originalEndDate ? (
              <I18nSpecialDate date={auth.endDate ?? auth.originalEndDate} />
            ) : (
              DEFAULT_EMPTY_VALUE
            )}
          </Fragment>
        </p>
      ))}
      {!auths?.length && (
        <p>{t('vessel.noAuthorizations', 'No authorizations found')}</p>
      )}
      {sortedAuthorizations.length > 0 && (
        <div>
          <button className={styles.moreValues} onClick={openModal}>
            {t('vessel.formatValues', '{{quantity}} values', {
              quantity: sortedAuthorizations.length,
            })}
          </button>
          <Modal
            title={t('vessel.historyLabelByField', defaultTitle, {
              label: t(`vessel.${label}` as any, label),
              vesselName,
            })}
            isOpen={modalOpen}
            onClose={closeModal}
          >
            <div>
              {sortedAuthorizations?.reverse().map((auth, index) => (
                <p key={index}>
                  {auth.source}{' '}
                  <Fragment>
                    {t('common.from', 'from')}{' '}
                    {auth.startDate ?? auth.originalStartDate ? (
                      <I18nSpecialDate date={auth.startDate ?? auth.originalStartDate} />
                    ) : (
                      DEFAULT_EMPTY_VALUE
                    )}{' '}
                    {t('common.to', 'to')}{' '}
                    {auth.endDate ?? auth.originalEndDate ? (
                      <I18nSpecialDate date={auth.endDate ?? auth.originalEndDate} />
                    ) : (
                      DEFAULT_EMPTY_VALUE
                    )}
                  </Fragment>
                </p>
              ))}
            </div>
          </Modal>
        </div>
      )}
    </div>
  )
}

export default AutorizationsField
