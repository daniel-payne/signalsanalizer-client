import React, { Component } from 'react'

import buildMap from './map.d3'

import './Map.css'

class Map extends Component {
  state = {}

  constructor(props) {
    super(props)
    this.mapTarget = React.createRef()
  }

  componentDidUpdate() {
    buildMap(this.mapTarget.current, this.props, this.state)
  }

  render() {
    // let mapStyle = {
    //   height: '100%',
    //   width: '100%',
    //   boxSizing: 'border-box',
    //   position: 'absolute',
    // }
    return (
      <svg
        id="map-display"
        ref={this.mapTarget}
        width={this.props.displayWidth}
        height={this.props.displayHeight - 120}
      />
    )
  }
}

export default Map
