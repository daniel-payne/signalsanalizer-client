import * as d3 from 'd3'
import d3GeoZoom from 'd3-geo-zoom'

//const orthographicProjection = d3.geoOrthographic().rotate(0, 90, 0) //.center([0, 20])
//const orthographicPathConverter = d3.geoPath().projection(orthographicProjection)

const MARGIN = 20

// let state = {}

// const drawMap = ({ targetSVG, height, width, onSelection, countries }) => {
//   const svg = d3.select(targetSVG)

//   const countryOutlineData = countries
//     .filter((country) => country.outline)

//     .map((country) => {
//       const geoJson = JSON.parse(country.outline)

//       geoJson.properties = {
//         name: country.countryName,
//         contextReference: country.contextReference,
//         type: 'COUNTRY',
//       }

//       return geoJson
//     })

//   const orthographic = d3
//     .geoOrthographic()
//     .scale(state.scale)
//     .translate([width / 2, height / 2])
//     .clipAngle(90)
//     .rotate([state.x, state.y])

//   const path = d3.geoPath().projection(orthographic)

//   var globe = svg
//     .select('#map-display-globe')
//     .datum({ type: 'Sphere' })
//     .attr('class', 'globe')
//     .attr('d', path)
//   // .style('fill', 'white')

//   svg
//     .select('#map-display-countries')
//     .selectAll('path')
//     .data(countryOutlineData, (d) => d.properties.contextReference)
//     .enter()
//     .append('path')

//   svg
//     .select('#map-display-countries')
//     .selectAll('path')
//     .attr('class', 'land')
//     .attr('d', path)
//     .on('mouseover', function(d) {
//       debugger
//       d3.select(this).style('fill', 'DarkSeaGreen')
//     })
//     .on('mouseout', function(d) {
//       d3.select(this).style('fill', 'gainsboro')
//     })
//   // .style('fill', 'red')

//   var graticule = d3.geoGraticule()

//   // Append the parallel and meridian lines
//   var lines = svg
//     .select('#map-display-graticule')
//     .datum(graticule())
//     .attr('class', 'graticule')
//     .attr('d', path)
//   // .style('fill', 'gainsboro')
// }

// let currentZoom
// let zoomManager

// export const buildMap = (targetSVG, height, width) => {
//   state = { scale: (height - 120 - 20) / 0.25, width, x: 0, y: -54 }

//   const svg = d3.select(targetSVG)
//   const zoomGrouping = svg

//   const zoomed = (zoomGrouping) => () => {
//     const transform = d3.event.transform
//     if (transform.k < 0.8) {
//       transform.k = 0.8
//       transform.x = 0
//       transform.y = 0
//     }

//     zoomGrouping.attr('transform', transform)

//     svg.selectAll('path').style('stroke-width', () => {
//       return 2 / transform.k
//     })

//     currentZoom = transform.k
//   }

//   zoomManager = d3.zoom().on('zoom', zoomed(zoomGrouping))

//   svg.call(zoomManager)
// }

// const renderMap = ({ targetSVG, height, width, onSelection, countries }) => {
//   drawMap({ targetSVG, height, width, onSelection, countries })
// }

export const buildMap = (targetSVG, height, width) => {}

const renderMap = ({ targetSVG, height, width, onSelection, countries }) => {
  const svg = d3.select(targetSVG)

  const countryOutlineData = countries
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

  const projection = d3
    .geoOrthographic()
    .scale(Math.min(width, height) / 2 - MARGIN)
    .translate([width / 2, height / 2])
    .clipAngle(90)

  const path = d3.geoPath().projection(projection)

  var globe = svg
    .select('#map-display-globe')
    .datum({ type: 'Sphere' })
    .attr('class', 'globe')
    .attr('d', path)
  // .style('fill', 'white')

  svg
    .select('#map-display-countries')
    .selectAll('path')
    .data(countryOutlineData, (d) => d.properties.contextReference)
    .enter()
    .append('path')

  svg
    .select('#map-display-countries')
    .selectAll('path')
    .attr('class', 'land')
    .attr('d', path)
    .on('mouseover', function(d) {
      debugger
      d3.select(this).style('fill', 'DarkSeaGreen')
    })
    .on('mouseout', function(d) {
      d3.select(this).style('fill', 'gainsboro')
    })
  // .style('fill', 'red')

  var graticule = d3.geoGraticule()

  // Append the parallel and meridian lines
  var lines = svg
    .select('#map-display-graticule')
    .datum(graticule())
    .attr('class', 'graticule')
    .attr('d', path)
  // .style('fill', 'gainsboro')

  const render = () => {
    svg
      .select('#map-display-countries')
      .selectAll('path')
      .attr('d', path)

    svg.select('#map-display-globe').attr('d', path)

    svg.select('#map-display-graticule').attr('d', path)
  }

  d3GeoZoom()
    .projection(projection)
    .northUp(true)
    .onMove(render)(svg.node())
}

export default renderMap
