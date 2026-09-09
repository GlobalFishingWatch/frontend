import type { JSZipObject } from 'jszip'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let JSZip: typeof import('jszip')

export function isZipFile(file?: File) {
  return (
    file?.name.endsWith('.zip') || file?.name.endsWith('.ZIP') || file?.type === 'application/zip'
  )
}

// macOS zips carry a parallel __MACOSX/._name entry per file, which never holds the real data
const isJunkEntry = ({ name, dir }: JSZipObject) =>
  dir || name.startsWith('__MACOSX') || (name.split('/').pop() ?? '').startsWith('._')

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
    return zip.file(filesType).filter((entry) => !isJunkEntry(entry))
  }

  return [] as JSZipObject[]
}

export async function zipContentToFile(
  zipContent: JSZipObject[],
  filesType: RegExp
): Promise<File | undefined> {
  const entry = zipContent.find((f) => !isJunkEntry(f) && filesType.test(f.name))
  if (!entry) {
    return undefined
  }
  const data = await entry.async('arraybuffer')
  return new File([data], entry.name.split('/').pop() as string)
}

export type { JSZipObject }
