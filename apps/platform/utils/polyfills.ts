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

// Chrome < 92 / Safari < 15.4, both inside the client build target (see vite.config.ts)
if (typeof Array.prototype.at !== 'function') {
  Array.prototype.at = function (index: number) {
    const i = Math.trunc(index) || 0
    return this[i < 0 ? this.length + i : i]
  }
}

// Chrome < 93 / Safari < 15.4
if (typeof Object.hasOwn !== 'function') {
  Object.hasOwn = (object: object, key: PropertyKey) =>
    Object.prototype.hasOwnProperty.call(object, key)
}

// Browser page translation (Safari, the Google app, Google Translate) swaps React-owned text nodes
// for its own `<font>` wrappers. React then calls removeChild/insertBefore with a node that is no
// longer a child of that parent, the DOM throws `NotFoundError` and the router error boundary
// replaces the page (FRONTEND-84). React does not handle this (facebook/react#11538), so skip the
// call instead of throwing. Cost: a translated node React wanted to remove can stay on screen.
if (typeof Node === 'function') {
  const removeChild = Node.prototype.removeChild
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      console.warn('removeChild skipped: node has a different parent', child, this)
      return child
    }
    return removeChild.call(this, child) as T
  }

  const insertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    node: T,
    reference: Node | null
  ): T {
    if (reference && reference.parentNode !== this) {
      console.warn('insertBefore skipped: reference has a different parent', reference, this)
      return node
    }
    return insertBefore.call(this, node, reference) as T
  }
}
