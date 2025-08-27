// import { useCallback, useMemo, useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import cx from 'classnames'
// import type { GetItemPropsOptions } from 'downshift'
// import { upperFirst } from 'es-toolkit'
// import type { FeatureCollection } from 'geojson'

import type { Row } from '@tanstack/react-table'

import type { Vessel } from '@/types/vessel.types'

// import type { Vessel } from '@/routes/vessels'
// import type { Locale } from '@globalfishingwatch/api-types'
// import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
// import { geoJSONToSegments, segmentsToBbox } from '@globalfishingwatch/data-transforms'
// import { useSmallScreen } from '@globalfishingwatch/react-hooks'
// import { FIRST_YEAR_OF_DATA, YearlyTransmissionsTimeline } from '@globalfishingwatch/ui-components'

// import TrackFootprint from '../../trackFootprint/TrackFootprint'

// import styles from './ExpandedRow.module.css'

// type ExpandedRowProps = {
//   vessel: Vessel
// }

// function ExpandedRow({ vessel }: ExpandedRowProps) {
//   const { t, i18n } = useTranslation()
//   const isSmallScreen = useSmallScreen()
//   const [highlightedYear, setHighlightedYear] = useState<number>()

//   const { track } = vessel
//   const { transmissionDateFrom, transmissionDateTo, positionsCounter } = vessel
//   const imoKey = Object.keys(vessel).find((key) => key.toLowerCase().includes('imo'))
//   const vesselId = imoKey ? vessel[imoKey] : undefined

//   const onYearHover = useCallback(
//     (year?: number) => {
//       if (!isSmallScreen) {
//         setHighlightedYear(year)
//       }
//     },
//     [isSmallScreen]
//   )

//   const onTrackFootprintLoad = useCallback((data: FeatureCollection) => {
//     const segments = geoJSONToSegments(data)
//     const bbox = segments?.length ? segmentsToBbox(segments) : undefined
//   }, [])

//   return (
//     <div className={styles.container}>
//       <div className={styles.fullWidth}>
//         {!isSmallScreen && <TrackFootprint vessel={vessel} />}
//         <div className={styles.properties}>
//           {transmissionDateFrom && transmissionDateTo && (
//             <div className={cx(styles.property, styles.fullWidth)}>
//               {/* <span>
//                 {hasPositions
//                   ? `${formatI18nNumber(positionsCounter)} ${t('vessel.transmission_other')} ${t('common.from')} `
//                   : `${upperFirst(t('common.from'))} `}
//                 <I18nDate date={transmissionDateFrom} /> {t('common.to')}{' '}
//                 <I18nDate date={transmissionDateTo} />
//               </span> */}

//               <YearlyTransmissionsTimeline
//                 firstTransmissionDate={transmissionDateFrom}
//                 lastTransmissionDate={transmissionDateTo}
//                 firstYearOfData={FIRST_YEAR_OF_DATA}
//                 locale={i18n.language as Locale}
//                 onYearHover={onYearHover}
//                 showLastTimePoint
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ExpandedRow

interface ExpandableRowProps {
  data: Vessel
  isLoading?: boolean
}

function ExpandableRow({ data, isLoading }: ExpandableRowProps) {
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50">
        <div className="animate-pulse">Loading expanded data...</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div>
      <h4 className="font-semibold mb-2">Additional Details:</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">IMO:</span>
          <span className="text-sm">{data.imo}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Name:</span>
          <span className="text-sm">{data.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Type:</span>
          <span className="text-sm">{data.type}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Flag:</span>
          <span className="text-sm">{data.flag}</span>
        </div>
      </div>
    </div>
  )
}

export default ExpandableRow

export const renderExpandedRow = ({ row }: { row: Row<Vessel> }) => {
  return <ExpandableRow data={row.original} />
}
