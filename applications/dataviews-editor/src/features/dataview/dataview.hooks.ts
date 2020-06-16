import { useDispatch, useSelector } from 'react-redux'
import { useMemo, useState, useRef, useCallback } from 'react'
import { chain, debounce } from 'lodash'
import generatorsSchema from '@globalfishingwatch/layer-composer/dist/json-schema.json'
import { ViewParams } from '@globalfishingwatch/dataviews-client'
import { Type } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { setViewParams, EditorDataview, setType } from 'features/dataviews/dataviews.slice'
import { selectCurrentDataview } from './dataview.selectors'

interface Option {
  key: string
  value: string
  type: string
}

export const useViewParamsConnect = () => {
  const dispatch = useDispatch()
  const dataview = useSelector(selectCurrentDataview) as EditorDataview
  const currentParams = dataview.defaultView as ViewParams
  const type = currentParams.type

  // Retrieve schema to get available optiopns for type
  const { options, description } = useMemo(() => {
    const globalConfigKeys = Object.keys(
      generatorsSchema.definitions.GlobalGeneratorConfig.properties
    )
    const generatorForTypeEntry = Object.entries(generatorsSchema.definitions).find(
      (generatorEntry) => {
        const generator = generatorEntry[1] as any
        return (
          generator.properties &&
          generator.properties.type &&
          generator.properties.type.enum &&
          generator.properties.type.enum[0] === type
        )
      }
    )
    const generatorForType = generatorForTypeEntry ? (generatorForTypeEntry[1] as any) : {}
    const allOptions = generatorForType.properties
    const filteredOptions = chain(allOptions)
      // these params should not be editable by the user
      .omit(['id', 'type', 'data'].concat(globalConfigKeys))
      // we can't handdle complex paraams ie objects, dates, etc
      .omitBy((option) => !['string', 'boolean', 'number'].includes(option.type))
      .value()
    return { description: generatorForType.description, options: filteredOptions }
  }, [type])

  const optionsWithValues = options
    ? Object.entries(options).map(([key, option]) => {
        return {
          ...option,
          key,
          value: currentParams[key],
        }
      })
    : []
  // Debounce dispatching params to let user the chance to enter valid number, bools etc
  const getViewParamType = (value: string, type: string) => {
    if (type === 'boolean') return value === 'true'
    if (type === 'number') return parseFloat(value)
    return value
  }
  const [localParams, setLocalParams] = useState<null | Option[]>(null)
  const debounceRef = useRef<any>(null)
  const debouncedUpdate = useCallback(
    (newLocalParams) => {
      if (!options) return
      if (debounceRef.current) {
        debounceRef.current.cancel()
      }
      debounceRef.current = debounce(() => {
        const finalParams: Record<string, unknown> = {}
        ;(newLocalParams || []).forEach((option: Option) => {
          if (option.value) {
            // convert to proper type using schema options
            finalParams[option.key] = getViewParamType(option.value, option.type)
          }
        })
        dispatch(
          setViewParams({
            editorId: dataview.editorId,
            params: finalParams,
          })
        )
        setLocalParams(null)
      }, 1000)
      debounceRef.current()
    },
    [dataview, dispatch, options]
  )

  const setLocalParamValue = (key: string, value: string) => {
    let newLocalParams = [...optionsWithValues]
    const optionIndex = newLocalParams.findIndex((localParam) => localParam.key === key)
    const option = newLocalParams[optionIndex]

    option.value = value
    newLocalParams = [
      ...newLocalParams.slice(0, optionIndex),
      option,
      ...newLocalParams.slice(optionIndex + 1),
    ]
    setLocalParams(newLocalParams)
    debouncedUpdate(newLocalParams)
  }

  const setDataviewType = (type: Type) => {
    dispatch(setType({ editorId: dataview.editorId, type }))
    setLocalParams(null)
  }

  return {
    type,
    description,
    options: localParams ? localParams : optionsWithValues,
    setLocalParamValue,
    setDataviewType,
  }
}
