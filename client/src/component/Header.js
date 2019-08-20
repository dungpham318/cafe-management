import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const style = {
  a: {
    textDecoration: 'none',
    color: 'black',
  }
}

class Header extends Component {
  render() {
    return (
      <div style={style.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              {this.props.children}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;