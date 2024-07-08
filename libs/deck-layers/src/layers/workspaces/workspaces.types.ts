import { Feature, Point } from 'geojson'
import { PickingInfo } from '@deck.gl/core'
import { DeckLayerProps } from '../../types'

export type WorkspacesLayerProps = DeckLayerProps<{}>

export type WorkspacesProperties = {
  id: string
  label: string
  category: string
  viewAccess: 'public' | 'private' | 'password'
  latitude: number
  longitude: number
  zoom: number
}

export type WorkspacesFeature = Feature<Point, WorkspacesProperties>
export type WorkspacesPickingObject = WorkspacesFeature & { category: string }

export type WorkspacesPickingInfo = PickingInfo<WorkspacesPickingObject>
