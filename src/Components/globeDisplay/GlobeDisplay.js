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
    buildMap(this.mapTarget.current)
  }

  componentDidUpdate() {
    const { countries, markers, selectedCountry } = this.props

    const targetSVG = this.mapTarget.current
    const onSelection = this.handleSelection

    renderMap({ targetSVG, onSelection, countries, markers, selectedCountry })
  }

  handleSelection = (selectedArea) => {}

  render() {
    return (
      <svg className="GlobeDisplay" id="globe-display" ref={this.mapTarget} width={this.props.displayWidth} height={this.props.displayHeight}>
        <g id="map-display-zoom">
          <g id="map-display-countries" />
          <g id="map-display-states" />
          <g id="map-display-counties" />
          <g id="map-display-conurbations" />
          <g id="map-display-places" />
          <g id="map-display-features" />
          <g id="map-display-markers" />
          <g id="map-display-events" />

          <g id="map-display-selected-country" />
          <g id="map-display-selected-state" />
          <g id="map-display-selected-county" />
          <g id="map-display-selected-conurbation" />
          <g id="map-display-selected-markers" />
          <g id="map-display-selected-events" />
        </g>
      </svg>
    )
  }
}

export default GlobeDisplay
