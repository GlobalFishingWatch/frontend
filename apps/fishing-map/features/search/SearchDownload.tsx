import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { unparse as unparseCSV } from 'papaparse'
import saveAs from 'file-saver'
import { IconButton } from '@globalfishingwatch/ui-components'
import { getSearchIdentityResolved, getVesselProperty } from 'features/vessel/vessel.utils'
import { formatInfoField, getVesselGearType, getVesselShipType } from 'utils/info'
import { selectSearchResults, selectSelectedVessels } from './search.slice'

function SearchDownload() {
  const { t } = useTranslation()
  const searchResults = useSelector(selectSearchResults)
  const vesselsSelected = useSelector(selectSelectedVessels)

  const onDownloadVesselsClick = () => {
    if (vesselsSelected) {
      const vesselsParsed = vesselsSelected.map((vessel) => {
        return {
          name: formatInfoField(getVesselProperty(vessel, 'shipname'), 'shipname'),
          ssvid: getVesselProperty(vessel, 'ssvid'),
          imo: getVesselProperty(vessel, 'imo'),
          'call sign': getVesselProperty(vessel, 'callsign'),
          flag: t(`flags:${getVesselProperty(vessel, 'flag')}` as any),
          'vessel type': getVesselShipType({ shiptypes: getVesselProperty(vessel, 'shiptypes') }),
          'gear type': getVesselGearType({
            geartypes: getVesselProperty(vessel, 'geartypes'),
          }),
          owner: formatInfoField(getVesselProperty(vessel, 'owner'), 'owner'),
          transmissions: getSearchIdentityResolved(vessel).positionsCounter,
          'transmissions start': getVesselProperty(vessel, 'transmissionDateFrom'),
          'transmissions end': getVesselProperty(vessel, 'transmissionDateTo'),
          dataset: vessel.dataset.id,
        }
      })
      const csv = unparseCSV(vesselsParsed)
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `gfw-search-results-selection.csv`)
    }
  }

  if (!searchResults) {
    return null
  }

  return (
    <IconButton
      icon="download"
      type="border"
      size="medium"
      onClick={onDownloadVesselsClick}
      disabled={vesselsSelected.length <= 0}
      tooltip={
        vesselsSelected.length
          ? `${t('search.downloadSelected', 'Download CSV of selected vessels')} (${
              vesselsSelected.length
            })`
          : t('search.downloadDisabled', 'Select vessels to download their info')
      }
      tooltipPlacement="top"
    />
  )
}

export default SearchDownload
