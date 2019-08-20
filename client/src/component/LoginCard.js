import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LoginForm from './LoginForm'
import LoginCardStyle from '../assets/jss/component/loginCard-style'
import '../assets/css/index.css'

class LoginCard extends Component {
  render() {
    return (
      <Card style={LoginCardStyle.Card}>
        <CardContent style={LoginCardStyle.Content}>
          <Typography variant="h5" component="h1">
            Cafe Management
                    </Typography>
          <Typography color="textSecondary" gutterBottom>
            Login
                    </Typography>
          <LoginForm />
        </CardContent>
      </Card>
    );
  }
}

export default LoginCard;