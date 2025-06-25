import type { ChangeEvent, FC } from 'react'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq } from 'es-toolkit'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { InputText, Spinner } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME } from 'data/config'
import type { LibraryLayer } from 'data/layer-library'
import { LIBRARY_LAYERS } from 'data/layer-library'
import { CURRENTS_DATAVIEW_SLUG } from 'data/workspaces'
import { groupDatasetsByGeometryType } from 'features/datasets/datasets.utils'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { selectDebugOptions } from 'features/debug/debug.slice'
import LayerLibraryItem from 'features/layer-library/LayerLibraryItem'
import LayerLibraryUserPanel from 'features/layer-library/LayerLibraryUserPanel'
import { selectLayerLibraryModal } from 'features/modals/modals.slice'
import { selectUserDatasets } from 'features/user/selectors/user.permissions.selectors'
import { selectIsGFWUser, selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { upperFirst } from 'utils/info'

import LayerLibraryVesselGroupPanel from './LayerLibraryVesselGroupPanel'

import styles from './LayerLibrary.module.css'

type UserSubcategory = DataviewCategory | 'bigQuery'

const LayerLibrary: FC = () => {
  const { t, ready } = useTranslation(['translations', 'layer-library'])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryElements, setCategoryElements] = useState<HTMLElement[]>([])
  const initialCategory = useSelector(selectLayerLibraryModal)
  const debugOptions = useSelector(selectDebugOptions)
  const isGFWUser = useSelector(selectIsGFWUser)
  const guestUser = useSelector(selectIsGuestUser)
  const [currentCategory, setCurrentCategory] = useState<DataviewCategory>(
    initialCategory || DataviewCategory.Activity
  )
  const [currentSubcategory, setCurrentSubcategory] = useState<UserSubcategory | null>(null)
  const userDatasets = useSelector(selectUserDatasets)
  const userGeometries = useMemo(() => {
    return groupDatasetsByGeometryType(userDatasets)
  }, [userDatasets])

  const dataviews = useSelector(selectAllDataviews)

  const layersResolved: LibraryLayer[] = useMemo(() => {
    const layers = LIBRARY_LAYERS.flatMap((layer) => {
      const dataview = dataviews.find((d) => d.slug === layer.dataviewId)
      if (!dataview) return []
      return {
        ...layer,
        name: t(`layer-library:${layer.id}.name`),
        description: t(`layer-library:${layer.id}.description`),
        moreInfoLink: t(`layer-library:${layer.id}.moreInfoLink`),
        category: (layer.category || dataview.category) as DataviewCategory,
        dataview: {
          ...dataview,
          datasetsConfig: [...(dataview.datasetsConfig || []), ...(layer.datasetsConfig || [])],
        },
      }
    })
    if (debugOptions.currentsLayer) {
      layers.push({
        id: 'currents',
        dataviewId: CURRENTS_DATAVIEW_SLUG,
        category: DataviewCategory.Environment,
        name: 'Currents prototype',
        description: 'Prototype for currents layer',
        moreInfoLink: '',
        previewImageUrl: `${PATH_BASENAME}/images/layer-library/currents.jpg`,
        dataview: {} as any,
      })
    }
    return layers
  }, [dataviews, debugOptions.currentsLayer, t])

  const uniqCategories = useMemo(
    () => uniq(layersResolved.map(({ category }) => category)),
    [layersResolved]
  )

  const extendedCategories = useMemo(() => {
    const userSubcategories = [] as UserSubcategory[]
    if (userGeometries.tracks?.length) userSubcategories.push(DataviewCategory.UserTracks)
    if (userGeometries.polygons?.length) userSubcategories.push(DataviewCategory.UserPolygons)
    if (userGeometries.points?.length) userSubcategories.push(DataviewCategory.UserPoints)
    if (userGeometries.bigQuery?.length) userSubcategories.push('bigQuery')

    return [
      ...uniqCategories.map((category) => ({ category, subcategories: [] })),
      { category: DataviewCategory.VesselGroups, subcategories: [] },
      {
        category: DataviewCategory.User,
        subcategories: userSubcategories,
      },
    ]
  }, [uniqCategories, userGeometries])

  const scrollToCategory = useCallback(
    ({
      category,
      subcategory = null,
      smooth = true,
    }: {
      category: DataviewCategory
      subcategory?: UserSubcategory | null
      smooth?: boolean
    }) => {
      const targetId = subcategory || category
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: smooth ? 'smooth' : 'instant',
        })
      }
    },
    []
  )

  useEffect(() => {
    const categoryElements = extendedCategories.flatMap(({ category, subcategories }) => {
      const mainElement = document.getElementById(category)
      const subcategoryElements = subcategories
        .map((subcat) => document.getElementById(subcat))
        .filter(Boolean)

      return [mainElement, ...subcategoryElements].filter(
        (element): element is HTMLElement => element !== null
      )
    })
    setCategoryElements(categoryElements)

    if (currentCategory) {
      scrollToCategory({ category: currentCategory, smooth: false })
    }
    // Running only when categoryElements changes as listening to currentCategory blocks the scroll
  }, [extendedCategories])

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
      filteredLayers.reduce(
        (acc, layer) => {
          if (!acc[layer.category]) {
            acc[layer.category] = []
          }
          acc[layer.category].push(layer)
          return acc
        },
        Object.fromEntries(
          uniqCategories.map((category) => [category, []] as [DataviewCategory, LibraryLayer[]])
        )
      ),
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

      const target = e.target as HTMLElement

      const topViewport = target.clientHeight / 5
      let newCategory = currentCategory
      let newSubcategory: UserSubcategory | null = null

      extendedCategories.forEach(({ category, subcategories }) => {
        const mainElement = document.getElementById(category)
        if (mainElement) {
          const { top } = mainElement.getBoundingClientRect()
          if (target.contains(mainElement) && top <= topViewport) {
            newCategory = category
          }
        }

        subcategories.forEach((subcategory) => {
          const subElement = document.getElementById(subcategory)
          if (subElement) {
            const { top } = subElement.getBoundingClientRect()
            if (target.contains(subElement) && top <= topViewport) {
              newSubcategory = subcategory
            }
          }
        })
      })

      setCurrentCategory(newCategory)
      setCurrentSubcategory(newSubcategory)
    },
    [categoryElements, currentCategory]
  )

  const onCategoryClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const category = (e.target as any).dataset.category as DataviewCategory
      const subcategory = (e.target as any).dataset.subcategory as DataviewCategory | undefined

      scrollToCategory({
        category,
        subcategory: subcategory || null,
      })
    },
    [scrollToCategory]
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
            disabled={!ready}
            autoFocus
            placeholder={t('translations:search.title')}
          />
        </div>
        <div className={styles.categories}>
          {ready &&
            extendedCategories.map(({ category, subcategories }) => (
              <div key={category}>
                <button
                  className={cx(styles.category, {
                    [styles.currentCategory]: currentCategory === category,
                  })}
                  disabled={
                    category !== DataviewCategory.User &&
                    category !== DataviewCategory.VesselGroups &&
                    layersByCategory[category].length === 0
                  }
                  data-category={category}
                  onClick={onCategoryClick}
                >
                  {t(`common.${category as DataviewCategory}`, upperFirst(category))}
                </button>
                {currentCategory === category &&
                  subcategories.length > 0 &&
                  !guestUser &&
                  subcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      className={cx(styles.subcategory, {
                        [styles.currentCategory]: currentSubcategory === subcategory,
                      })}
                      data-category={category}
                      data-subcategory={subcategory}
                      onClick={onCategoryClick}
                    >
                      {t(`dataset.type${upperFirst(subcategory)}`, upperFirst(subcategory))}
                    </button>
                  ))}
              </div>
            ))}
        </div>
      </div>
      {ready ? (
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
                return (
                  <LayerLibraryItem key={layer.id} layer={layer} highlightedText={searchQuery} />
                )
              })}
            </Fragment>
          ))}
          <LayerLibraryVesselGroupPanel searchQuery={searchQuery} />
          <LayerLibraryUserPanel searchQuery={searchQuery} />
        </ul>
      ) : (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default LayerLibrary
