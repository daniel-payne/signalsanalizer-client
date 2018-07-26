import * as d3 from 'd3'
import rewind from 'geojson-rewind'
import { fixDateline } from '../../data/common'
// import { ListItemText } from '../../../node_modules/@material-ui/core'

const mercatorProjection = d3.geoMercator().center([0, 65])
// const orthographicProjection = d3.geoOrthographic().center([0, 20])
// const equirectangularProjection = d3.geoEquirectangular().center([0, 0])

const mercatorPathConverter = d3.geoPath().projection(mercatorProjection)
// const orthographicPathConverter = d3
//   .geoPath()
//   .projection(orthographicProjection)
// const equirectangularPathConverter = d3
//   .geoPath()
//   .projection(equirectangularProjection)

export const buildMap = (targetSVG) => {
  const svg = d3.select(targetSVG)
  const zoomGrouping = svg.select('g#map-display-zoom')

  const zoomed = (zoomGrouping) => () => {
    zoomGrouping.attr('transform', d3.event.transform)
  }

  const zoom = d3.zoom().on('zoom', zoomed(zoomGrouping))

  svg.call(zoom)
}

const renderMap = ({ targetSVG, onSelection, countries }) => {
  const svg = d3.select(targetSVG)
  const countriesGrouping = svg.select('g#map-display-countries')

  const displayData = countries.map((feature) => {
    const geoJson = JSON.parse(feature.geoJSON)

    geoJson.properties = {
      name: feature.countryName,
    }

    return geoJson
  })

  // let fiji = {
  //   type: 'Feature',
  //   geometry: {
  //     type: 'MultiPolygon',
  //     coordinates: [
  //       [
  //         [
  //           [-179.04650878906261, -17.169982910156261],
  //           [-178.99278259277358, -17.328056335449286],
  //           [-178.92218017578136, -17.214416503906339],
  //           [-179.04650878906261, -17.169982910156261],
  //         ],
  //       ],
  //       [
  //         [
  //           [179.88670349121278, -16.952402114867631],
  //           [-179.87820434570077, -16.874664306642792],
  //           [-179.87258911132824, -16.689502716066347],
  //           [179.88670349121278, -16.952402114867631],
  //         ],
  //       ],
  //       [
  //         [
  //           [179.23500061035145, -18.028055191040174],
  //           [179.36610412597665, -18.099166870117092],
  //           [179.30139160156264, -17.93944549560543],
  //           [179.23500061035145, -18.028055191040174],
  //         ],
  //       ],
  //       [
  //         [
  //           [178.47555541992216, -16.757223129272376],
  //           [178.72416687011403, -17.016387939454265],
  //           [178.90527343749923, -16.842500686643564],
  //           [179.06634521484153, -16.908847808839489],
  //           [179.19726562500065, -16.699544906613447],
  //           [179.35879516601702, -16.737264633177979],
  //           [179.30371093750185, -16.821344375609446],
  //           [179.92706298828017, -16.764400482176807],
  //           [179.82153320312386, -16.671638488769652],
  //           [179.92083740234588, -16.467222213742996],
  //           [179.55802917480415, -16.767383575442061],
  //           [179.47111511230375, -16.70777702331759],
  //           [-179.95040893554844, -16.127271652222969],
  //           [178.9425811767544, -16.461149215698942],
  //           [178.47555541992216, -16.757223129272376],
  //         ],
  //       ],
  //       [
  //         [
  //           [177.9516601562502, -19.133054733276264],
  //           [178.48582458496091, -19.000556945800813],
  //           [178.31304931640645, -18.933057785034034],
  //           [177.9516601562502, -19.133054733276264],
  //         ],
  //       ],
  //       [
  //         [
  //           [177.24293518066418, -17.962875366210827],
  //           [177.33444213867187, -18.122777938842905],
  //           [177.89221191406241, -18.276046752929616],
  //           [178.56500244140645, -18.151943206787191],
  //           [178.69860839843747, -17.999998092651374],
  //           [178.58332824707054, -17.644441604614379],
  //           [178.1755523681642, -17.310834884643597],
  //           [177.65583801269531, -17.445833206176697],
  //           [177.68417358398437, -17.563888549804627],
  //           [177.638885498047, -17.444723129272319],
  //           [177.5169372558596, -17.507778167724496],
  //           [177.24293518066418, -17.962875366210827],
  //         ],
  //       ],
  //     ],
  //   },
  // }

  // for (let i = 0; i < fiji.geometry.coordinates.length; i++) {
  //   for (let j = 0; j < fiji.geometry.coordinates[i].length; j++) {
  //     let lastLong = undefined

  //     for (let k = fiji.geometry.coordinates[i][j].length - 1; k >= 0; k--) {
  //       //for (let k = 0; k < fiji.geometry.coordinates[i][j].length; k++) {
  //       let thisLng = fiji.geometry.coordinates[i][j][k][0]

  //       if (thisLng < 0 && lastLong > 0) {
  //         //thisLng = thisLng - -180 + 180

  //         //fiji.geometry.coordinates[i][j][k][0] = 179.999
  //         console.log(fiji.geometry.coordinates[i][j])
  //         fiji.geometry.coordinates[i][j].splice(k, 1)
  //         console.log(fiji.geometry.coordinates[i][j])
  //       } else {
  //         lastLong = thisLng
  //       }
  //     }
  //   }
  // }

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

  // fiji.geometry = fixDateline2(fiji.geometry)
  // fiji = rewind(fiji, true)

  countriesGrouping
    .selectAll('path')
    .data(displayData)
    .enter()
    .append('path')
    .attr('d', mercatorPathConverter)
    .attr('class', 'country')
    // .attr('vector-effect', 'non-scaling-stroke')
    // .attr('stroke', 'red')
    .on('mouseover', function(d) {
      d3.select(this).style('fill', 'grey')
    })
    .on('mouseout', function(d) {
      d3.select(this).style('fill', 'white')
    })
    .on('click', function(d) {
      if (onSelection) {
        onSelection(d)
      }
    })
}

export default renderMap
