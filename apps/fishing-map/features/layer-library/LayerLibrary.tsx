import type { ChangeEvent, FC } from 'react'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq } from 'es-toolkit'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { InputText } from '@globalfishingwatch/ui-components'

import type { LibraryLayer } from 'data/layer-library'
import { LIBRARY_LAYERS } from 'data/layer-library'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import LayerLibraryItem from 'features/layer-library/LayerLibraryItem'
import LayerLibraryUserPanel from 'features/layer-library/LayerLibraryUserPanel'
import { selectLayerLibraryModal } from 'features/modals/modals.slice'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { upperFirst } from 'utils/info'

import styles from './LayerLibrary.module.css'

const LayerLibrary: FC = () => {
  const { t } = useTranslation(['translations', 'layer-library'])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryElements, setCategoryElements] = useState<HTMLElement[]>([])
  const initialCategory = useSelector(selectLayerLibraryModal)
  const isGFWUser = useSelector(selectIsGFWUser)
  const [currentCategory, setCurrentCategory] = useState<DataviewCategory>(
    initialCategory || DataviewCategory.Activity
  )
  const dataviews = useSelector(selectAllDataviews)

  const layersResolved: LibraryLayer[] = useMemo(
    () =>
      LIBRARY_LAYERS.flatMap((layer) => {
        const dataview = dataviews.find((d) => d.slug === layer.dataviewId)
        if (!dataview) return []
        return {
          ...layer,
          name: t(`layer-library:${layer.id}.name`),
          description: t(`layer-library:${layer.id}.description`),
          moreInfoLink: t(`layer-library:${layer.id}.moreInfoLink`),
          category: dataview.category as DataviewCategory,
          dataview: {
            ...dataview,
            datasetsConfig: [...(dataview.datasetsConfig || []), ...(layer.datasetsConfig || [])],
          },
        }
      }),
    [dataviews, t]
  )

  const uniqCategories = useMemo(
    () => uniq(layersResolved.map(({ category }) => category)),
    [layersResolved]
  )

  const uniqCategoriesPlusUser = useMemo(
    () => [...uniqCategories, DataviewCategory.User],
    [uniqCategories]
  )

  const scrollToCategory = useCallback(
    ({
      categoryElements,
      category,
      smooth = true,
    }: {
      categoryElements: HTMLElement[]
      category: DataviewCategory
      smooth?: boolean
    }) => {
      const targetElement = categoryElements.find((categoryElement) => {
        return categoryElement.id === category
      })
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: smooth ? 'smooth' : 'instant',
        })
      }
    },
    []
  )

  useEffect(() => {
    const categoryElements = uniqCategoriesPlusUser.flatMap((category) => {
      const element = document.getElementById(category)
      return element || []
    })
    setCategoryElements(categoryElements)
    if (currentCategory) {
      scrollToCategory({ categoryElements, category: currentCategory, smooth: false })
    }
    // Running only when categoryElements changes as listening to currentCategory blocks the scroll
  }, [uniqCategoriesPlusUser])

  const filteredLayers = useMemo(
    () =>
      layersResolved
        .filter((layer) => {
          return (
            layer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            layer.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        })
        .sort((a, b) => ((a.name?.toLowerCase() || '') < (b.name?.toLowerCase() || '') ? -1 : 1)),
    [layersResolved, searchQuery]
  )

  const layersByCategory = useMemo(
    () =>
      filteredLayers.reduce((acc, layer) => {
        if (!acc[layer.category]) {
          acc[layer.category] = []
        }
        acc[layer.category].push(layer)
        return acc
      }, Object.fromEntries(uniqCategories.map((category) => [category, []] as [DataviewCategory, LibraryLayer[]]))),
    [filteredLayers, uniqCategories]
  )

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
      categoryElements[0]?.scrollIntoView({
        behavior: 'smooth',
      })
    },
    [categoryElements]
  )

  const onLayerListScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      if (!categoryElements.length) return
      let current = currentCategory
      const target = e.target as HTMLElement
      const lastElement = categoryElements[categoryElements.length - 1]
      if (
        target.scrollTop + target.clientHeight >=
        target.scrollHeight - lastElement.clientHeight
      ) {
        //Ensure last category shows as current if visible even if it's shorter than the scroll viewport
        current = lastElement.id as DataviewCategory
      } else {
        categoryElements.forEach((categoryElement) => {
          if (target.scrollTop >= categoryElement.offsetTop - target.offsetTop) {
            current = categoryElement.id as DataviewCategory
          }
        })
      }
      setCurrentCategory(current)
    },
    [categoryElements, currentCategory]
  )

  const onCategoryClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      scrollToCategory({
        categoryElements,
        category: (e.target as any).dataset.category as DataviewCategory,
      })
    },
    [categoryElements, scrollToCategory]
  )

  return (
    <div className={styles.container}>
      <div className={styles.sidebarContainer}>
        <div className={styles.search}>
          <InputText
            onChange={onInputChange}
            value={searchQuery || ''}
            className={styles.input}
            type="search"
            autoFocus
            placeholder={t('translations:search.title', 'Search')}
          />
        </div>
        <div className={styles.categories}>
          {uniqCategoriesPlusUser.map((category) => (
            <button
              className={cx(styles.category, {
                [styles.currentCategory]: currentCategory === category,
              })}
              disabled={
                category !== DataviewCategory.User && layersByCategory[category].length === 0
              }
              data-category={category}
              onClick={onCategoryClick}
              key={category}
            >
              {t(`common.${category as DataviewCategory}`, upperFirst(category))}
            </button>
          ))}
        </div>
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
            {layersByCategory[category].map((layer) => {
              if (layer.onlyGFWUser && !isGFWUser) {
                return null
              }
              return <LayerLibraryItem key={layer.id} layer={layer} highlightedText={searchQuery} />
            })}
          </Fragment>
        ))}
        <LayerLibraryUserPanel searchQuery={searchQuery} />
      </ul>
    </div>
  )
}

export default LayerLibrary
