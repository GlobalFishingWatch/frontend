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

// Kept separate from zipEntryToFile so callers can react to the number of matches before reading
export function findZipEntries(zipContent: JSZipObject[], filesType: RegExp) {
  return zipContent.filter((entry) => !isJunkEntry(entry) && filesType.test(entry.name))
}

export async function zipEntryToFile(entry: JSZipObject): Promise<File> {
  const data = await entry.async('arraybuffer')
  return new File([data], entry.name.split('/').pop() as string)
}

export type { JSZipObject }
