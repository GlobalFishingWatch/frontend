// Mobile Safari doesn't expose HTMLEmbedElement globally. snapdom uses `instanceof HTMLEmbedElement`
if (typeof HTMLElement !== 'undefined') {
  if (typeof globalThis.HTMLEmbedElement === 'undefined') {
    globalThis.HTMLEmbedElement =
      class HTMLEmbedElement extends HTMLElement {} as typeof HTMLEmbedElement
  }

  if (typeof globalThis.HTMLObjectElement === 'undefined') {
    globalThis.HTMLObjectElement =
      class HTMLObjectElement extends HTMLElement {} as typeof HTMLObjectElement
  }
}

if (typeof Array.prototype.toSorted !== 'function') {
  Array.prototype.toSorted = function (compareFn) {
    if (this === null) throw new TypeError('Array.prototype.toSorted called on null or undefined')
    const arr = Array.prototype.slice.call(this) // Create a shallow copy of the array
    return arr.sort(compareFn) // Sort the copied array
  }
}

if (typeof Array.prototype.findLast !== 'function') {
  Array.prototype.findLast = function (
    predicate: (value: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown
  ) {
    if (this == null) throw new TypeError('Array.prototype.findLast called on null or undefined')
    const array = this as unknown[]
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate.call(thisArg, array[i], i, array)) {
        return array[i]
      }
    }
    return undefined
  }
}

if (typeof Array.prototype.findLastIndex !== 'function') {
  Array.prototype.findLastIndex = function (
    predicate: (value: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown
  ) {
    if (this == null)
      throw new TypeError('Array.prototype.findLastIndex called on null or undefined')
    const array = this as unknown[]
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate.call(thisArg, array[i], i, array)) {
        return i
      }
    }
    return -1
  }
}
