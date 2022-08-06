import { StaticImageData } from 'next/image'
import PrecipitationImage from 'assets/images/datasets/precipitation.jpg'

export enum LibraryDatasetCategory {
  gee = 'Google Earth Engine',
  gfw = 'Global Fishing Watch',
}

export type LibraryDataset = {
  id: string
  label: string
  image: StaticImageData
  description: string
  category: LibraryDatasetCategory
  tags?: string[]
}

const geeDatasets: LibraryDataset[] = [
  {
    id: 'precipitation',
    label: 'Total precipitation (Daily sums)',
    image: PrecipitationImage,
    description: 'ERA5 provides aggregated values for each day',
    category: LibraryDatasetCategory.gee,
    tags: ['climate', 'esa', 'eu'],
  },
]

const gfwDatasets: LibraryDataset[] = []

const libraryDatasets = [...geeDatasets, ...gfwDatasets]

export default libraryDatasets
