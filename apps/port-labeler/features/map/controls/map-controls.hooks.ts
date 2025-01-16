import { useEffect, useState } from 'react'

import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'

import useMapInstance from '../map-context.hooks'
import { useViewport } from '../map-viewport.hooks'


export const useMapBounds = () => {
    const { viewport } = useViewport()
    const instance = useMapInstance()
    const [bounds, setBounds] = useState<MiniglobeBounds>(null)
    useEffect(() => {
        if (instance) {
            const rawBounds = instance.getBounds()
            if (rawBounds) {
                setBounds({
                    north: rawBounds.getNorth() as number,
                    south: rawBounds.getSouth() as number,
                    west: rawBounds.getWest() as number,
                    east: rawBounds.getEast() as number,
                })
            }
        }
    }, [viewport, instance])

    return bounds
}
