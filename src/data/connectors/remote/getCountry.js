import rewind from 'geojson-rewind'
import wkt from 'terraformer-wkt-parser'

import { fixDateline } from '../../common'

function getCountry(contextReference, useCache = true) {
  console.log('LOADING COUNTRY ------------------------')
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`country:${contextReference}`)
    console.log('LOADED COUNTRY ------------------------ FROM CACHE')
    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/country?contextReference=${contextReference}`)
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

        if (country.countryName === 'Russia' || country.countryName === 'Fiji') {
          geoJSONDateline = fixDateline(geoJson)
        }

        const geoJsonRewound = rewind(geoJSONDateline, true)

        let geoJsonCenterpoint

        if (country.centerpointWKT) {
          geoJsonCenterpoint = wkt.parse(country.centerpointWKT)
        }

        return {
          countryName: country.countryName,
          contextReference: country.contextReference,

          centerpoint: geoJsonCenterpoint,

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
        window.localStorage.setItem(`country:${contextReference}`, JSON.stringify(data))
      }
      console.log('LOADED COUNTRY ------------------------ FROM SERVER ' + data.length)
      return data
    })
}

export default getCountry
