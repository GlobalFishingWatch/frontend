import React, { useMemo } from 'react'
import cx from 'classnames'
import { Trans, useTranslation } from 'react-i18next'
import { RiskLevel, RiskOutput, VesselWithHistory } from 'types'
import { VesselFieldLabel } from 'types/vessel'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import styles from './Info.module.css'

interface InfoProps {
  vessel: VesselWithHistory | null
}

const ForcedLabor: React.FC<InfoProps> = (props): React.ReactElement => {
  const vessel = props.vessel
  const { t } = useTranslation()

  const riskModel: RiskOutput[] = useMemo(() => {
    if (!vessel.forcedLabour) {
      return []
    }
    const yearsLength = new Date().getFullYear() - 2011
    const yearsToDisplay = Array.from({ length: yearsLength }, (x, i) => i + 2012)
    const initialModel = yearsToDisplay.map(year => {
      return {
        year,
        highrisk: false,
        levels: [],
        highestRisk: RiskLevel.unknown,
        reportedCases: false
      }
    })

    const riskModel: RiskOutput[] = vessel.forcedLabour.reduce((parsedRisks: RiskOutput[], risk) => {
      const indexYearFound = parsedRisks.findIndex(parsedRisk => parsedRisk.year === risk.year)
      const riskLevel = risk.confidence && risk.score ?
        RiskLevel.high : (risk.confidence && !risk.score ? RiskLevel.low : RiskLevel.unknown)
      if (indexYearFound !== -1) {
        const yearRiskLevels = [...parsedRisks[indexYearFound].levels, riskLevel]
        parsedRisks[indexYearFound] = {
          ...parsedRisks[indexYearFound],
          levels: yearRiskLevels,
          reportedCases: parsedRisks[indexYearFound].reportedCases || risk.reportedCases,
          highrisk: yearRiskLevels.includes(RiskLevel.high),
          highestRisk: parsedRisks[indexYearFound].highestRisk === RiskLevel.high || riskLevel === RiskLevel.high ?
            RiskLevel.high : (parsedRisks[indexYearFound].highestRisk === RiskLevel.low || riskLevel === RiskLevel.low ?
              RiskLevel.low : RiskLevel.unknown)
        }
      }
      return parsedRisks
    }, initialModel).sort((a, b) => a.year - b.year)

    return riskModel
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
          </DataAndTerminology>
        </div>
        <div>{t('risk.reportedCases', 'Reported Cases')}</div>
      </div>

      {riskModel.map(risk =>
        <div className={cx(styles.riskYearContainer, { [styles.highRisk]: risk.highrisk })}>
          <div className={styles.riskYear}>{risk.year}</div>
          <div className={styles.riskLabel}>{t('risk.' + (risk.highestRisk) as any)}</div>
          <div className={styles.riskLabel}>{risk.reportedCases ? t('common.yes', 'Yes') : t('common.no', 'No')}</div>
        </div>
      )}

    </div>

  )
}

export default ForcedLabor
