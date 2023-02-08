import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InputText } from '@globalfishingwatch/ui-components'

type ReportVesselsFilterProps = {}

export default function ReportVesselsFilter(props: ReportVesselsFilterProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  return (
    <div>
      <InputText
        type="search"
        value={query}
        placeholder={t(
          'report.searchPlaceholder',
          'Filter vessels by name, mmsi, flag states or gear type'
        )}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
