import React, { Fragment, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import cx from 'classnames'
import type { RiskOutput, VesselWithHistory } from 'types';

import { FIRST_YEAR_OF_DATA, LAST_YEAR_FORCED_LABOR } from 'data/config'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import { RiskLevel } from 'types'
import { VesselFieldLabel } from 'types/vessel'

import styles from './ForcedLabor.module.css'

interface ForcedLaborProps {
  vessel: VesselWithHistory | null
}

const ForcedLabor: React.FC<ForcedLaborProps> = (props): React.ReactElement<any> => {
  const vessel = props.vessel
  const { t } = useTranslation()

  const riskModel: RiskOutput[] = useMemo(() => {
    const yearsLength = LAST_YEAR_FORCED_LABOR - (FIRST_YEAR_OF_DATA - 1)
    const yearsToDisplay = Array.from({ length: yearsLength }, (x, i) => i + FIRST_YEAR_OF_DATA).reverse()
    const initialModel: RiskOutput[] = yearsToDisplay.map(year => {
      return {
        year,
        highrisk: false,
        levels: [],
        highestRisk: RiskLevel.unknown,
        reportedCases: false
      }
    })
    if (!vessel.forcedLabour) {
      return initialModel
    }

    return vessel.forcedLabour.reduce((parsedRisks: RiskOutput[], risk) => {
      const indexYearFound = parsedRisks.findIndex(parsedRisk => parsedRisk.year === risk.year)
      const riskLevel = risk.confidence && risk.score ?
        RiskLevel.high : (risk.confidence && !risk.score ? RiskLevel.low : RiskLevel.unknown)
      if (indexYearFound !== -1) {
        const yearRiskLevels = [...parsedRisks[indexYearFound].levels, riskLevel]
        parsedRisks[indexYearFound] = {
          ...parsedRisks[indexYearFound],
          levels: yearRiskLevels,
          reportedCases: parsedRisks[indexYearFound].reportedCases || !!risk.reported,
          highrisk: yearRiskLevels.includes(RiskLevel.high),
          highestRisk: parsedRisks[indexYearFound].highestRisk === RiskLevel.high || riskLevel === RiskLevel.high ?
            RiskLevel.high : (parsedRisks[indexYearFound].highestRisk === RiskLevel.low || riskLevel === RiskLevel.low ?
              RiskLevel.low : RiskLevel.unknown)
        }
      } else {
        // We are showing until a fixed date, if some day the data is updated
        // we will display the data until we update the config
        parsedRisks.push({
          year: risk.year,
          levels: [riskLevel],
          reportedCases: !!risk.reported,
          highrisk: riskLevel === RiskLevel.high,
          highestRisk: riskLevel === RiskLevel.high ?
            RiskLevel.high : (riskLevel === RiskLevel.low ? RiskLevel.low : RiskLevel.unknown)
        })
        return parsedRisks.sort((a, b) => b.year - a.year)
      }
      return parsedRisks
    }, initialModel)


  }, [vessel.forcedLabour])

  return (
    <div
      className={styles.forcedLabourContainer}
    >
      <div className={styles.labourHeaders}>
        <div>{t(`vessel.${VesselFieldLabel.forcedLabourModel}` as any, VesselFieldLabel.forcedLabourModel)}</div>
        <div>
          {t('risk.riskModel', 'Risk Model')}
          <DataAndTerminology size="tiny" type="default"
            title={t(`vessel.${VesselFieldLabel.forcedLabourModel}` as any, VesselFieldLabel.forcedLabourModel)}>
            <Trans i18nKey="vessel.forcedLaborModelDescription">
              High Risk: In multiple iterations, the model always predicted the vessel as an offender for that year.
              <br />
              Low Risk: In multiple iterations, the model always predicted the vessel as a non-offender for that year.
              <br />
              Unknown risk: In some iterations, the model predicted the vessel as an offender and in others, it predicted it as a non-offender, for that year.
            </Trans>
            <p className={styles.availabilityWarning}>
              {t('vessel.forcedLabourModelAvailability', "The Forced Labor Risk Model classifications are currently available for the years 2012-2020.")}
            </p>
          </DataAndTerminology>
        </div>
        <div>
          {t('risk.reportedCases', 'Reported Cases')}
          <DataAndTerminology size="tiny" type="default"
            title={t('risk.reportedCases', 'Reported Cases')}>
            <Fragment>
              {t('vessel.forcedLaborCasesDescription', 'Reported cases are based a survey of a global set of reports and newspapers using multiple languages including grey literature reports, media sources, and government reports, and that included at least one of the following criteria:')}
              <ul className={styles.reportedCasesTerms}>
                <li>{t('vessel.forcedLaborCasesDescriptionItem1', 'witnesses or testimonies from victims;')}</li>
                <li>{t('vessel.forcedLaborCasesDescriptionItem2', 'prosecutions (either with companies/individuals being charged as guilty, or mentions of investigations in place); or')}</li>
                <li>{t('vessel.forcedLaborCasesDescriptionItem3', 'arrests or detentions of vessels under suspicion of forced labour behaviour from official bodies.')}</li>
              </ul>
            </Fragment>
          </DataAndTerminology>

        </div>
      </div>

      {riskModel.map(risk =>
        <div key={risk.year} className={cx(styles.riskYearContainer, { [styles.highRisk]: risk.highrisk })}>
          <div className={styles.riskYear}>{risk.year}</div>
          <div className={styles.riskLabel}>{t('risk.' + (risk.highestRisk) as any)}</div>
          <div className={styles.riskLabel}>{risk.reportedCases ? t('common.yes', 'Yes') : t('common.no', 'No')}</div>
        </div>
      )}

    </div>

  )
}

export default ForcedLabor
