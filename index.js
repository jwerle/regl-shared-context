const { defineProperty, assign } = Object

/**
 * hash() -> String
 */
const hash = () => Math.random().toString('16').slice(2).replace('.','')

/**
 * define(object: Object, key: String, descriptor: Object) -> Object
 */

const define = (object, key, descriptor) => {
  return defineProperty(object, key, assign({enumerable: true}, descriptor))
}

/**
 * context(object: Object) -> Function|Any
 */
function context(object) {
  if (!object || 'object' != typeof object) {
    throw new TypeError("shared.context(): Expecting object.")
  }
  let currentReglContext = null
  let currentReglArguments = null
  let currentReglBatchId = 0
  const entranceKey = hash()
  const exitKey = hash()
  return assign(
    {[`__${entranceKey}__`]: enter},
    createAccessors(object),
    {[`__${exitKey}__`]: exit},
  )

  function enter(reglContext, reglArguments, reglBatchId) {
    currentReglContext = reglContext
    currentReglArguments = reglArguments
    currentReglBatchId = reglBatchId
  }

  function exit() {
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

  function createAccessors(object) {
    const proxy = {}
    for (const key in object) {
      define(proxy, key, {
        get() {
          return () => {
            const value = object[key]
            if ('function' == typeof value) {
              return call(key)
            } else {
              return set(key, value)
            }
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
