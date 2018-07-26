import { types, flow } from 'mobx-state-tree'
import makeInspectable from 'mobx-devtools-mst'

import Country from './models/Country'
import Preference from './models/Preference'

import getCountries from './connectors/remote/getCountries'

const Store = types
  .model({
    test: types.maybe(types.string),

    countries: types.optional(types.array(Country), []),

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
  }))

const store = Store.create({})

export default makeInspectable(store)
