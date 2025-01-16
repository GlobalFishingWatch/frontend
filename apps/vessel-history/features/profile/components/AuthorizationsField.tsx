import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ValueItem } from 'types'

import type { Authorization } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'
import { I18nSpecialDate } from 'features/i18n/i18nDate'
import type { VesselFieldLabel } from 'types/vessel'

import InfoFieldHistory from './InfoFieldHistory'

import styles from './Info.module.css'

interface ListItemProps {
  label: VesselFieldLabel
  authorizations?: Authorization[]
  vesselName: string
}

const AuthorizationsField: React.FC<ListItemProps> = ({
  label,
  authorizations = [],
  vesselName,
}): React.ReactElement<any> => {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => {
    if (authorizations.length > 0) {
      setModalOpen(true)
      trackEvent({
        category: TrackCategory.VesselDetailInfoTab,
        action: 'Vessel detail INFO tab is open and user click in the history by each field',
        label: JSON.stringify({ [label]: authorizations.length }),
      })
    }
  }, [label, authorizations.length])
  const closeModal = useCallback(() => setModalOpen(false), [])

  const sortedAuthorizations = [...authorizations].sort((a: Authorization, b: Authorization) => {
    return a.originalEndDate - b.originalEndDate
  })
  const auths: Authorization[] = sortedAuthorizations.length
    ? Array.from(new Map(sortedAuthorizations.map((item) => [item.source, item])).values())
    : []

  const authsHistory = useMemo(
    () =>
      sortedAuthorizations?.reverse().map((auth) => ({
        ...auth,
        originalFirstSeen: auth.originalStartDate,
        value: auth.source,
      })) as ValueItem[],
    [sortedAuthorizations]
  )

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
      {!auths?.length && <p>{t('vessel.noAuthorizations', 'No authorizations found')}</p>}
      {sortedAuthorizations.length > 0 && (
        <div>
          <button className={styles.moreValues} onClick={openModal}>
            {t('vessel.formatValues', '{{quantity}} values', {
              quantity: sortedAuthorizations.length,
            })}
          </button>
          <InfoFieldHistory
            label={label}
            columnHeaders={{
              field: t('vessel.rmfoRegistry', 'RMFO Registry'),
              dates: (
                <div>
                  {t('common.timeRange', 'time range')}
                  <IconButton
                    size="tiny"
                    icon="info"
                    tooltip={t('vessel.authorizationRangeHelp')}
                  ></IconButton>
                </div>
              ),
            }}
            history={authsHistory}
            isOpen={modalOpen}
            hideTMTDate={false}
            onClose={closeModal}
            vesselName={vesselName}
          ></InfoFieldHistory>
        </div>
      )}
    </div>
  )
}

export default AuthorizationsField
