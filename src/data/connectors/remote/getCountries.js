import rewind from 'geojson-rewind'
import wkt from 'terraformer-wkt-parser'

import { fixDateline } from '../../common'

function getCountries(useCache = false) {
  console.log('LOADING COUNTRIES ------------------------')
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`countries`)
    console.log('LOADED COUNTRIES ------------------------ FROM CACHE')
    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/countries`)
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/countries: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((country) => {
        const geoJson = wkt.parse(country.outlineWKT)

        let geoJSONDateline = geoJson

        if (country.countryName === 'Russia' || country.countryName === 'Fiji') {
          geoJSONDateline = fixDateline(geoJson)
        }

        const geoJsonRewound = rewind(geoJSONDateline, true)

        return {
          countryName: country.countryName,
          contextReference: country.contextReference,

          outline: JSON.stringify({
            type: 'Feature',
            geometry: {
              type: geoJsonRewound.type,
              coordinates: geoJsonRewound.coordinates,
            },
          }),
        }
      })
    })
    .then((data) => {
      if (useCache === true && window.localStorage && data) {
        window.localStorage.setItem(`countries`, JSON.stringify(data))
      }
      console.log('LOADED COUNTRIES ------------------------ FROM SERVER ' + data.length)
      return data
    })
}

export default getCountries
