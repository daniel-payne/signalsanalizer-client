/* global google */

import React, { Component } from 'react'
import Dimensions from 'react-dimensions'

import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

import './Map.css'

var layerID = 'my_custom_layer'

var layer = new google.maps.ImageMapType({
  name: layerID,
  getTileUrl: function(coord, zoom) {},
  tileSize: new google.maps.Size(256, 256),
  minZoom: 1,
  maxZoom: 20,
})

class Map extends Component {
  render() {
    let mapStyle = {
      height: 300,
      width: 300,
      boxSizing: 'border-box',
      position: 'absolute',
    }
    return (
      <GoogleMap
        mapTypeId={layerID}
        defaultExtraMapTypes={[[layerID, layer]]}
        style={mapStyle}
        defaultZoom={2}
        defaultCenter={{ lat: 0, lng: 0 }}
      >
        {this.props.isMarkerShown && (
          <Marker position={{ lat: -34.397, lng: 150.644 }} />
        )}
      </GoogleMap>
    )
  }
}

export default Dimensions()(withGoogleMap(Map))
