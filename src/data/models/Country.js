import { types } from 'mobx-state-tree'

const Country = types.model({
  contextReference: types.identifier,

  countryName: types.string,

  outline: types.maybe(types.string),
  border: types.maybe(types.string),
})

export default Country
