import { types } from 'mobx-state-tree'

const County = types.model({
  contextReference: types.identifier,

  countyName: types.string,

  outline: types.maybe(types.string),
  border: types.maybe(types.string),
})

export default County
