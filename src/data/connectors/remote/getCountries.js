import rewind from 'geojson-rewind'

import { fixDateline, removeDateline } from '../../common'

function getCountries(useCache = false) {
  // const fixDateline2 = (geoJSONGeometry) => {
  //   const result = JSON.parse(JSON.stringify(geoJSONGeometry))

  //   for (let i = 0; i < result.coordinates.length; i++) {
  //     for (let j = 0; j < result.coordinates[i].length; j++) {
  //       let lastLong = undefined

  //       for (let k = 0; k < result.coordinates[i][j].length; k++) {
  //         let thisLng = result.coordinates[i][j][k][0]

  //         if (thisLng < 0 && lastLong > 0) {
  //           thisLng = thisLng - -180 + 180

  //           result.coordinates[i][j][k][0] = thisLng
  //         } else {
  //           lastLong = thisLng
  //         }
  //       }
  //     }
  //   }

  //   return result
  // }

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

        const geoJSONDateline = fixDateline(geoJson)

        const geoJsonRewound = rewind(geoJSONDateline, true)

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
      return data.filter((country) => country.countryName !== 'Antarctica')
      //.filter((country) => country.countryName === 'Fiji')
    })
    .then((data) => {
      if (window.localStorage && data) {
        window.localStorage.setItem(`countries`, JSON.stringify(data))
      }

      return data
    })
}

export default getCountries
