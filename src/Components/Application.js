import React, { Component } from 'react'

import Header from './header/Header'
import Footer from './footer/Footer'
import Map from './map/Map'

import './Application.css'

import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}

class Application extends Component {
  state = {
    left: false,
    right: false,
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open || !this.state[side],
    })
  }

  render() {
    return (
      <div className="Application">
        <Header
          onOpenLeftDrawer={this.toggleDrawer('left', true)}
          onOpenRightDrawer={this.toggleDrawer('right', true)}
        />

        <div className="map-display">
          <Map />
        </div>

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
          </div>
        </Drawer>
      </div>
    )
  }
}

export default Application
