export const fixDateline = (geoJSONGeometry) => {
  const result = JSON.parse(JSON.stringify(geoJSONGeometry))

  for (let i = 0; i < result.coordinates.length; i++) {
    for (let j = 0; j < result.coordinates[i].length; j++) {
      let lastLong = undefined

      for (let k = 0; k < result.coordinates[i][j].length; k++) {
        let thisLng = result.coordinates[i][j][k][0]

        if (thisLng < 170 && lastLong > 170) {
          const newLng = -180 - (180 - thisLng) * -1

          result.coordinates[i][j][k][0] = newLng
        } else if (thisLng > 170 && lastLong < 170) {
          const newLng = 180 + (-180 - thisLng)

          result.coordinates[i][j][k][0] = newLng
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
        } else if (thisLng > 0 && lastLong < 0) {
          result.coordinates[i][j].splice(k, 1)
        } else {
          lastLong = thisLng
        }
      }
    }
  }

  return result
}

export const GLOBAL = 'GLOBAL'
export const COUNTRY = 'COUNTRY'
export const STATE = 'STATE'
export const COUNTY = 'COUNTY'
export const CONURBATION = 'CONURBATION'

export const ZOOM_LEVELS = [GLOBAL, COUNTRY, STATE, COUNTY, CONURBATION]

export const extractContextType = function(contextReference) {
  const conurbationStartPosition = contextReference.indexOf('@')
  const parts = contextReference.split('.')

  if (contextReference.length === 0) {
    return GLOBAL
  } else if (contextReference.length === 3) {
    return COUNTRY
  } else if (conurbationStartPosition > -1) {
    return CONURBATION
  } else if (parts.length === 2) {
    return STATE
  } else if (parts.length === 3) {
    return COUNTY
  }
}

export const extractContextPart = function(contextReference, level) {
  const conurbationStartPosition = contextReference.indexOf('@')
  const parts = contextReference.split('.').filter((item) => item.length > 0)

  if (level === COUNTRY) {
    return contextReference.substr(0, 3)
  } else if (level === CONURBATION && conurbationStartPosition > -1) {
    return contextReference
  } else if (level === STATE && parts.length > 1) {
    return parts[0] + '.' + parts[1] + '.'
  } else if (level === COUNTY && parts.length > 2) {
    return parts[0] + '.' + parts[1] + '.' + parts[2] + '.'
  }
}

export const extractContextCountry = function(contextReference) {
  return extractContextPart(contextReference, COUNTRY)
}
export const extractContextState = function(contextReference) {
  return extractContextPart(contextReference, STATE)
}
export const extractContextCounty = function(contextReference) {
  return extractContextPart(contextReference, COUNTY)
}
export const extractContextConurbation = function(contextReference) {
  return extractContextPart(contextReference, CONURBATION)
}
