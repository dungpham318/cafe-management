import React, { Component } from 'react'
import { ButtonBase } from '@material-ui/core';

class TableCard extends Component {
  render() {
    return (
      <ButtonBase style={this.props.tableCardStyle} onClick={this.props.handleClick(this.props.tableId)} id={this.props.id}>
        {this.props.children}
      </ButtonBase>
    )
  }
}
export default TableCard