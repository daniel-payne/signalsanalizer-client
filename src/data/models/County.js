import { types } from 'mobx-state-tree'

const County = types.model({
  countyName: types.string,
  contextReference: types.string,
  simpleWKT: types.string,
})

export default County
