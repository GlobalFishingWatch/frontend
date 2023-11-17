import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { ChangeEvent, FC, Fragment, useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { uniq } from 'lodash'
import { useSelector } from 'react-redux'
import { InputText } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { LIBRARY_LAYERS } from 'data/library-layers'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import LayerItem, { LayerResolved } from 'features/layer-library/LayerItem'
import styles from './LayerLibrary.module.css'

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
  const [categoryElements, setCategoryElements] = useState<HTMLElement[]>([])
  const [currentCategory, setCurrentCategory] = useState<DataviewCategory>(
    DataviewCategory.Activity
  )
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
          category: dataview.category as DataviewCategory,
        }
      }),
    [dataviews, t]
  )
  const uniqCategories = useMemo(
    () => uniq(layersResolved.map(({ category }) => category)),
    [layersResolved]
  )

  useLayoutEffect(() => {
    setCategoryElements(
      uniqCategories.flatMap((category) => {
        const element = document.getElementById(category)
        return element || []
      })
    )
  }, [uniqCategories])

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

  const onLayerListScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      let current = currentCategory
      categoryElements.forEach((categoryElement) => {
        if (
          (e.target as any).scrollTop >=
          categoryElement.offsetTop - (e.target as any).offsetTop
        ) {
          current = categoryElement.id as DataviewCategory
        }
      })
      setCurrentCategory(current)
    },
    [categoryElements, currentCategory]
  )

  const onCategoryClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault()
      const targetElement = categoryElements.find((element) => {
        return `#${element.id}` === (e.target as any).getAttribute('href')
      })

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
        })
      }
    },
    [categoryElements]
  )

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
            <a
              className={cx(styles.category, {
                [styles.currentCategory]: currentCategory === category,
              })}
              href={`#${category}`}
              onClick={onCategoryClick}
              key={category}
            >
              {t(`common.${category as DataviewCategory}`, category as DataviewCategory)}
            </a>
          ))}
        </div>
        <ul className={styles.layerList} onScroll={onLayerListScroll}>
          {uniqCategories.map((category) => (
            <Fragment key={category}>
              <label
                id={category}
                className={cx(styles.categoryLabel, {
                  [styles.categoryLabelHidden]: layersByCategory[category].length === 0,
                })}
              >
                {t(`common.${category as DataviewCategory}`, category as DataviewCategory)}
              </label>
              {layersByCategory[category].map((layer) => (
                <LayerItem key={layer.dataviewSlug} layer={layer} highlightedText={searchQuery} />
              ))}
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LayerLibrary
