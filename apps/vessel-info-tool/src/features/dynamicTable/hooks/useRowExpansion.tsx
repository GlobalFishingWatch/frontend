import { useCallback, useState } from 'react'
import type { Row } from '@tanstack/react-table'

export function useRowExpansion<T extends Record<string, any>>(
  checkCanExpand?: (row: Row<T>) => Promise<boolean>,
  onExpandRow?: (row: T) => Promise<any>
) {
  const [expandedRows, setExpandedRows] = useState<Record<string, any>>({})
  const [loadingExpansions, setLoadingExpansions] = useState<Set<string>>(new Set())

  const canExpand = useCallback(
    async (row: T): Promise<boolean> => {
      if (!checkCanExpand || !row.id) return false

      try {
        return await checkCanExpand(row.id)
      } catch (error) {
        console.error('Error checking row expansion:', error)
        return false
      }
    },
    [checkCanExpand]
  )

  const toggleExpansion = useCallback(
    async (row: T) => {
      const rowId = row.id
      if (!rowId) return

      if (expandedRows[rowId]) {
        setExpandedRows((prev) => {
          const { [rowId]: removed, ...rest } = prev
          return rest
        })
        return
      }

      const canExp = await canExpand(row)
      if (!canExp) return

      setLoadingExpansions((prev) => new Set([...prev, rowId]))

      try {
        if (onExpandRow) {
          const expandedData = await onExpandRow(row)
          setExpandedRows((prev) => ({
            ...prev,
            [rowId]: expandedData,
          }))
        }
      } catch (error) {
        console.error('Error expanding row:', error)
      } finally {
        setLoadingExpansions((prev) => {
          const newSet = new Set(prev)
          newSet.delete(rowId)
          return newSet
        })
      }
    },
    [expandedRows, canExpand, onExpandRow]
  )

  return {
    expandedRows,
    loadingExpansions,
    toggleExpansion,
    canExpand,
  }
}
