import * as d3 from 'd3'
import d3GeoZoom from 'd3-geo-zoom'

//const orthographicProjection = d3.geoOrthographic().rotate(0, 90, 0) //.center([0, 20])
//const orthographicPathConverter = d3.geoPath().projection(orthographicProjection)

const MARGIN = 20

const drawCountries = (svg, path, countries, selectedCountry, onSelection) => {
  if (!countries) {
    return
  }
  const data = countries
    .filter((country) => country.outline)

    .map((country) => {
      const geoJson = JSON.parse(country.outline)

      geoJson.properties = {
        name: country.countryName,
        contextReference: country.contextReference,
        type: 'COUNTRY',
      }

      return geoJson
    })

  const selection = svg
    .select('#map-display-countries')
    .selectAll('path')
    .data(data, (d) => d.properties.contextReference)

  selection
    .enter()
    .append('path')
    .attr('class', 'land')
    .attr('d', path)

  selection.exit().remove()

  svg
    .select('#map-display-countries')
    .selectAll('path')
    .on('mouseover', function(d) {
      if (selectedCountry && selectedCountry.contextReference !== d.properties.contextReference) {
        d3.select(this).style('fill', 'DarkSeaGreen')
      }
    })
    .on('mouseout', function(d) {
      d3.select(this).style('fill', 'gainsboro')
    })
    .on('dblclick', function(d) {
      d3.event.stopPropagation()
      if (onSelection) {
        onSelection(d.properties.contextReference)
      }
    })

  if (selectedCountry) {
    svg
      .select('#map-display-countries')
      .selectAll('path')
      .attr('opacity', 0.25)
  }
}

// const drawSelectedCountry = (svg, path, selectedCountry, onSelection) => {
//   if (!selectedCountry) {
//     return
//   }

//   const datum = JSON.parse(selectedCountry.border)

//   datum.properties = {
//     name: selectedCountry.countryName,
//     contextReference: selectedCountry.contextReference,
//     type: 'COUNTRY',
//   }

//   const selection = svg.select('#map-selected-country').datum(datum, (d) => d.properties.contextReference)

//   selection.attr('class', 'land--selected').attr('d', path)
// }

const drawStates = (svg, path, states, selectedState, onSelection) => {
  if (!states) {
    return
  }

  const data = states
    .filter((state) => state.outline)

    .map((state) => {
      const geoJson = JSON.parse(state.outline)

      geoJson.properties = {
        name: state.stateName,
        contextReference: state.contextReference,
        type: 'STATE',
      }

      return geoJson
    })

  const selection = svg
    .select('#map-display-states')
    .selectAll('path')
    .data(data, (d) => d.properties.contextReference)

  selection
    .enter()
    .append('path')
    //.attr('class', 'state')
    .attr('fill', 'gainsboro')
    .attr('stroke', 'DarkSeaGreen')
    .attr('stroke-width', '1px')
    .attr('d', path)

  selection.exit().remove()

  svg
    .select('#map-display-states')
    .selectAll('path')
    .on('mouseover', function(d) {
      //if (selectedState.contextReference !== d.properties.contextReference) {
      d3.select(this).style('fill', 'DarkSeaGreen')
      //}
    })
    .on('mouseout', function(d) {
      d3.select(this).style('fill', 'gainsboro')
    })
    .on('dblclick', function(d) {
      d3.event.stopPropagation()
      if (onSelection) {
        onSelection(d.properties.contextReference)
      }
    })

  if (selectedState) {
    svg
      .select('#map-display-states')
      .selectAll('path')
      .attr('opacity', 0.25)
  }
}

const drawGlobe = (svg, path) => {
  svg
    .select('#map-display-globe')
    // .select('path')
    // .enter()
    .append('path')
    .datum({ type: 'Sphere' })
    .attr('class', 'globe')
    .attr('d', path)
}

const drawGraticule = (svg, path) => {
  var graticule = d3.geoGraticule()

  svg
    .select('#map-display-graticule')
    // .select('path')
    // .enter()
    .append('path')
    .datum(graticule())
    .attr('class', 'graticule')
    .attr('d', path)
}

const redrawPaths = (svg, path) => () => {
  svg.selectAll('path').attr('d', path)
}

const renderMap = ({ targetSVG, height, width, onSelection, countries, states, selectedCountry, selectedState }) => {
  const svg = d3.select(targetSVG)

  svg.selectAll('path').remove()

  const projection = d3
    .geoOrthographic()
    .scale(Math.min(width, height) / 2 - MARGIN)
    .translate([width / 2, height / 2])
    .clipAngle(90)

  if (selectedState) {
    if (selectedState.centerpointCoordinates) {
      projection.rotate([-1 * selectedState.centerpointCoordinates[0], -1 * selectedState.centerpointCoordinates[1]])
    }

    if (selectedState.outline) {
      const bounds = d3.geoBounds(JSON.parse(selectedState.outline))

      const dx = bounds[1][0] - bounds[0][0]
      const dy = bounds[1][1] - bounds[0][1]
      const x = (bounds[0][0] + bounds[1][0]) / 2
      const y = (bounds[0][1] + bounds[1][1]) / 2

      projection.scale((projection.scale() * 90) / Math.max(dx, dy)).rotate([-1 * x, -1 * y])
    }
  } else if (selectedCountry) {
    if (selectedCountry.centerpointCoordinates) {
      projection.rotate([-1 * selectedCountry.centerpointCoordinates[0], -1 * selectedCountry.centerpointCoordinates[1]])
    }

    if (selectedCountry.outline) {
      const bounds = d3.geoBounds(JSON.parse(selectedCountry.outline))

      const dx = bounds[1][0] - bounds[0][0]
      const dy = bounds[1][1] - bounds[0][1]

      projection.scale((projection.scale() * 90) / Math.max(dx, dy))
    }
  }

  const path = d3.geoPath().projection(projection)

  drawGlobe(svg, path)
  drawGraticule(svg, path)
  drawCountries(svg, path, countries, selectedCountry, onSelection)
  drawStates(svg, path, states, selectedState, onSelection)

  d3GeoZoom()
    .projection(projection)
    .northUp(true)
    .onMove(redrawPaths(svg, path))(svg.node())
}

export default renderMap
