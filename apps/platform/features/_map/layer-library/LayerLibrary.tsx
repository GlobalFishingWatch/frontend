import type { ChangeEvent, FC } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq } from 'es-toolkit'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { InputText, Spinner } from '@globalfishingwatch/ui-components'

import type { LibraryLayer } from 'data/map/layer-library'
import { fetchAllDatasetsThunk } from 'features/_map/datasets/datasets.slice'
import { getDatasetLabel, groupDatasetsByGeometryType } from 'features/_map/datasets/datasets.utils'
import { selectAllDataviews } from 'features/_map/dataviews/dataviews.slice'
import { resolveLibraryLayers } from 'features/_map/layer-library/LayerLibrary.utils'
import LayerLibraryItem from 'features/_map/layer-library/LayerLibraryItem'
import LayerLibraryUserPanel from 'features/_map/layer-library/LayerLibraryUserPanel'
import { selectUserDatasets } from 'features/_user/selectors/user.permissions.selectors'
import { selectIsGFWUser, selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import { selectAllVisibleVesselGroups } from 'features/_user/vessel-groups/vessel-groups.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectLayerLibraryModal,
  selectLayerLibraryUniqueCategory,
} from 'features/modals/modals.slice'
import { upperFirst } from 'utils/info'

import LayerLibraryVesselGroupPanel from './LayerLibraryVesselGroupPanel'

import styles from './LayerLibrary.module.css'

const SEARCH_MIN_CHARS = 3

// gridded has no DataviewCategory of its own — it is a geometry type of the user datasets
type UserSubcategory = DataviewCategory | 'bigQuery' | 'gridded'

const LayerLibrary: FC = () => {
  const { t, ready: i18nReady } = useTranslation(['translations', 'layer-library'])
  const [searchQuery, setSearchQuery] = useState('')
  const initialCategory = useSelector(selectLayerLibraryModal)
  const layerLibraryUniqueCategory = useSelector(selectLayerLibraryUniqueCategory)
  const isGFWUser = useSelector(selectIsGFWUser)
  const guestUser = useSelector(selectIsGuestUser)
  const [currentCategory, setCurrentCategory] = useState<DataviewCategory>(
    initialCategory || DataviewCategory.Activity
  )
  const [currentSubcategory, setCurrentSubcategory] = useState<UserSubcategory | null>(null)
  const categoryElementsRef = useRef<HTMLElement[]>([])
  const dispatch = useAppDispatch()
  const userDatasets = useSelector(selectUserDatasets)
  const allVesselGroups = useSelector(selectAllVisibleVesselGroups)
  const [userDatasetsFetched, setUserDatasetsFetched] = useState(false)
  const userDatasetsLoaded = Boolean(guestUser) || userDatasetsFetched

  useEffect(() => {
    if (guestUser) {
      return
    }
    dispatch(fetchAllDatasetsThunk()).finally(() => setUserDatasetsFetched(true))
  }, [dispatch, guestUser])

  const userGeometries = useMemo(() => {
    return groupDatasetsByGeometryType(userDatasets)
  }, [userDatasets])

  const dataviews = useSelector(selectAllDataviews)

  const layersResolved: LibraryLayer[] = useMemo(() => {
    if (!i18nReady) {
      return []
    }
    return resolveLibraryLayers(dataviews)
  }, [dataviews, i18nReady])

  const uniqCategories = useMemo(() => {
    if (layerLibraryUniqueCategory) {
      const layerResolved = layersResolved.find(({ category }) => category === initialCategory)
      return layerResolved ? [layerResolved.category] : []
    }
    const categories = uniq(layersResolved.map(({ category }) => category))
    const eventsIndex = categories.indexOf(DataviewCategory.Events)
    if (eventsIndex !== -1) {
      categories.splice(eventsIndex + 1, 0, DataviewCategory.VesselGroups)
    }
    return categories
  }, [layersResolved, layerLibraryUniqueCategory, initialCategory])

  const extendedCategories = useMemo(() => {
    if (layerLibraryUniqueCategory) {
      return [...uniqCategories.map((category) => ({ category, subcategories: [] }))]
    }
    const userSubcategories = [] as UserSubcategory[]
    // Until the fetch resolves the store only holds the datasets the workspace happened to load, so
    // showing subcategories now means a partial list that grows as the request lands
    if (userDatasetsLoaded) {
      if (userGeometries.tracks?.length) userSubcategories.push(DataviewCategory.UserTracks)
      if (userGeometries.polygons?.length) userSubcategories.push(DataviewCategory.UserPolygons)
      if (userGeometries.points?.length) userSubcategories.push(DataviewCategory.UserPoints)
      if (userGeometries.gridded?.length) userSubcategories.push('gridded')
      if (userGeometries.bigQuery?.length) userSubcategories.push('bigQuery')
    }

    return [
      ...uniqCategories.map((category) => ({ category, subcategories: [] })),
      {
        category: DataviewCategory.User,
        subcategories: userSubcategories,
      },
    ]
  }, [uniqCategories, userGeometries, layerLibraryUniqueCategory, userDatasetsLoaded])

  const allCategories = useMemo(() => {
    return extendedCategories.map(({ category }) => category)
  }, [extendedCategories])

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
    categoryElementsRef.current = extendedCategories.flatMap(({ category, subcategories }) => {
      const mainElement = document.getElementById(category)
      const subcategoryElements = subcategories
        .map((subcat) => document.getElementById(subcat))
        .filter(Boolean)

      return [mainElement, ...subcategoryElements].filter(
        (element): element is HTMLElement => element !== null
      )
    })

    if (currentCategory) {
      scrollToCategory({ category: currentCategory, smooth: false })
    }
  }, [extendedCategories])

  const filteredLayers = useMemo(
    () =>
      layersResolved
        .filter((layer) => {
          if (searchQuery.length < SEARCH_MIN_CHARS) return true
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
  const activeSearchQuery = searchQuery.length >= SEARCH_MIN_CHARS ? searchQuery : ''

  const vesselGroupsMatchCount = useMemo(
    () =>
      activeSearchQuery
        ? allVesselGroups.filter((vg) =>
            getDatasetLabel(vg).toLowerCase().includes(activeSearchQuery.toLowerCase())
          ).length
        : allVesselGroups.length,
    [allVesselGroups, activeSearchQuery]
  )

  const userDatasetsMatchCount = useMemo(
    () =>
      activeSearchQuery
        ? userDatasets.filter((d) =>
            getDatasetLabel(d).toLowerCase().includes(activeSearchQuery.toLowerCase())
          ).length
        : userDatasets.length,
    [userDatasets, activeSearchQuery]
  )

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    categoryElementsRef.current[0]?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [])

  const onLayerListScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      if (!categoryElementsRef.current.length) return

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
    [currentCategory, extendedCategories]
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
            type="search"
            disabled={!i18nReady}
            placeholder={t((t) => t.search.title, {
              ns: 'translations',
            })}
          />
        </div>
        <div className={styles.categories}>
          {i18nReady &&
            extendedCategories
              .filter(
                ({ category }) =>
                  searchQuery.length < SEARCH_MIN_CHARS ||
                  (category === DataviewCategory.User && userDatasetsMatchCount > 0) ||
                  (category === DataviewCategory.VesselGroups && vesselGroupsMatchCount > 0) ||
                  layersByCategory[category]?.length > 0
              )
              .map(({ category, subcategories }) => (
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
                    {t((t: any) => t.common[category as DataviewCategory], {
                      defaultValue: category,
                    })}
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
                        {t((t: any) => t.dataset.type[upperFirst(subcategory)], {
                          defaultValue: upperFirst(subcategory),
                        })}
                      </button>
                    ))}
                </div>
              ))}
        </div>
      </div>
      {i18nReady ? (
        <ul className={styles.layerList} onScroll={onLayerListScroll}>
          {uniqCategories
            .filter(
              (category) =>
                searchQuery.length < SEARCH_MIN_CHARS ||
                (category === DataviewCategory.VesselGroups && vesselGroupsMatchCount > 0) ||
                layersByCategory[category]?.length > 0
            )
            .map((category) =>
              category === DataviewCategory.VesselGroups ? (
                <div key={DataviewCategory.VesselGroups} className={styles.categoryContainer}>
                  <LayerLibraryVesselGroupPanel searchQuery={activeSearchQuery} />
                </div>
              ) : (
                <div key={category} className={styles.categoryContainer}>
                  <label
                    id={category}
                    className={cx(styles.categoryLabel, {
                      [styles.categoryLabelHidden]: layersByCategory[category].length === 0,
                    })}
                  >
                    {t((t: any) => t.common[category as DataviewCategory], {
                      defaultValue: category,
                    })}
                  </label>
                  {layersByCategory[category].map((layer) => {
                    if (layer.onlyGFWUser && !isGFWUser) {
                      return null
                    }
                    return (
                      <LayerLibraryItem
                        key={layer.id}
                        layer={layer}
                        highlightedText={activeSearchQuery}
                      />
                    )
                  })}
                </div>
              )
            )}
          {allCategories.includes(DataviewCategory.User) &&
            (searchQuery.length < SEARCH_MIN_CHARS || userDatasetsMatchCount > 0) && (
              <div className={styles.categoryContainer}>
                <LayerLibraryUserPanel
                  searchQuery={activeSearchQuery}
                  datasetsLoaded={userDatasetsLoaded}
                />
              </div>
            )}
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
