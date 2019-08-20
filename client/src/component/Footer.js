import React, { Component } from 'react'
import Divider from '@material-ui/core/Divider'

class Footer extends Component {
  render() {
    return (
      <div style={this.props.style}>
        <Divider />
        <br />
        <span>
          dp &copy; 2019
        </span>
      </div>
    )
  }
}

export default Footer