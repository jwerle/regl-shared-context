// hash() -> String
function hash() {
  return Math.random().toString('16').slice(2).replace('.','')
}

/**
 * Wraps a regl context object with accessors providing a shared regl context
 * object. Properties are evaluated in the order in which they were defined.
 *
 * context(object: Object) -> Function|Any
 *
 * @public
 * @param {Object} object
 * @return {Object}
 * @throws TypeError
 * @see {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys#Description}
 */
function context(object) {
  if (!object || 'object' != typeof object || Array.isArray(object)) {
    throw new TypeError("shared.context(): Expecting object.")
  }
  // regl context state
  let currentReglContext = null
  let currentReglArguments = null
  let currentReglBatchId = 0
  return Object.assign(
    createContextFunction(hash(), onenter),
    createAccessors(object),
    createContextFunction(hash(), onexit))

  function onenter(reglContext, reglArguments, reglBatchId) {
    currentReglContext = reglContext
    currentReglArguments = reglArguments
    currentReglBatchId = reglBatchId
  }

  function onexit() {
    currentReglContext = null
    currentReglArguments = null
    currentReglBatchId = 0
  }

  function call(key) {
    return set(key, object[key](
      currentReglContext,
      currentReglArguments,
      currentReglBatchId))
  }

  function set(key, value) {
    return (currentReglContext[key] = value)
  }

  function createContextFunction(key, fn) {
    const object = {}
    object['__'+key+'__'] = fn
    return object
  }

  function createAccessors(object) {
    const proxy = {}
    for (const key in object) {
      Object.defineProperty(proxy, key, {
        enumerable: true,
        value: function () {
          const value = object[key]
          if ('function' == typeof value) {
            return call(key)
          } else {
            return set(key, value)
          }
        }
      })
    }
    return proxy
  }
}

module.exports = {
  context
}
