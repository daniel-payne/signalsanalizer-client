export const fixDateline = (geoJSONGeometry) => {
  const result = JSON.parse(JSON.stringify(geoJSONGeometry))

  for (let i = 0; i < result.coordinates.length; i++) {
    for (let j = 0; j < result.coordinates[i].length; j++) {
      let lastLong = undefined

      for (let k = 0; k < result.coordinates[i][j].length; k++) {
        let thisLng = result.coordinates[i][j][k][0]

        if (thisLng < 0 && lastLong > 0) {
          thisLng = thisLng - -180 + 180

          result.coordinates[i][j][k][0] = thisLng
        } else if (thisLng > 0 && lastLong < 0) {
          //thisLng = thisLng
          //result.coordinates[i][j][k][0] = thisLng
        } else {
          lastLong = thisLng
        }
      }
    }
  }

  return result
}

export const removeDateline = (geoJSONGeometry) => {
  const result = JSON.parse(JSON.stringify(geoJSONGeometry))

  for (let i = 0; i < result.coordinates.length; i++) {
    for (let j = 0; j < result.coordinates[i].length; j++) {
      let lastLong = undefined

      for (let k = result.coordinates[i][j].length - 1; k >= 0; k--) {
        let thisLng = result.coordinates[i][j][k][0]

        if (thisLng < 0 && lastLong > 0) {
          result.coordinates[i][j].splice(k, 1)
        } else {
          lastLong = thisLng
        }
      }
    }
  }

  return result
}
