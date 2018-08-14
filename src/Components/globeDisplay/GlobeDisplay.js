import React, { Component } from 'react'
import PropTypes from 'prop-types'

import renderMap, { buildMap } from './GlobeDisplay.d3'

import './GlobeDisplay.css'

class GlobeDisplay extends Component {
  constructor(props) {
    super(props)

    this.mapTarget = React.createRef()
  }

  static propTypes = {
    displayWidth: PropTypes.number,
    displayHeight: PropTypes.number,
    countries: PropTypes.array,
    markers: PropTypes.array,
    selectedCountry: PropTypes.object,

    onLoadCountry: PropTypes.func,
  }

  state = {}

  componentDidMount() {
    const targetSVG = this.mapTarget.current
    const height = this.props.displayHeight
    const width = this.props.displayWidth

    buildMap({ targetSVG, height, width })
  }

  componentDidUpdate() {
    const { countries, markers, selectedCountry, displayHeight, displayWidth } = this.props

    const targetSVG = this.mapTarget.current
    const onSelection = this.handleSelection

    const height = displayHeight - 120
    const width = displayWidth

    renderMap({ targetSVG, height, width, onSelection, countries, markers, selectedCountry })
  }

  handleSelection = (selectedArea) => {}

  render() {
    return (
      <svg className="GlobeDisplay" id="globe-display" ref={this.mapTarget} width={this.props.displayWidth} height={this.props.displayHeight}>
        <path id="map-display-globe" />
        <path id="map-display-graticule" />
        <g id="map-display-countries" />
      </svg>
    )
  }
}

export default GlobeDisplay
