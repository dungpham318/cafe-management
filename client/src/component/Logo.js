import React, { Component } from 'react'
import LogoStyle from '../assets/jss/component/logo-style'
import { Link } from 'react-router-dom'

class Logo extends Component {
  render() {
    return (
      <div style={LogoStyle.logo}>
        <Link to='/dashboard' style={LogoStyle.link}>
          <span style={LogoStyle.span}>Cafe Management</span>
        </Link>
        <hr style={LogoStyle.hr} />
      </div>
    )
  }
}

export default Logo