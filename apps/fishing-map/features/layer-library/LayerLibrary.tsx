import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { ChangeEvent, FC, Fragment, useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { uniq } from 'lodash'
import { useSelector } from 'react-redux'
import { InputText } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { LIBRARY_LAYERS } from 'data/library-layers'
import { upperFirst } from 'utils/info'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import LayerLibraryItem, { LayerResolved } from 'features/layer-library/LayerLibraryItem'
import { selectLayerLibraryModal } from 'features/modals/modals.slice'
import styles from './LayerLibrary.module.css'

const LayerLibrary: FC = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryElements, setCategoryElements] = useState<HTMLElement[]>([])
  const initialCategory = useSelector(selectLayerLibraryModal)
  const [currentCategory, setCurrentCategory] = useState<DataviewCategory>(
    initialCategory || DataviewCategory.Activity
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

  const scrollToCategory = useCallback(
    (categoryElements: HTMLElement[], category: DataviewCategory) => {
      const targetElement = categoryElements.find((categoryElement) => {
        return categoryElement.id === category
      })
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
        })
      }
    },
    []
  )

  useLayoutEffect(() => {
    const categoryElements = uniqCategories.flatMap((category) => {
      const element = document.getElementById(category)
      return element || []
    })
    setCategoryElements(categoryElements)
    if (currentCategory) {
      scrollToCategory(categoryElements, currentCategory)
    }
    // Running only when categoryElements changes as listening to currentCategory blocks the scroll
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      scrollToCategory(categoryElements, (e.target as any).dataset.category as DataviewCategory)
    },
    [categoryElements, scrollToCategory]
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
            <button
              className={cx(styles.category, {
                [styles.currentCategory]: currentCategory === category,
              })}
              disabled={layersByCategory[category].length === 0}
              data-category={category}
              onClick={onCategoryClick}
              key={category}
            >
              {t(`common.${category as DataviewCategory}`, upperFirst(category))}
            </button>
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
                {t(`common.${category as DataviewCategory}`, upperFirst(category))}
              </label>
              {layersByCategory[category].map((layer) => (
                <LayerLibraryItem
                  key={layer.dataviewSlug}
                  layer={layer}
                  highlightedText={searchQuery}
                />
              ))}
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LayerLibrary
