import type { JSZipObject } from 'jszip'
let JSZip: typeof import('jszip')

export function isZipFile(file?: File) {
  return (
    file?.name.endsWith('.zip') || file?.name.endsWith('.ZIP') || file?.type === 'application/zip'
  )
}

export async function zipToFiles(
  file: File,
  filesType: RegExp = /.*/
): Promise<JSZipObject[] | null> {
  const isZip = isZipFile(file)
  if (isZip) {
    if (!JSZip) {
      JSZip = await import('jszip').then((module) => module.default)
    }
    const zip = await JSZip.loadAsync(file)
    return zip.file(filesType)
  }

  return [] as JSZipObject[]
}

export type { JSZipObject }
