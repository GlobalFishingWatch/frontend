import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'

import {
  selectSelectedSectionId,
  selectUserGuideOpen,
  setSelectedSectionId,
  setUserGuideOpen,
} from './content.slice'
import {
  fetchUserGuideSectionById,
  fetchUserGuideSections as fetchUserGuideSectionsServerFn,
} from './strapi.serverFn'
import type { StrapiResponse, Topics, UserGuideSection } from './strapi.types'

type FetchState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

export function useUserGuideSections() {
  const { i18n } = useTranslation()
  const [state, setState] = useState<FetchState<StrapiResponse<UserGuideSection>>>({
    data: null,
    loading: false,
    error: null,
  })

  const fetchSections = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await fetchUserGuideSectionsServerFn({ data: { locale: i18n.language } })
      setState({ data, loading: false, error: null })
    } catch (error: any) {
      setState({ data: null, loading: false, error: error.message })
    }
  }, [i18n.language])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  return { ...state, refetch: fetchSections }
}

export function useUserGuideSection(sectionId: string | null) {
  const { i18n } = useTranslation()
  const [state, setState] = useState<FetchState<UserGuideSection>>({
    data: null,
    loading: false,
    error: null,
  })

  useEffect(() => {
    if (!sectionId) {
      setState({ data: null, loading: false, error: null })
      return
    }

    const fetchSection = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const data: UserGuideSection | null = await fetchUserGuideSectionById({
          data: { documentId: sectionId, locale: i18n.language },
        })
        setState({ data, loading: false, error: null })
      } catch (error: any) {
        setState({ data: null, loading: false, error: error.message })
      }
    }

    fetchSection()
  }, [sectionId, i18n.language])

  return state
}

export function useUserGuidePanel() {
  const dispatch = useAppDispatch()
  const isOpen = useSelector(selectUserGuideOpen)
  const selectedSectionId = useSelector(selectSelectedSectionId)

  const open = useCallback(() => {
    dispatch(setUserGuideOpen(true))
  }, [dispatch])

  const close = useCallback(() => {
    dispatch(setUserGuideOpen(false))
  }, [dispatch])

  const selectSection = useCallback(
    (sectionId: string | null) => {
      dispatch(setSelectedSectionId(sectionId))
    },
    [dispatch]
  )

  return {
    isOpen,
    selectedSectionId,
    open,
    close,
    selectSection,
  }
}
