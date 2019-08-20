import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import RegisterFormStyle from '../assets/jss/component/registerForm-style'
import { Redirect } from 'react-router'

class SignupForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      //data return
      username: '',
      password: '',
      rePassword: '',
      email: '',
      cafeName: '',
      error: [],
      //validate input
      wrongUsername: false,
      txtUsername: '',
      wrongPassword: false,
      txtPassword: '',
      wrongRePassword: false,
      txtRePassword: '',
      wrongEmail: false,
      txtEmail: '',
      wrongCafeName: false,
      txtCafeName: '',
      check: true,
      done: false
    }

    this.handleChangeUsername = this.handleChangeUsername.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleChangeEmail = this.handleChangeEmail.bind(this)
    this.handleChangeCafeName = this.handleChangeCafeName.bind(this)
    this.handleChangeRePassword = this.handleChangeRePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  // check null username
  checkUserName() {
    if (this.state.username === '') {
      this.setState({
        wrongUsername: true,
        txtUsername: 'Please input username!'
      })
      return false
    } else {
      this.setState({
        wrongUsername: false,
        txtUsername: '',
      })
      return true
    }
  }

  // check null password
  checkPassword() {
    if (this.state.password === '') {
      this.setState({
        wrongPassword: true,
        txtPassword: 'Please input password!'
      })
      return false
    } else {
      this.setState({
        wrongPassword: false,
        txtPassword: '',
      })
      return true
    }
  }

  // check null retype username
  checkRePassword() {
    if (this.state.rePassword === '') {
      this.setState({
        wrongRePassword: true,
        txtRePassword: 'Please input password!'
      })
      return false
    } else {
      this.setState({
        wrongRePassword: false,
        txtRePassword: '',
      })
      return true
    }
  }

  // check password and retype password isMatched
  checkMatchedPassword() {
    if (this.state.password !== this.state.rePassword) {
      this.setState({
        wrongPassword: true,
        txtPassword: "Password doesn't match!",
        wrongRePassword: true,
        txtRePassword: "Password doesn't match!",
      })
      return false
    } else {
      this.setState({
        wrongPassword: false,
        txtPassword: '',
        wrongRePassword: false,
        txtRePassword: ''
      })
      return true
    }
  }

  // check null email
  checkEmail() {
    if (this.state.email === '') {
      this.setState({
        wrongEmail: true,
        txtEmail: 'Please input email!'
      })
      return false
    } else {
      this.setState({
        wrongEmail: false,
        txtEmail: '',
      })
      return true
    }
  }

  // check null cafe name
  checkCafeName() {
    if (this.state.cafeName === '') {
      this.setState({
        wrongCafeName: true,
        txtCafeName: 'Please input cafe name!'
      })
      return false
    } else {
      this.setState({
        wrongCafeName: false,
        txtCafeName: '',
      })
      return true
    }
  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value }, () => {
      this.checkUserName()
    })
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value }, () => {
      this.checkPassword()
    })
  }

  handleChangeRePassword(event) {
    this.setState({ rePassword: event.target.value }, () => {
      this.checkRePassword(this.state.rePassword)
      this.checkMatchedPassword()
    })
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value }, () => {
      this.checkEmail()
    })
  }

  handleChangeCafeName(event) {
    this.setState({ cafeName: event.target.value }, () => {
      this.checkCafeName()
    })
  }

  handleSubmit(event) {
    // run check null
    this.checkUserName()
    this.checkPassword()
    this.checkRePassword()
    this.checkEmail()
    this.checkCafeName()
    if (this.checkUserName() === false || this.checkPassword() === false || this.checkRePassword() === false
      || this.checkEmail() === false || this.checkCafeName() === false) {
      event.preventDefault()
      return
    }

    // post to the api
    fetch('http://localhost:5000/api/signup', {
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
        this.setState({
          error: data
        },
          // check return json
          () => {
            for (let i = 0; i < this.state.error.length; i++) {
              let error = this.state.error[i]
              if (error === 'username') {
                this.setState({
                  wrongUsername: true,
                  txtUsername: 'Username already exists!',
                  check: false
                })
              }
              if (error === 'email') {
                this.setState({
                  wrongEmail: true,
                  txtEmail: 'Email already exists!',
                  check: false
                })
              }
              if (error === 'cafeName') {
                this.setState({
                  wrongCafeName: true,
                  txtCafeName: 'Cafe name already exists!',
                  check: false
                })
              }
            }
          })
      })
      .then(() => {
        if (this.state.check === false) {
          event.preventDefault()
        } else {
          alert('Sign Up done!')
          this.setState({
            done: true
          })
        }
      })
      .then(() => {
        this.props.handleStatus(this.state.check)
      })
      .catch(err => console.log(err))
    event.preventDefault()
  }

  render() {
    if (this.state.done === true) {
      return <Redirect to="/login" />
    }
    return (
      <div>
        <Card style={RegisterFormStyle.Card}>
          <div style={RegisterFormStyle.wrapper}>
            <form method='POST' onSubmit={this.handleSubmit}>
              <TextField
                error={this.state.wrongUsername}
                label="Username"
                margin="normal"
                name='username'
                onChange={this.handleChangeUsername}
                helperText={this.state.txtUsername}
                style={RegisterFormStyle.TextField}
              />
              <br />
              <TextField
                error={this.state.wrongPassword}
                label="Password"
                margin="normal"
                type="password"
                name='password'
                onChange={this.handleChangePassword}
                helperText={this.state.txtPassword}
                style={RegisterFormStyle.TextField}
              />
              <br />
              <TextField
                error={this.state.wrongRePassword}
                label="Retype the password"
                margin="normal"
                type="password"
                name='reRassword'
                onChange={this.handleChangeRePassword}
                helperText={this.state.txtRePassword}
                style={RegisterFormStyle.TextField}
              />
              <br />
              <TextField
                error={this.state.wrongEmail}
                label="Email"
                type="email"
                margin="normal"
                name='email'
                onChange={this.handleChangeEmail}
                helperText={this.state.txtEmail}
                style={RegisterFormStyle.TextField}
              />
              <br />
              <TextField
                error={this.state.wrongCafeName}
                label="Cafe name"
                margin="normal"
                name='cafeName'
                onChange={this.handleChangeCafeName}
                helperText={this.state.txtCafeName}
                style={RegisterFormStyle.TextField}
              />
              <br />
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                type='submit'
              >
                Submit
            </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }
}

export default SignupForm;

