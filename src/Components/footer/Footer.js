import React, { Component } from 'react'

import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'

import TerrorismIcon from '@material-ui/icons/NewReleases'
import MurderIcon from '@material-ui/icons/Accessibility'
import LocationOnIcon from '@material-ui/icons/LocationOn'

import './Footer.css'

class Footer extends Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { value } = this.state

    return (
      <BottomNavigation
        ClassName="Footer"
        value={value}
        onChange={this.handleChange}
        showLabels
      >
        <BottomNavigationAction label="Terrorism" icon={<TerrorismIcon />} />
        <BottomNavigationAction label="Murder" icon={<MurderIcon />} />
        <BottomNavigationAction label="Peace Index" icon={<LocationOnIcon />} />
      </BottomNavigation>
    )
  }
}

export default Footer
