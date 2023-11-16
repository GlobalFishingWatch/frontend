import { useTranslation } from 'react-i18next'
import { ChangeEvent, FC, Fragment, useCallback, useMemo, useState } from 'react'
import { uniq } from 'lodash'
import { useSelector } from 'react-redux'
import { InputText } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { LIBRARY_LAYERS } from 'data/library-layers'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import styles from './LayerLibrary.module.css'

type LayerResolved = {
  name: string
  description: string
  category: DataviewCategory
  datasetId: string
  dataviewSlug: string
  previewImageUrl: string
}

const getHighlightedText = (text: string, highlight: string) => {
  if (highlight === '') return text
  const regEscape = (v: string) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const textChunks = text.split(new RegExp(regEscape(highlight), 'ig'))
  let sliceIdx = 0
  return textChunks.map((chunk) => {
    const currentSliceIdx = sliceIdx + chunk.length
    sliceIdx += chunk.length + highlight.length
    return (
      <Fragment>
        {chunk}
        {currentSliceIdx < text.length && (
          <span className={styles.highlighted}>{text.slice(currentSliceIdx, sliceIdx)}</span>
        )}
      </Fragment>
    )
  })
}

const LayerLibrary: FC = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const dataviews = useSelector(selectAllDataviews)

  const layersResolved: LayerResolved[] = useMemo(
    () =>
      LIBRARY_LAYERS.flatMap((layer) => {
        const dataview = dataviews.find((d) => d.slug === layer.dataviewSlug)
        if (!dataview) return []
        return {
          ...layer,
          name: t(`datasets:${layer.datasetId}.name`),
          description: t(`datasets:${layer.datasetId}.description`),
          category: t(
            `common.${dataview.category as DataviewCategory}`,
            dataview.category as DataviewCategory
          ),
        }
      }),
    [dataviews, t]
  )
  const uniqCategories = useMemo(
    () => uniq(layersResolved.map(({ category }) => category)),
    [layersResolved]
  )
  const filteredLayers = useMemo(
    () =>
      layersResolved.filter((layer) => {
        return (
          layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          layer.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }),
    [layersResolved, searchQuery]
  )
  const layersByCategory = useMemo(
    () =>
      filteredLayers.reduce(
        (acc, layer) => {
          if (!acc[layer.category]) {
            acc[layer.category] = []
          }
          acc[layer.category].push(layer)
          return acc
        },
        Object.fromEntries(
          uniqCategories.map((category) => [category, []] as [DataviewCategory, LayerResolved[]])
        )
      ),
    [filteredLayers, uniqCategories]
  )

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const onCategoryClick = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    const targetElement = document.querySelector((e.target as any).getAttribute('href'))
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <InputText
          onChange={onInputChange}
          value={searchQuery || ''}
          className={styles.input}
          type="search"
          placeholder={t('search.title', 'Search')}
        />
      </div>
      <div className={styles.categoriesContainer}>
        <div className={styles.categories}>
          {uniqCategories.map((category) => (
            <a className={styles.category} href={`#${category}`} onClick={onCategoryClick}>
              {category}
            </a>
          ))}
        </div>
        <div className={styles.layerList}>
          {uniqCategories.map((category) => (
            <Fragment>
              {layersByCategory[category].length > 0 && (
                <label id={category} className={styles.categoryLabel}>
                  {category}
                </label>
              )}
              {layersByCategory[category].map(({ previewImageUrl, name, description }) => (
                <div className={styles.layer}>
                  <div className={styles.layerContainer}>
                    <div
                      className={styles.layerImage}
                      style={{ backgroundImage: `url(${previewImageUrl})` }}
                    />
                    <div className={styles.layerContent}>
                      <h2 className={styles.layerTitle}>{getHighlightedText(name, searchQuery)}</h2>
                      <p className={styles.layerDescription}>
                        {getHighlightedText(description, searchQuery)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LayerLibrary
