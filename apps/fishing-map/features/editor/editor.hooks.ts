import { useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectEditorActive, toggleEditorMenu } from 'features/editor/editor.slice'
import { selectUserWorkspaceEditPermissions } from 'features/user/user.selectors'

type EditorMenu = {
  editorActive: boolean
  dispatchToggleEditorMenu: () => void
}

const useEditorMenu = (): EditorMenu => {
  const dispatch = useDispatch()
  const hasEditPermission = useSelector(selectUserWorkspaceEditPermissions)
  const numTimesEditorKeyDown = useRef(0)
  const editorKeyDownInterval = useRef<number>(0)

  const dispatchToggleEditorMenu = useCallback(() => {
    dispatch(toggleEditorMenu())
  }, [dispatch])

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'e' || event.key === 'E') {
        window.clearTimeout(editorKeyDownInterval.current)
        numTimesEditorKeyDown.current++
        editorKeyDownInterval.current = window.setTimeout(() => {
          numTimesEditorKeyDown.current = 0
        }, 2000)
      }
      if (numTimesEditorKeyDown.current === 7) {
        dispatchToggleEditorMenu()
        numTimesEditorKeyDown.current = 0
      }
    },
    [dispatchToggleEditorMenu, numTimesEditorKeyDown]
  )

  useEffect(() => {
    if (hasEditPermission) {
      document.addEventListener('keydown', onKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [hasEditPermission, onKeyDown])

  const editorActive = useSelector(selectEditorActive)
  return { editorActive, dispatchToggleEditorMenu }
}

export default useEditorMenu
