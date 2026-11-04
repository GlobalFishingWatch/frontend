const NUMBER = /^[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/
const SEPARATORS = /^[\s,]+/

// Minifiers write arc flags without separators (`a1 1 0 011.5 2`), which react-pdf's path
// parser reads as one number and turns into an Infinity transform. Re-emit the path with
// every argument separated.
export function normalizePathData(d: string) {
  const output: string[] = []
  let command = ''
  let argIndex = 0
  let rest = d
  while ((rest = rest.replace(SEPARATORS, '')).length) {
    if (/^[a-zA-Z]/.test(rest)) {
      command = rest[0]
      output.push(command)
      rest = rest.slice(1)
      argIndex = 0
      continue
    }
    // Arc arguments: rx ry rotation large-arc-flag sweep-flag x y
    const isFlag = (command === 'a' || command === 'A') && [3, 4].includes(argIndex % 7)
    const token = isFlag ? rest[0] : rest.match(NUMBER)?.[0]
    if (!token) return d
    output.push(token)
    rest = rest.slice(token.length)
    argIndex++
  }
  return output.join(' ')
}
