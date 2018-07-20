/* global google */

import React, { Component } from 'react'
import Dimensions from 'react-dimensions'

import { withGoogleMap, GoogleMap, Marker, Polygon } from 'react-google-maps'

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
        {this.props.contenents.map((contenent) => {
          const paths = contenent.coordinates.map((items) => {
            return items[0].map((item) => {
              return { lat: item[1], lng: item[0] }
            })
          })

          return (
            <Polygon
              paths={paths}
              onClick={() => {
                alert(JSON.stringify(contenent.properties))
              }}
            />
          )
        })}
      </GoogleMap>
    )
  }
}

export default Dimensions()(withGoogleMap(Map))
