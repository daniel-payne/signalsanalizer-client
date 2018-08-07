import { types, flow } from 'mobx-state-tree'

import getCountries from '../connectors/remote/getCountries'
import getCountry from '../connectors/remote/getCountry'
import getCurrentMarkers from '../connectors/remote/getCurrentMarkers'

import Country from './Country'
import Marker from './Marker'

const Globe = types
  .model({
    outline: types.maybe(types.string),

    countries: types.optional(types.array(Country), []),
    markers: types.optional(types.array(Marker), []),

    selectedCountry: types.maybe(types.reference(Country)),

    isCountriesLoaded: types.optional(types.boolean, false),
    isCurrentMarkersLoaded: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    loadCurrentMarkers: flow(function* loadCurrentMarkers() {
      if (self.isCurrentMarkersLoaded === true) {
        return
      }

      const data = yield getCurrentMarkers()

      const newMarkers = data.map((item) => {
        const newMarker = Marker.create(item)

        return newMarker
      })

      //newMarkers.forEach((newMarker) => {
      //const oldMarker = self.markers.find((marker) => marker.eventId === newMarker.eventId)

      //if (!oldMarker) {
      //self.markers.push(newMarker)
      //}
      //})

      self.markers.push(...newMarkers)

      self.isCurrentMarkersLoaded = true
    }),
    loadCountries: flow(function* loadCountries() {
      if (self.isCountriesLoaded === true) {
        return
      }

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

      self.isCountriesLoaded = true
    }),
    chooseCountry: flow(function* loadCountry(contextReference) {
      const country = self.countries.find((country) => country.contextReference === contextReference)

      if (country && country.border) {
        self.selectedCountry = country

        return
      }

      const data = yield getCountry(contextReference)

      if (country) {
        country.border = data[0].border

        self.selectedCountry = country
      } else {
        const newCountry = Country.create(data[0])

        self.countries.push(newCountry)

        self.selectedCountry = newCountry
      }

      self.selectedCountry.states.forEach((state) => {
        state.loadConurbations()
      })
    }),
    deSelect: function deSelect() {
      if (self.selectedCountry) {
        self.selectedCountry.deSelect()
      }

      self.selectedCountry = undefined
    },
  }))

export default Globe
