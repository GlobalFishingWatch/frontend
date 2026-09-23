import JSZip from 'jszip'
import { describe, expect, it } from 'vitest'

import { findZipEntries, zipEntryToFile } from './zip-to-files'

const zipContent = async (build: (zip: JSZip) => void) => {
  const zip = new JSZip()
  build(zip)
  const buffer = await zip.generateAsync({ type: 'arraybuffer' })
  return (await JSZip.loadAsync(buffer)).file(/.*/)
}

describe('findZipEntries', () => {
  it('matches one entry, ignoring the macOS junk copy', async () => {
    const content = await zipContent((zip) => {
      zip.file('__MACOSX/._sst.tif', 'junk')
      zip.file('data/sst.tif', 'II* fake-geotiff-bytes')
    })
    const entries = findZipEntries(content, /\.(tif|tiff)$/i)
    expect(entries.map((entry) => entry.name)).toEqual(['data/sst.tif'])
  })

  it('matches regardless of extension case', async () => {
    const content = await zipContent((zip) => zip.file('DATA.CSV', 'a,b'))
    expect(findZipEntries(content, /\.(csv|tsv)$/i)).toHaveLength(1)
  })

  it('returns every match so callers can reject an ambiguous zip', async () => {
    const content = await zipContent((zip) => {
      zip.file('sst.tif', 'a')
      zip.file('nested/chl.tiff', 'b')
    })
    expect(findZipEntries(content, /\.(tif|tiff)$/i)).toHaveLength(2)
  })

  it('returns nothing when no entry matches', async () => {
    const content = await zipContent((zip) => zip.file('readme.txt', 'hi'))
    expect(findZipEntries(content, /\.(tif|tiff)$/i)).toEqual([])
  })
})

describe('zipEntryToFile', () => {
  it('reads the entry into a File named after its basename', async () => {
    const content = await zipContent((zip) => zip.file('data/sst.tif', 'II* fake-geotiff-bytes'))
    const file = await zipEntryToFile(content[0])
    expect(file.name).toBe('sst.tif')
    expect(await file.text()).toBe('II* fake-geotiff-bytes')
  })
})
