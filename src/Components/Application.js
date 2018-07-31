import React, { Component } from 'react'
import Dimensions from 'react-dimensions'
import { observer, inject } from 'mobx-react'

import Header from './header/Header'
import Footer from './footer/Footer'
import Map from './map/Map'

import './Application.css'

import Drawer from '@material-ui/core/Drawer'

class Application extends Component {
  state = {
    left: false,
    right: false,
    contenents: [],
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open || !this.state[side],
    })
  }

  handleLoadCountry = (contextReference) => {
    this.props.store.loadCountry(contextReference)
  }

  render() {
    return (
      <div className="Application">
        <Header
          title={this.props.store.countries.length}
          onOpenLeftDrawer={this.toggleDrawer('left', true)}
          onOpenRightDrawer={this.toggleDrawer('right', true)}
        />

        <Map
          className="map-display"
          countries={this.props.store.countries || []}
          selectedCountry={this.props.store.selectedCountry}
          displayWidth={this.props.containerWidth}
          displayHeight={this.props.containerHeight}
          onLoadCountry={this.handleLoadCountry}
        />

        <Footer />

        <Drawer
          open={this.state.left}
          onClose={this.toggleDrawer('left', false)}
          anchor="left"
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            Left Drawer
          </div>
        </Drawer>
        <Drawer
          open={this.state.right}
          onClose={this.toggleDrawer('right', false)}
          anchor="right"
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('right', false)}
            onKeyDown={this.toggleDrawer('right', false)}
            style={{
              width: '600px',
            }}
          >
            Right Drawer
            {this.props.store.selectedCountry
              ? this.props.store.selectedCountry.countryName
              : 'NONE'}
          </div>
        </Drawer>
      </div>
    )
  }
}

const Injectedpplication = inject('store')(observer(Application))
const DimensionsApplication = Dimensions()(Injectedpplication)

export default DimensionsApplication
