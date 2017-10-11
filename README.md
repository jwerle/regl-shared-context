regl-shared-context
===================

Share regl context variables in the same context

## Install

```sh
$ npm install regl-shared-context
```

## Usage

```js
const shared = require('regl-shared-context')
const regl = require('regl')()
regl({
  context: shared.context({
    first() { return 'first' },
    second() { return 'second' },
    third() { return 'third' },
    output({first, second, third}) {
      return `${first} ${second} ${third}`
    },
  })
})({output}) => {
  console.log(output) // 'first second third'
})
```

## Why ?

When context variables are computed, the parent scope context is exposed
to dynamic properties. This module allows local context properties to be
exposed and shared between each other without the need to create
multiple regl commands.

## API

### shared.context(object: Object) -> Object

This function accepts an object that should be used for the `context`
property of the regl command constructor. It wraps a regl context object
with accessors providing a shared regl context object. Properties are
evaluated in the order in which they were defined.

```js
const command = regl({
  context: shared.context({
    valueA: 123,
    valueB: ({valueA}) => valueB // 123
  })
})
```

## License

MIT
