import { types, flow } from 'mobx-state-tree'
import makeInspectable from 'mobx-devtools-mst'

import Country from './models/Country'
import State from './models/State'
import Preference from './models/Preference'

import getCountries from './connectors/remote/getCountries'
import getStates from './connectors/remote/getStates'
import getConurbations from './connectors/remote/getConurbations'
import getCounties from './connectors/remote/getCounties'
import getPlaces from './connectors/remote/getPlaces'

const Store = types
  .model({
    test: types.maybe(types.string),

    countries: types.optional(types.array(Country), []),
    states: types.optional(types.array(State), []),

    preference: types.optional(Preference, {}),
  })
  .actions((self) => ({
    chooseCountry(country) {},
  }))
  .actions((self) => ({
    loadCountries: flow(function* loadCountries() {
      const data = yield getCountries()

      const newCountries = data.map((item) => {
        const newCountry = Country.create(item)

        return newCountry
      })

      newCountries.forEach((newCountry) => {
        self.countries.push(newCountry)
      })
    }),
    loadStates: flow(function* loadStates(contextReference) {
      const data = yield getStates(contextReference)

      const newStates = data.map((item) => {
        const newState = State.create(item)

        return newState
      })

      newStates.forEach((newState) => {
        self.states.push(newState)
      })
    }),
  }))

const store = Store.create({})

export default makeInspectable(store)
