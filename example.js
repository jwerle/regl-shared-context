const shared = require('./')
const regl = require('regl')()

const query = regl({
  context: shared.context({
    subject: ({}, {subject}) => subject,
    predicate: ({}, {predicate}) => predicate,
    object: ({}, {object}) => object,

    output({subject, predicate, object}) {
      return `${subject} ${predicate} ${object}`
    }
  })
})

query({subject: 'bradley', predicate: 'is a', object: 'kinkajou'}, ({output}) => {
  document.write(output + '\n')
  console.log(output);
})
