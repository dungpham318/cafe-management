import React, { Component, Fragment } from 'react';

// Material components
import { Drawer } from '@material-ui/core';

// Custom components
import NavBar from '../component/NavBar'
import Header from '../component/Header'
import Footer from '../component/Footer'

const style = {
  root: {
    width: '100%',
    float: 'left'
  },
  navbar: {
    width: '15%',
    float: 'left'
  },
  main: {
    width: '85%',
    float: 'left'
  },
  footer: {
    boxSizing: 'border-box',
    height: '60px',
    marginTop: '40px',
    width: '100%',
    textAlign: 'center',
    float: 'left',
    position: 'relative',
  }
}

class Layout extends Component {
  constructor(props) {
    super(props);

    const isMobile = ['xs', 'sm', 'md'].includes(props.width);

    this.state = {
      isOpen: !isMobile
    };
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  handleToggleOpen = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  };

  render() {
    const { width, children } = this.props;
    const { isOpen } = this.state;

    const isMobile = ['xs', 'sm', 'md'].includes(width);


    return (
      <Fragment>
        <Drawer
          anchor="left"
          onClose={this.handleClose}
          open={isOpen}
          variant={isMobile ? 'temporary' : 'persistent'}
          style={style.navbar}
        >
          <NavBar />
        </Drawer>
        <main style={{ width: '85%', float: 'right' }}>
          <Header children={this.props.title} />
          <div style={{ minHeight: '78vh' }}>
            {children}
          </div>
          <Footer style={style.footer} />
        </main>
      </Fragment>
    );
  }
}

export default Layout