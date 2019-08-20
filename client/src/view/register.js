import React, { Component } from 'react'
import SignupForm from '../component/SignupForm'
import Header from '../component/Header'

class RegisterView extends Component {
    render() {
        return (
            <div className="wrapper">
                <Header children='Cafe Management' />
                <br />
                <br />
                <br />
                <SignupForm />
            </div>
        );
    }
}

export default RegisterView;