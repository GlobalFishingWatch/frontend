import { useSelector } from 'react-redux'
import type { DOMNode } from 'html-react-parser';
import parse from 'html-react-parser'

import type { Dataset } from '@globalfishingwatch/api-types'

import { getDatasetDescriptionTranslated } from 'features/i18n/utils.datasets'
import GFWOnly from 'features/user/GFWOnly'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'

import styles from './InfoModal.module.css'

const options = {
  replace: (domNode: DOMNode) => {
    // Check if the node is a Text node and has a parent
    // For fixing google translate crash https://martijnhols.nl/blog/everything-about-google-translate-crashing-react
    if (domNode.type === 'text' && domNode.data.trim().length > 0) {
      return <span>{domNode.data}</span>
    }
  },
}

const getDatasetQueriesArray = (dataset: Dataset) => {
  const rawQueries = dataset?.configuration?.documentation?.queries
  if (!rawQueries) return
  const queries = Array.isArray(rawQueries)
    ? (rawQueries as string[])
    : [rawQueries as unknown as string]
  return queries
}
type InfoModalContentProps = {
  dataset: Dataset
}

const InfoModalContent = ({ dataset }: InfoModalContentProps) => {
  const gfwUser = useSelector(selectIsGFWUser)
  if (!dataset) {
    return null
  }
  const description = getDatasetDescriptionTranslated(dataset)
  const queries = getDatasetQueriesArray(dataset)
  return (
    <div>
      <span className={styles.content}>
        {/**
         * For security reasons, we are only parsing html
         * coming from translated descriptions
         **/}
        {description.length > 0 ? parse(description, options) : dataset.description}
      </span>
      {gfwUser && queries && queries?.length > 0 && (
        <div className={styles.content}>
          <div className={styles.queriesContainer}>
            <h2 className={styles.subtitle}>Queries used</h2>
            <GFWOnly userGroup="gfw" />
          </div>
          {queries?.map((query: string, index: number) => (
            <div key={index}>
              <a target="_blank" href={query} rel="noreferrer">
                query {index + 1}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InfoModalContent
