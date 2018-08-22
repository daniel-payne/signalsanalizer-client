import { types, flow } from 'mobx-state-tree'
import makeInspectable from 'mobx-devtools-mst'

import Globe from './models/Globe'
import Country from './models/Country'
import State from './models/State'
import Conurbation from './models/Conurbation'
import County from './models/County'

// import getGlobe from './connectors/remote/getGlobe'

import { extractContextCountry, extractContextState, extractContextConurbation, extractContextCounty } from './common'

export const DAY = 'DAY'
export const WEEK = 'WEEK'
export const MONTH = 'MONTH'
export const YEAR = 'YEAR'
export const YEARS_5 = 'YEARS_5'
export const YEARS_10 = 'YEARS_10'
export const YEARS_25 = 'YEARS_25'
export const SINCE_1970 = 'SINCE_1970'

export const TIME_PERIODS = [DAY, WEEK, MONTH, YEAR, YEARS_5, YEARS_10, YEARS_25, SINCE_1970]

export const DATA = 'DATA'
export const GLOBE = 'GLOBE'
export const MAP = 'MAP'
export const COUNTRY = 'COUNTRY'
export const STATE = 'STATE'
export const CONURBATION = 'CONURBATION'

export const DISPLAY_VIEWS = [DATA, GLOBE, MAP, COUNTRY, STATE, CONURBATION]

const Store = types
  .model({
    globe: types.maybe(Globe),

    selectedCountry: types.maybe(types.reference(Country)),
    selectedState: types.maybe(types.reference(State)),
    selectedCounty: types.maybe(types.reference(County)),
    selectedConurbation: types.maybe(types.reference(Conurbation)),

    contextReference: types.optional(types.string, ''),
    temporalReference: types.optional(types.string, WEEK),
    displayReference: types.optional(types.string, GLOBE),
  })
  .actions((self) => ({
    loadGlobe: flow(function* loadGlobe() {
      if (self.globe) {
        return
      }

      //const data = yield getGlobe()

      self.globe = Globe.create({})

      yield self.globe.loadCountries()

      self.globe.loadCurrentMarkers()
    }),
  }))
  .actions((self) => ({
    validateRoute: flow(function* validateRoute(route) {
      let data = route.toUpperCase()

      let view
      let period
      let place

      view = self.DISPLAY_VIEWS.find((item) => data.indexOf(item + '-') > -1) || DATA
      period = self.TIME_PERIODS.find((item) => data.indexOf(item + '-') > -1) || WEEK

      if (view) {
        data = data.replace(view, '')
      }
      if (period) {
        data = data.replace(period, '')
      }

      place = data.replace(/-/g, '')

      yield self.choosePlace(place)

      if (period) {
        self.choosePeriod(period)
      }

      if (view) {
        self.chooseView(view)
      }

      console.log('VALIDATING ROUTE >>>>>>>>>>>>>>>>>>>>' + route)

      return view
    }),
    choosePlace: flow(function* choosePlace(contextReference) {
      let data = contextReference.toUpperCase()

      const contextCountry = extractContextCountry(data)
      const contextState = extractContextState(data)

      let contextConurbation = extractContextConurbation(data)
      let contextCounty = extractContextCounty(data)

      if (contextConurbation) {
        contextCounty = undefined
      } else if (contextCounty) {
        contextConurbation = undefined
      }

      if (
        !contextConurbation &&
        self.globe.selectedCountry &&
        self.globe.selectedCountry.selectedState &&
        self.globe.selectedCountry.selectedState.selectedConurbation
      ) {
        self.globe.selectedCountry.selectedState.deSelect()
      }

      if (!contextCounty && self.globe.selectedCountry && self.globe.selectedCountry.selectedState && self.globe.selectedCountry.selectedState.selectedCounty) {
        self.globe.selectedCountry.selectedState.deSelect()
      }

      if (!contextState && self.globe.selectedCountry && self.globe.selectedCountry.selectedState) {
        self.globe.selectedCountry.deSelect()
      }

      if (!contextCountry && self.globe.selectedCountry) {
        self.globe.deSelect()
      }

      if (contextCountry) {
        yield self.globe.chooseCountry(contextCountry).then(() => {
          self.globe.selectedCountry.loadStates().then(() => {
            self.globe.selectedCountry.states.forEach((state) => {
              state.loadConurbations()
            })

            if (contextState) {
              self.globe.selectedCountry.chooseState(contextState).then(() => {
                self.globe.selectedCountry.selectedState.loadCounties().then(() => {
                  if (contextCounty) {
                    self.globe.selectedCountry.selectedState.chooseCounty(contextCounty)
                  }
                })
                self.globe.selectedCountry.selectedState.loadConurbations().then(() => {
                  if (contextConurbation) {
                    self.globe.selectedCountry.selectedState.chooseConurbation(contextConurbation)
                  }
                })
              })
            }
          })
        })
      }

      self.contextReference = contextReference
    }),
  }))
  .actions((self) => ({
    choosePeriod: (temporalReference) => {
      self.temporalReference = self.TIME_PERIODS.find((item) => item === temporalReference) || WEEK
    },
    chooseView: (displayReference) => {
      self.displayReference = self.DISPLAY_VIEWS.find((item) => item === displayReference) || WEEK
    },
  }))
  .views((self) => ({
    get TIME_PERIODS() {
      return TIME_PERIODS
    },
    get DISPLAY_VIEWS() {
      return DISPLAY_VIEWS
    },
    calculateRoute({ view, period, place }) {
      const newView = view || self.displayReference
      const newPeriod = period || self.temporalReference
      const newPlace = place || self.contextReference

      return `${newView}-${newPeriod}-${newPlace}-`
    },
  }))

const store = Store.create({})

export default makeInspectable(store)
