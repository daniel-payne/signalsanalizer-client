import { types } from 'mobx-state-tree'

const Country = types.model({
  geometry: types.model({
    type: types.string,

    cooridnates: types.array(types.array(types.array(types.number))),

    properties: types.maybe(
      types.model({
        countryName: types.maybe(types.string),
      })
    ),
  }),
})

export default Country
