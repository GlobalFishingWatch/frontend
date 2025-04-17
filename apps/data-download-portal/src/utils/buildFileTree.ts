type FileNode = {
  name: string
  path: string
  isFolder: boolean
  subRows?: Record<string, FileNode>
}

export function buildFileTree(paths: string[]) {
  const root: Record<string, FileNode> = {}

  for (const fullPath of paths) {
    const parts = fullPath.split('/')
    let currentLevel = root
    let accumulatedPath = ''

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      accumulatedPath += (i > 0 ? '/' : '') + part

      if (!currentLevel[part]) {
        currentLevel[part] = {
          name: part,
          path: accumulatedPath,
          isFolder: i < parts.length - 1,
          subRows: i < parts.length - 1 ? {} : undefined,
        }
      }

      if (i < parts.length - 1) {
        currentLevel = currentLevel[part].subRows as Record<string, FileNode>
      }
    }
  }

  return root
}
