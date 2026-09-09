import JSZip from 'jszip'
import { describe, expect, it } from 'vitest'

import { zipContentToFile } from './zip-to-files'

const zipContent = async (build: (zip: JSZip) => void) => {
  const zip = new JSZip()
  build(zip)
  const buffer = await zip.generateAsync({ type: 'arraybuffer' })
  return (await JSZip.loadAsync(buffer)).file(/.*/)
}

describe('zipContentToFile', () => {
  it('extracts the matching entry, ignoring the macOS junk copy', async () => {
    const content = await zipContent((zip) => {
      zip.file('__MACOSX/._sst.tif', 'junk')
      zip.file('data/sst.tif', 'II* fake-geotiff-bytes')
    })
    const file = await zipContentToFile(content, /\.(tif|tiff)$/i)
    expect(file?.name).toBe('sst.tif')
    expect(await file?.text()).toBe('II* fake-geotiff-bytes')
  })

  it('matches regardless of extension case', async () => {
    const content = await zipContent((zip) => zip.file('DATA.CSV', 'a,b'))
    expect((await zipContentToFile(content, /\.(csv|tsv)$/i))?.name).toBe('DATA.CSV')
  })

  it('returns undefined when no entry matches', async () => {
    const content = await zipContent((zip) => zip.file('readme.txt', 'hi'))
    expect(await zipContentToFile(content, /\.(tif|tiff)$/i)).toBeUndefined()
  })
})
