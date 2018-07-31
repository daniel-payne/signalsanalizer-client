import { types, flow } from 'mobx-state-tree'
import makeInspectable from 'mobx-devtools-mst'

import Country from './models/Country'
import State from './models/State'
import Conurbation from './models/Conurbation'
import Preference from './models/Preference'

import getCountries from './connectors/remote/getCountries'

import getCountry from './connectors/remote/getCountry'
import getStates from './connectors/remote/getStates'
import getConurbations from './connectors/remote/getConurbations'

import getCounties from './connectors/remote/getCounties'
import getPlaces from './connectors/remote/getPlaces'

const Store = types
  .model({
    test: types.maybe(types.string),

    countries: types.optional(types.array(Country), []),
    states: types.optional(types.array(State), []),

    selectedCountry: types.maybe(types.reference(Country)),

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
    loadCountry: flow(function* loadCountry(contextReference) {
      const data = yield getCountry(contextReference)

      const country = self.countries.find(
        (country) => country.contextReference === contextReference
      )

      if (country) {
        country.border = data[0].border

        self.selectedCountry = country
      } else {
        const newCountry = Country.create(data[0])

        self.countries.push(newCountry)

        self.selectedCountry = newCountry
      }
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
    loadConurbations: flow(function* loadConurbations(contextReference) {
      const data = yield getConurbations(contextReference)

      const newConurbations = data.map((item) => {
        const newConurbation = Conurbation.create(item)

        return newConurbation
      })

      newConurbations.forEach((newConurbation) => {
        self.conurbations.push(newConurbations)
      })
    }),
  }))

const store = Store.create({})

export default makeInspectable(store)
