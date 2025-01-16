import { useCallback } from "react"
import { useDispatch } from "react-redux"

import { changePointValue, changePortValue, changeSubareaValue } from "features/labeler/labeler.slice"

type ValueManager = {
    onPointValueChange: (id: string, value: string) => void
    onSubareaChange: (id: string, value: string) => void
    onPortChange: (id: string, value: string) => void

}
export function useValueManagerConnect(): ValueManager {
    const dispatch = useDispatch()

    const onPointValueChange = useCallback((id, value) => {
        dispatch(changePointValue({ id, value }))
    }, [dispatch])

    const onSubareaChange = useCallback((id, value) => {
        dispatch(changeSubareaValue({ id, value }))
    }, [dispatch])

    const onPortChange = useCallback((id, value) => {
        dispatch(changePortValue({ id, value }))
    }, [dispatch])

    return {
        onPointValueChange,
        onSubareaChange,
        onPortChange
    }
}