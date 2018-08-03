import { types, flow } from 'mobx-state-tree'

import getCountries from '../connectors/remote/getCountries'
import getCountry from '../connectors/remote/getCountry'

import Country from './Country'

const Globe = types
  .model({
    outline: types.maybe(types.string),

    countries: types.optional(types.array(Country), []),

    selectedCountry: types.maybe(types.reference(Country)),
  })
  .actions((self) => ({
    loadCountries: flow(function* loadCountries() {
      const data = yield getCountries()

      const newCountries = data.map((item) => {
        const newCountry = Country.create(item)

        return newCountry
      })

      newCountries.forEach((newCountry) => {
        const oldCountry = self.countries.find((country) => country.contextReference === newCountry.contextReference)

        if (oldCountry) {
          oldCountry.countryName = newCountry.countryName

          oldCountry.outline = newCountry.outline
        } else {
          self.countries.push(newCountry)
        }
      })
    }),
    chooseCountry: flow(function* loadCountry(contextReference) {
      const country = self.countries.find((country) => country.contextReference === contextReference)

      if (country && country.border) {
        self.selectedCountry = country
      } else {
        const data = yield getCountry(contextReference)

        if (country) {
          country.border = data[0].border

          self.selectedCountry = country
        } else {
          const newCountry = Country.create(data[0])

          self.countries.push(newCountry)

          self.selectedCountry = newCountry
        }
      }
    }),
  }))

export default Globe
