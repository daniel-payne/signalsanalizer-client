export const fixDateline = (geoJson) => {
  for (let i = 0; i < geoJson.geometry.coordinates.length; i++) {
    for (let j = 0; j < geoJson.geometry.coordinates[i].length; j++) {
      let lastLong = undefined

      for (let k = 0; k < geoJson.geometry.coordinates[i][j].length; k++) {
        let thisLng = geoJson.geometry.coordinates[i][j][k][0]

        if (thisLng < 0 && lastLong > 0) {
          thisLng = thisLng - -180 + 180

          geoJson.geometry.coordinates[i][j][k][0] = thisLng
        } else {
          lastLong = thisLng
        }
      }
    }
  }
}

export const removeDateline = (geoJson) => {
  for (let i = 0; i < geoJson.geometry.coordinates.length; i++) {
    for (let j = 0; j < geoJson.geometry.coordinates[i].length; j++) {
      let lastLong = undefined

      for (let k = geoJson.geometry.coordinates[i][j].length - 1; k >= 0; k--) {
        let thisLng = geoJson.geometry.coordinates[i][j][k][0]

        if (thisLng < 0 && lastLong > 0) {
          geoJson.geometry.coordinates[i][j].splice(k, 1)
        } else {
          lastLong = thisLng
        }
      }
    }
  }
}
