import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { InsightResponse, InsightValueInPeriod } from '@globalfishingwatch/api-types'

import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import { formatInfoField, upperFirst } from 'utils/info'

import styles from './Insights.module.css'

const InsightMOUList = ({
  insightData,
  isLoading,
  error,
}: {
  insightData?: InsightResponse
  isLoading: boolean
  error: ParsedAPIError
}) => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const { mouList } = insightData?.vesselIdentity || {}
  const tokyoAppearences: Record<string, Record<string, InsightValueInPeriod>> = {
    BLACK: {},
    GREY: {},
  }
  mouList?.tokyo.valuesInThePeriod.forEach((v) => {
    if (!tokyoAppearences[v.value]?.[v.reference]) {
      tokyoAppearences[v.value][v.reference] = { ...v, value: upperFirst(v.value) }
    } else {
      if (v.from < tokyoAppearences[v.value][v.reference].from) {
        tokyoAppearences[v.value][v.reference].from = v.from
      }
      if (v.to > tokyoAppearences[v.value][v.reference].to) {
        tokyoAppearences[v.value][v.reference].to = v.to
      }
      if (!tokyoAppearences[v.value][v.reference].value.includes(upperFirst(v.value))) {
        tokyoAppearences[v.value][v.reference].value += `, ${upperFirst(v.value)}`
      }
    }
  })
  const parisAppearences: Record<string, Record<string, InsightValueInPeriod>> = {
    BLACK: {},
    GREY: {},
  }
  mouList?.paris.valuesInThePeriod.forEach((v) => {
    if (!parisAppearences[v.value]?.[v.reference]) {
      parisAppearences[v.value][v.reference] = { ...v, value: upperFirst(v.value) }
    } else {
      if (v.from < parisAppearences[v.value][v.reference].from) {
        parisAppearences[v.value][v.reference].from = v.from
      }
      if (v.to > parisAppearences[v.value][v.reference].to) {
        parisAppearences[v.value][v.reference].to = v.to
      }
      if (!parisAppearences[v.value][v.reference].value.includes(upperFirst(v.value))) {
        parisAppearences[v.value][v.reference].value += `, ${upperFirst(v.value)}`
      }
    }
  })

  const getMOUListAppearance = () => {
    const messages = []
    const hasTokyoBlackAppearences = Object.values(tokyoAppearences.BLACK).length > 0
    const hasTokyoGreyAppearences = Object.values(tokyoAppearences.GREY).length > 0
    if (hasTokyoBlackAppearences) {
      messages.push(
        <p key="tokyoBlackCount">
          {t('vessel.insights.MOUTokyoBlackListsCount', {
            flags: Object.values(tokyoAppearences.BLACK)
              .map(
                (v) =>
                  `${formatInfoField(v.reference, 'flag')} ${t('common.from')} ${formatI18nDate(
                    v.from
                  )} ${t('common.to')} ${formatI18nDate(v.to)}`
              )
              .join(', '),
            defaultValue: 'Flag present on the Tokyo MOU black list ({{flags}})',
          })}
        </p>
      )
    }
    if (hasTokyoGreyAppearences) {
      messages.push(
        <p key="tokyoGreyCount">
          {t('vessel.insights.MOUTokyoGreyListsCount', {
            flags: Object.values(tokyoAppearences.GREY)
              .map(
                (v) =>
                  `${formatInfoField(v.reference, 'flag')} ${t('common.from')} ${formatI18nDate(
                    v.from
                  )} ${t('common.to')} ${formatI18nDate(v.to)}`
              )
              .join(', '),
            defaultValue: 'Flag present on the Tokyo MOU grey list ({{flags}})',
          })}
        </p>
      )
    }
    if (
      !hasTokyoBlackAppearences &&
      !hasTokyoGreyAppearences &&
      mouList?.tokyo.totalTimesListed &&
      mouList?.tokyo.totalTimesListed > 0
    ) {
      messages.push(
        <p key="tokyoEmpty">
          {t(
            'vessel.insights.MOUTokyoListsPreviousAppearance',
            'Previously flew under another flag on the Tokyo MOU black or grey list'
          )}
        </p>
      )
    }

    const hasParisBlackAppearences = Object.values(parisAppearences.BLACK).length > 0
    const hasParisGreyAppearences = Object.values(parisAppearences.GREY).length > 0

    if (hasParisBlackAppearences) {
      messages.push(
        <p key="parisBlackCount">
          {t('vessel.insights.MOUParisBlackListsCount', {
            flags: Object.values(parisAppearences.BLACK)
              .map(
                (v) =>
                  `${formatInfoField(v.reference, 'flag')} ${t('common.from')} ${formatI18nDate(
                    v.from
                  )} ${t('common.to')} ${formatI18nDate(v.to)}`
              )
              .join(', '),
            defaultValue: 'Flag present on the Paris MOU black list ({{flags}})',
          })}
        </p>
      )
    }
    if (hasParisGreyAppearences) {
      messages.push(
        <p key="parisGreyCount">
          {t('vessel.insights.MOUParisGreyListsCount', {
            flags: Object.values(parisAppearences.GREY)
              .map(
                (v) =>
                  `${formatInfoField(v.reference, 'flag')} ${t('common.from')} ${formatI18nDate(
                    v.from
                  )} ${t('common.to')} ${formatI18nDate(v.to)}`
              )
              .join(', '),
            defaultValue: 'Flag present on the Paris MOU grey list ({{flags}})',
          })}
        </p>
      )
    }

    if (
      !hasParisBlackAppearences &&
      !hasParisGreyAppearences &&
      mouList?.paris.totalTimesListed &&
      mouList?.paris.totalTimesListed > 0
    ) {
      messages.push(
        <p key="parisEmpty">
          {t(
            'vessel.insights.MOUParisListsPreviousAppearance',
            'Previously flew under another flag on the Paris MOU black or grey list'
          )}
        </p>
      )
    }
    if (
      mouList?.tokyo.valuesInThePeriod.length === 0 &&
      mouList?.paris.valuesInThePeriod.length === 0
    ) {
      messages.push(
        <p className={styles.secondary} key="allEmpty">
          {t(
            'vessel.insights.MOUListsEmpty',
            'Flying under a flag/flags not present on the Tokio or Paris MOU black or grey lists'
          )}
        </p>
      )
    }
    return messages
  }

  return (
    <div id="MOULists" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t('vessel.insights.MOULists', 'MOU Lists')}</label>
        <DataTerminology
          title={t('vessel.insights.MOULists', 'MOU Lists')}
          terminologyKey="insightsMOUList"
        />
      </div>
      {guestUser ? (
        <VesselIdentityFieldLogin />
      ) : isLoading ? (
        <Fragment>
          <div style={{ width: '60rem' }} className={styles.loadingPlaceholder} />
          <div style={{ width: '10rem' }} className={styles.loadingPlaceholder} />
        </Fragment>
      ) : error ? (
        <InsightError error={error} />
      ) : (
        <div>{getMOUListAppearance()}</div>
      )}
    </div>
  )
}

export default InsightMOUList
