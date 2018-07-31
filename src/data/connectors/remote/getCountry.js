import rewind from 'geojson-rewind'
import wkt from 'terraformer-wkt-parser'

import { fixDateline } from '../../common'

function getCountry(contextReference, useCache = true) {
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`countries`)

    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(
    `${
      process.env.REACT_APP_REST_ENDPOINT
    }/geographic/country?contextReference=${contextReference}`
  )
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/country: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((country) => {
        const geoJson = wkt.parse(country.borderWKT)

        let geoJSONDateline = geoJson

        if (
          country.countryName === 'Russia' ||
          country.countryName === 'Fiji'
        ) {
          geoJSONDateline = fixDateline(geoJson)
        }

        const geoJsonRewound = rewind(geoJSONDateline, true)

        return {
          countryName: country.countryName,
          contextReference: country.contextReference,

          border: JSON.stringify({
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

      return data
    })
}

export default getCountry
