if (typeof Array.prototype.toSorted !== 'function') {
  Array.prototype.toSorted = function (compareFn) {
    if (this === null) throw new TypeError('Array.prototype.toSorted called on null or undefined')
    const arr = Array.prototype.slice.call(this) // Create a shallow copy of the array
    return arr.sort(compareFn) // Sort the copied array
  }
}
