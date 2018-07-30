import rewind from 'geojson-rewind'
import wkt from 'terraformer-wkt-parser'

import { fixDateline, removeDateline } from '../../common'

function getCountries(useCache = false) {
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`countries`)

    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return (
    fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/countries`)
      .then((response) => {
        if (response.status !== 200) {
          console.log('ERROR /geographic/countries: ' + response.status)
          return
        }

        return response.json()
      })
      .then((data) => {
        return data.filter(
          (country) => country.countryName !== 'Antarctica'
          //&& country.countryName !== 'Caspian Sea'
          //&&
          //country.countryName === 'Russia'
        )
      })
      .then((data) => {
        return data.map((country) => {
          const geoJson = wkt.parse(country.simpleWKT)

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
      // .then((data) => {
      //   return data.filter(
      //     (country) => country.countryName !== 'Antarctica'
      //     //&& country.countryName !== 'Caspian Sea'
      //     //&&
      //     //country.countryName === 'Russia'
      //   )
      // })
      .then((data) => {
        if (window.localStorage && data) {
          //window.localStorage.setItem(`countries`, JSON.stringify(data))
        }

        return data
      })
  )
}

export default getCountries
