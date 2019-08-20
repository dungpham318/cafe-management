import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const style = {
  root: {
    width: '500px',
    height: '525px',
    float: 'right',
    boxSizing: 'border-box',
    marginTop: '50px',
    marginRight: '50px',
    border: '1px solid #DFE3E8'
  }
}

class Notification extends Component {
  render() {
    return (
      <Card style={style.root}>
        <CardContent>
          <Typography variant='h5' color='textSecondary'>
            Notification
          </Typography>
          <hr />
        </CardContent>
      </Card>
    )
  }
}

export default Notification
