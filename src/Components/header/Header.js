import React, { Component } from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import './Header.css'

class Header extends Component {
  render() {
    const { selectedCountry, selectedState, selectedCounty, selectedConurbation, onOpenLeftDrawer, onOpenRightDrawer } = this.props

    return (
      <AppBar className="Header" position="static">
        <Toolbar>
          <IconButton className="menuButton-left" color="inherit" aria-label="Menu" onClick={onOpenLeftDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography className="title" variant="title" color="inherit">
            {this.props.title ? this.props.title : 'Signals Analizer'}
          </Typography>
          <Typography className="title" variant="subheading" color="inherit">
            {selectedCountry ? selectedCountry.countryName : null}

            {selectedState ? ` - ${selectedState.stateName}` : null}

            {selectedCounty ? ` - ${selectedCounty.countyName}` : null}

            {selectedConurbation ? ` - ${selectedConurbation.conurbationName}` : null}
          </Typography>
          <IconButton className="menuButton-right" color="inherit" aria-label="Menu" onClick={onOpenRightDrawer}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    )
  }
}

export default Header
