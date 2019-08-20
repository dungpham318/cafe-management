import React, { Component } from 'react'
import NavItemStyle from './../assets/jss/component/navItem-style'
import ListItem from '@material-ui/core/ListItem'
import Logo from './Logo'
import { Link, NavLink } from 'react-router-dom'

const styles = {
  root: {
    width: '15%',
    height: '100vh',
    position: 'fixed',
    textAlign: 'center',
    fontSize: '18px',
    float: 'left',
    // backgroundImage: 'linear-gradient(169deg, rgba(121,58,9,0.6895133053221288) 0%, rgba(121,63,9,0.7679446778711485) 50%, rgba(121,58,9,1) 100%)',
    boxSizing: 'border-box',
    borderRight: '1px solid #DFE3E8'
  },
  account: {
    width: '15%',
    height: '100px',
    position: 'fixed',
    bottom: '0',
    borderTop: '1px solid #DFE3E8'
  },
  icon: {
    width: '60px',
    height: '60px',
    marginTop: '20px',
    marginLeft: '20px',
    border: '1px solid black',
    borderRadius: '50%',
    float: 'left'
  }
}

class NavBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      boder: '',
      backgroundColor: '',
      menuItems: [
        { id: 1, children: 'Dashboard', href: '/dashboard' },
        { id: 2, children: 'Category', href: '/category' },
        { id: 3, children: 'Drink', href: '/drink' },
        { id: 4, children: 'Table', href: '/table' },
        { id: 5, children: 'Bill', href: '/bill' },
        { id: 6, children: 'Account', href: '/account' }
      ],
      selected: false,
      username: ''
    }
    // this.handleClick = this.handleClick.bind(this)
  }

  // handleClick = (item) => {
  //   return event => {
  //     console.log(item.children)
  //     this.state.menuItems.map((menuItem) => {
  //       document.getElementById(menuItem.children).style.border = ''
  //       document.getElementById(menuItem.children).style.backgroundColor = ''
  //     })
  //     document.getElementById(item.children).style.border = '0.5px solid #70AB8F'
  //   }
  // }

  componentDidMount = () => {
    if (sessionStorage.getItem('role') === 'staff') {
      this.setState({
        menuItems: [
          { id: 1, children: 'Dashboard', href: '/dashboard' }
        ]
      })
    }
  }

  logout = () => {
    sessionStorage.removeItem('account')
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('role')
  }

  render() {
    const role = sessionStorage.getItem('role')
    const username = sessionStorage.getItem('username')
    const menuItems = this.state.menuItems.map((menuItem) =>
      <ListItem key={menuItem.id} component={NavLink} to={`/${role}` + menuItem.href} activeStyle={{ border: '0.5px solid #70AB8F', color: '#70AB8F' }} style={NavItemStyle.item} id={menuItem.children} >
        {menuItem.children}
      </ ListItem >
    )
    return (
      <div style={styles.root} >
        <Logo />
        {menuItems}
        <div style={styles.account}>
          <div style={styles.icon}>

          </div>
          <p>{username}</p>
          <Link onClick={this.logout} to='/'>Log out</Link>
        </div>
      </div>
    )
  }

}

export default NavBar
