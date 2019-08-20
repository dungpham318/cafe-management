import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LoginFormStyle from '../assets/jss/component/loginForm-style'
import { Redirect } from 'react-router-dom'

class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      role: '',
      wrongUsername: false,
      txtUsername: '',
      wrongPassword: false,
      txtPassword: ''
    };
    this.handleChangeUsername = this.handleChangeUsername.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  checkUsername = () => {
    if (this.state.username === '') {
      this.setState({
        wrongUsername: true,
        txtUsername: "Please input username"
      })
      return false
    } else {
      this.setState({
        wrongUsername: false,
        txtUsername: ''
      })
      return true
    }
  }

  checkPassword = () => {
    if (this.state.password === '') {
      this.setState({
        wrongPassword: true,
        txtPassword: "Please input password"
      })
      return false
    } else {
      this.setState({
        wrongPassword: false,
        txtPassword: ''
      })
      return true
    }
  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value }, () => {
      this.checkUsername()
    })
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value }, () => {
      this.checkPassword()
    })
  }

  handleSubmit = (event) => {
    let check = true
    this.checkUsername()
    this.checkPassword()
    if (this.checkUsername() === false || this.checkPassword() === false) {
      event.preventDefault()
      return
    }
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state)
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data === 'username') {
          this.setState({
            txtUsername: "Can't found this username!",
            wrongUsername: true
          })
          check = false
          return
        }
        if (data === 'password') {
          this.setState({
            txtPassword: "Password is wrong!",
            wrongPassword: true
          })
          check = false
          return
        }
        sessionStorage.setItem('account', data.token)
      })
      .then(() => {
        if (check === false) {
          return
        }
        fetch('http://localhost:5000/api/dashboard', {
          method: 'GET',
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem('account')
          }
        })
          .then(response => {
            return response.json()
          })
          .then(data => {
            sessionStorage.setItem('role', data.role)
            sessionStorage.setItem('username', data.username)
            this.setState({
              role: data.role
            })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
    event.preventDefault()
  }

  render() {
    if (this.state.role === 'admin') {
      return <Redirect to='/admin/dashboard' />
    } else if (this.state.role === 'staff') {
      return <Redirect to='/staff/dashboard' />
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit} method='POST'>
          <TextField
            id="standard-dense"
            label="Username"
            margin="normal"
            name="username"
            onChange={this.handleChangeUsername}
            helperText={this.state.txtUsername}
            error={this.state.wrongUsername}
          />
          <br />
          <TextField
            id="standard-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            margin="normal"
            name="password"
            onChange={this.handleChangePassword}
            helperText={this.state.txtPassword}
            error={this.state.wrongPassword}
          />
          <br />
          <br />

          <Button variant="contained" color="primary" style={LoginFormStyle.button} type='submit'>
            Login
          </Button>

          <Button variant="contained" color="secondary" style={LoginFormStyle.button} href="/signup">
            Sign Up
          </Button>

          {/* {
            loggedIn === 'admin' && (
              <Redirect to='/dashboard' />
            )
          } */}
        </form>
      </div >


    );
  }
}

export default LoginForm;