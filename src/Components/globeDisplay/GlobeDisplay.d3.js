import * as d3 from 'd3'
import d3GeoZoom from 'd3-geo-zoom'

//const orthographicProjection = d3.geoOrthographic().rotate(0, 90, 0) //.center([0, 20])
//const orthographicPathConverter = d3.geoPath().projection(orthographicProjection)

const MARGIN = 20

const drawCountries = (svg, path, countries, selectedCountry, onSelection) => {
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

  selection.enter().append('path')

  selection.exit().remove()

  selection
    .attr('class', 'land')
    .attr('d', path)
    .on('mouseover', function(d) {
      if (selectedCountry.contextReference !== d.properties.contextReference) {
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
    selection.attr('opacity', 0.25)
  }
}

const drawSelectedCountry = (svg, path, selectedCountry) => {
  const datum = JSON.parse(selectedCountry.border)

  datum.properties = {
    name: selectedCountry.countryName,
    contextReference: selectedCountry.contextReference,
    type: 'COUNTRY',
  }

  const selection = svg.select('#map-selected-country').datum(datum, (d) => d.properties.contextReference)

  selection.attr('class', 'land--selected').attr('d', path)
}

const drawGlobe = (svg, path) => {
  svg
    .select('#map-display-globe')
    .datum({ type: 'Sphere' })
    .attr('class', 'globe')
    .attr('d', path)
}

const drawGraticule = (svg, path) => {
  var graticule = d3.geoGraticule()

  svg
    .select('#map-display-graticule')
    .datum(graticule())
    .attr('class', 'graticule')
    .attr('d', path)
}

const redrawPaths = (svg, path) => () => {
  svg
    .select('#map-display-countries')
    .selectAll('path')
    .attr('d', path)

  svg.select('#map-selected-country').attr('d', path)

  svg.select('#map-display-globe').attr('d', path)

  svg.select('#map-display-graticule').attr('d', path)
}

const renderMap = ({ targetSVG, height, width, onSelection, countries, selectedCountry }) => {
  const svg = d3.select(targetSVG)

  const projection = d3
    .geoOrthographic()
    .scale(Math.min(width, height) / 2 - MARGIN)
    .translate([width / 2, height / 2])
    .clipAngle(90)

  const path = d3.geoPath().projection(projection)

  drawGlobe(svg, path)
  drawGraticule(svg, path)
  drawCountries(svg, path, countries, selectedCountry, onSelection)
  drawSelectedCountry(svg, path, selectedCountry)

  d3GeoZoom()
    .projection(projection)
    .northUp(true)
    .onMove(redrawPaths(svg, path))(svg.node())
}

export default renderMap
