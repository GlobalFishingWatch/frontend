import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

import { getPlaceLinkOptions } from 'features/_places/places.links'
import type { Place } from 'features/_places/places.loaders'

type PlaceLinkProps = {
  place: Place
  className?: string
  children: ReactNode
}

function PlaceLink({ place, className, children }: PlaceLinkProps) {
  return (
    <Link {...getPlaceLinkOptions(place)} className={className}>
      {children}
    </Link>
  )
}

export default PlaceLink
