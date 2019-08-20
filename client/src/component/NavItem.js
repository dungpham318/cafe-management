import React, { Component } from 'react'

class NavItem extends Component {
  render() {
    return (
      <div style={this.props.style} id={this.props.children} onClick={this.props.handleClick(this.props.children)} >
        {this.props.children}
      </div>
    )
  }
}

export default NavItem