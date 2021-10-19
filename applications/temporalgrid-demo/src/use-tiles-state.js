import { useCallback, useState } from 'react'
import tilebelt from '@mapbox/tilebelt'

const useTileState = () => {
  const [tilesLoading, setTilesLoading] = useState({
    loading: false,
    tiles: {},
  })

  const onLoad = useCallback(
    (e) => {
      if (e.coord) {
        setTilesLoading((tilesLoading) => {
          const coords = e.coord.canonical
          const currentTiles = {
            ...tilesLoading,
            loading: true,
            tiles: {
              ...tilesLoading.tiles,
            },
          }
          if (!currentTiles.tiles[coords.key]) {
            currentTiles.tiles[coords.key] = {
              count: 0,
              geom: tilebelt.tileToGeoJSON([coords.x, coords.y, coords.z]),
            }
          }
          currentTiles.tiles[coords.key].count++
          return currentTiles
        })
      }
    },
    [setTilesLoading]
  )

  const onLoadComplete = useCallback(
    (e) => {
      if (e.coord) {
        setTilesLoading((tilesLoading) => {
          const coords = e.coord.canonical
          const currentTiles = {
            ...tilesLoading,
            loading: false,
            tiles: {
              ...tilesLoading.tiles,
            },
          }
          if (currentTiles.tiles[coords.key]) {
            currentTiles.tiles[coords.key].count--
          }
          if (currentTiles.tiles[coords.key].count <= 0) {
            delete currentTiles.tiles[coords.key]
          }
          return currentTiles
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

export default useTileState
