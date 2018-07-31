import { types } from 'mobx-state-tree'

const State = types.model({
  contextReference: types.identifier,

  stateName: types.string,

  outline: types.maybe(types.string),
  border: types.maybe(types.string),
})

export default State
