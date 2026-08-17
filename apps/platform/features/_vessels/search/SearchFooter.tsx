import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { RESULTS_PER_PAGE } from 'features/_vessels/search/search.config'
import { selectSearchOption } from 'features/_vessels/search/search.config.selectors'
import {
  selectSearchPagination,
  selectSearchResults,
  selectSelectedVessels,
} from 'features/_vessels/search/search.slice'
import SearchActions from 'features/_vessels/search/SearchActions'
import SearchDownload from 'features/_vessels/search/SearchDownload'
import I18nNumber from 'features/i18n/i18nNumber'

import styles from './Search.module.css'

function SearchFooter() {
  const { t } = useTranslation()
  const searchResults = useSelector(selectSearchResults)
  const searchResultsPagination = useSelector(selectSearchPagination)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const activeSearchOption = useSelector(selectSearchOption)

  const hasMoreResults =
    !!searchResultsPagination.since &&
    searchResults.length < searchResultsPagination.total &&
    searchResultsPagination.total > RESULTS_PER_PAGE
  const displayedTotal = hasMoreResults ? searchResultsPagination.total : searchResults.length

  return (
    <div className={cx('card', styles.footer, styles[activeSearchOption])}>
      {searchResults && searchResults.length !== 0 && (
        <label className={styles.results}>
          {`${t((t) => t.search.seeing)} `}
          <I18nNumber number={searchResults.length} />
          {` ${t((t) => t.common.of)} `}
          <I18nNumber number={displayedTotal} />
          {` ${t((t) => t.search.results)} ${
            vesselsSelected.length !== 0
              ? `(${vesselsSelected.length} ${t((t) => t.selects.selected)})`
              : ''
          }`}
        </label>
      )}
      {activeSearchOption === 'advanced' && <SearchDownload />}
      <SearchActions />
    </div>
  )
}

export default SearchFooter
