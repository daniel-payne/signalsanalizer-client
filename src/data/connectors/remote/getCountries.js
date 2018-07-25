import rewind from 'geojson-rewind'

import { fixDateline } from '../../common'

function getCountries(useCache = false) {
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`countries`)

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
        const geoJson = JSON.parse(country.countrySimpleGeoJSON)

        const geoJsonRewound = rewind(geoJson, true)

        return {
          countryName: country.countryName,

          geoJSON: JSON.stringify({
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
      return data
        .filter((country) => country.countryName !== 'Antarctica')
        .filter((country) => country.countryName !== 'Fiji')
    })
    .then((data) => {
      if (window.localStorage && data) {
        window.localStorage.setItem(`countries`, JSON.stringify(data))
      }

      return data
    })
}

export default getCountries
