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
  {
    id: '2m-temp',
    label: 'Dewpoint temperature at 2m height (daily average)',
    image: PrecipitationImage,
    description: 'ERA5 is the fifth generation ECMWF atmospheric reanalysis of the global climate',
    category: LibraryDatasetCategory.gee,
    tags: ['climate', 'dlr', 'cloud'],
  },
]

const gfwDatasets: LibraryDataset[] = []

const libraryDatasets = [...geeDatasets, ...gfwDatasets]

export default libraryDatasets
