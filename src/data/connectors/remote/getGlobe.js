import rewind from 'geojson-rewind'
import wkt from 'terraformer-wkt-parser'

import { fixDateline } from '../../common'

function getGlobe(contextReference, useCache = false) {
  console.log('LOADING GLOBE ------------------------')
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`country:${contextReference}`)
    console.log('LOADED GLOBE ------------------------ FROM CACHE')
    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/globe`)
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/globe: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((country) => {
        const geoJson = wkt.parse(country.outlineWKT)

        let geoJSONDateline = geoJson

        geoJSONDateline = fixDateline(geoJson)

        const geoJsonRewound = rewind(geoJSONDateline, true)

        let geoJsonCenterpoint

        if (country.centerpointWKT) {
          geoJsonCenterpoint = wkt.parse(country.centerpointWKT)
        }

        return {
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
        window.localStorage.setItem(`globe:${contextReference}`, JSON.stringify(data))
      }
      console.log('LOADED GLOBE ------------------------ FROM SERVER ' + data.length)
      return data
    })
}

export default getGlobe
