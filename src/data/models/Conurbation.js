import { types } from 'mobx-state-tree'

const Conurbation = types.model({
  contextReference: types.identifier,

  conurbationName: types.string,

  border: types.maybe(types.string),
})

export default Conurbation
