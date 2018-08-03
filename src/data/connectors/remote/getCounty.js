import rewind from 'geojson-rewind'
import wkt from 'terraformer-wkt-parser'

import { fixDateline } from '../../common'

function getCounties(contextReference, useCache = false) {
  console.log('LOADING COUNTY ------------------------ FOR ' + contextReference)
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`county:${contextReference}`)
    console.log('LOADED COUNTY ------------------------ FROM CACHE')
    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/county?contextReference=${contextReference}`)
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/counties: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((county) => {
        const geoJson = wkt.parse(county.borderWKT)

        const geoJSONDateline = fixDateline(geoJson)

        const geoJsonRewound = rewind(geoJSONDateline, true)

        return {
          countyName: county.countyName,
          contextReference: county.contextReference,

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
        window.localStorage.setItem(`counties:${contextReference}`, JSON.stringify(data))
      }
      console.log('LOADED COUNTY ------------------------ FROM SERVER ' + data.length)
      return data
    })
}

export default getCounties
