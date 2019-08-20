import React, { Component } from 'react'
import LoginCard from '../component/LoginCard'
import LoginStyle from '../assets/jss/view/login-style'
class Login extends Component {
    render() {
        return (
            <div style={LoginStyle.wrapper}>
                <LoginCard />
            </div >
        );
    }
}
export default Login;   