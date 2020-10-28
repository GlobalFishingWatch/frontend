import { useCallback, useState } from 'react'
import tilebelt from '@mapbox/tilebelt'

type TilesLoading = {
  loading: boolean
  tiles: Record<string, { count: number; geom: any }>
}

type LoadEvent = {
  coord: {
    canonical: {
      key: string
      x: number
      y: number
      z: number
    }
  }
}
export default () => {
  const [tilesLoading, setTilesLoading] = useState<TilesLoading>({
    loading: false,
    tiles: {},
  })

  const onLoad = useCallback(
    (e: LoadEvent) => {
      if (e.coord) {
        setTilesLoading((tilesLoading) => {
          const { key, x, y, z } = e.coord.canonical
          const {
            [key]: currentTile = {
              count: 0,
              geom: tilebelt.tileToGeoJSON([x, y, z]),
            },
            ...rest
          } = tilesLoading.tiles
          // currentTile.count = currentTile.count +1
          return {
            loading: true,
            tiles: {
              ...rest,
              [key]: {
                ...currentTile,
                count: currentTile.count + 1,
              },
            },
          }
        })
      }
    },
    [setTilesLoading]
  )

  const onLoadComplete = useCallback(
    (e: LoadEvent) => {
      if (e.coord) {
        setTilesLoading((tilesLoading) => {
          const { key } = e.coord.canonical
          const { [key]: currentTile, ...rest } = tilesLoading.tiles
          const otherTilesLoading = Object.keys(rest).length > 0
          const currentTileLoading = currentTile?.count - 1 > 0
          return {
            loading: otherTilesLoading || currentTileLoading,
            tiles: {
              ...rest,
              ...(currentTileLoading && {
                [key]: {
                  ...currentTile,
                  count: currentTile.count - 1,
                },
              }),
            },
          }
        })
      }
    },
    [setTilesLoading]
  )

  return {
    onLoad,
    onLoadComplete,
    tilesLoading,
  }
}
