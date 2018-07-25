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

      const countries = data.map((item) => {
        const newCountry = Country.create(item)

        return newCountry
      })

      countries.forEach((country) => {
        //   let match = self.countries.find(
        //     (item) => item.properties.countryName === country.countryName
        //   )

        //   if (!match) {
        self.countries.push(country)
        //   }
      })

      self.test = countries.length.toString()
    }),
  }))

const store = Store.create({})

export default makeInspectable(store)
