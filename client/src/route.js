// import Loadable from 'react-loadable';
import React, { Component } from 'react';
// import CircularIndeterminate from './component/Progress'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from './view/login'
import Register from './view/register'
import Dashboard from './view/dashboard'
import Category from './view/category'
import Drink from './view/drink'
import Table from './view/table'
import Bill from './view/bill'
import Account from './view/account'
import StaffDashboard from './view/staffDashboard'

// const Loading = () => <CircularIndeterminate />;

// const route = {
//   login: Loadable({
//     loader: () => import('./view/login'),
//     loading: Loading,
//   }),
//   register: Loadable({
//     loader: () => import('./view/register'),
//     loading: Loading,
//   }),
//   adminDashboard: Loadable({
//     loader: () => import('./view/dashboard'),
//     loading: Loading,
//   }),
//   staffDashboard: Loadable({
//     loader: () => import('./view/staffDashboard'),
//     loading: Loading
//   })
// }

class RouteCLient extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: sessionStorage.getItem('account'),
      role: sessionStorage.getItem('role')
    }
  }

  render() {
    var loggedIn = sessionStorage.getItem('account')
    var role = sessionStorage.getItem('role')
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => {
            if (sessionStorage.getItem('account')) {
              return <Redirect to='/dashboard' />
            } else {
              return <Login />
            }
          }} />
          <Route path="/login" component={() => {
            if (loggedIn) {
              return <Redirect to='/dashboard' />
            } else {
              return <Login />
            }
          }} />
          <Route path="/signup" component={() => {
            if (loggedIn) {
              return <Redirect to='/dashboard' />
            } else {
              return <Register />
            }
          }} />
          <Route path="/dashboard" component={() => {
            if (role === 'admin') {
              return <Redirect to='/admin/dashboard' />
            } else if (role === 'staff') {
              return <Redirect to='/staff/dashboard' />
            }
          }} />
          <Route path="/admin/dashboard" component={() => {

            if (sessionStorage.getItem('account') && sessionStorage.getItem('role') === 'admin') {
              return <Dashboard />
            } else {
              return <Redirect to='/login' />
            }
          }} />
          <Route path="/staff/dashboard" component={() => {
            if (sessionStorage.getItem('account') && sessionStorage.getItem('role') === 'staff') {
              return <StaffDashboard />
            } else {
              return <Redirect to='/login' />
            }
          }} />
          <Route path="/admin/category" component={() => {
            if (sessionStorage.getItem('account') && sessionStorage.getItem('role') === 'admin') {
              return <Category />
            } else {
              return <Redirect to='/login' />
            }
          }}>
          </Route>
          <Route path="/admin/drink" component={() => {
            if (sessionStorage.getItem('account') && sessionStorage.getItem('role') === 'admin') {
              return <Drink />
            } else {
              return <Redirect to='/login' />
            }
          }}>
          </Route>
          <Route path="/admin/table" component={() => {
            if (sessionStorage.getItem('account') && sessionStorage.getItem('role') === 'admin') {
              return <Table />
            } else {
              return <Redirect to='/login' />
            }
          }}>
          </Route>
          <Route path="/admin/bill" component={() => {
            if (sessionStorage.getItem('account') && sessionStorage.getItem('role') === 'admin') {
              return <Bill />
            } else {
              return <Redirect to='/login' />
            }
          }}>
          </Route>
          <Route path="/admin/account" component={() => {
            if (sessionStorage.getItem('account') && sessionStorage.getItem('role') === 'admin') {
              return <Account />
            } else {
              return <Redirect to='/login' />
            }
          }}>
          </Route>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default RouteCLient