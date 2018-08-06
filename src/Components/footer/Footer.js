import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'

import TerrorismIcon from '@material-ui/icons/NewReleases'
// import MurderIcon from '@material-ui/icons/Accessibility'
// import LocationOnIcon from '@material-ui/icons/LocationOn'

import './Footer.css'

class Footer extends Component {
  state = {
    value: 0,
  }

  static getDerivedStateFromProps(props, state) {
    if (props.temporalReference) {
      const newValue = props.store.TIME_PERIODS.indexOf(props.temporalReference)

      if (newValue > -1) {
        return { value: props.store.TIME_PERIODS.length - 1 - newValue }
      }
    }
  }

  handleChange = (event, value) => {
    this.setState({ value })

    const periods = this.props.store.TIME_PERIODS.slice().reverse()

    const newRoute = this.props.store.calculateRoute({ period: periods[value] })

    this.props.history.push('/' + newRoute)
  }

  render() {
    const { value } = this.state

    return (
      <BottomNavigation className="Footer" value={value} onChange={this.handleChange} showLabels>
        <BottomNavigationAction label="Since 1970" icon={<TerrorismIcon />} />
        <BottomNavigationAction label="Last 25 Years" icon={<TerrorismIcon />} />
        <BottomNavigationAction label="Last 10 Years" icon={<TerrorismIcon />} />
        <BottomNavigationAction label="Last 5 Years" icon={<TerrorismIcon />} />

        <BottomNavigationAction label="This Year" icon={<TerrorismIcon />} />
        <BottomNavigationAction label="This Month" icon={<TerrorismIcon />} />
        <BottomNavigationAction label="This Week" icon={<TerrorismIcon />} />
      </BottomNavigation>
    )
  }
}

export default inject('store')(observer(withRouter(Footer)))
