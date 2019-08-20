import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

class DashboardInfoCard extends Component {
  render() {
    const style = ({
      root: {
        boxSizing: 'border-box'
      },
      card: {
        width: '300px',
        height: '100px',
        marginTop: '55px',
        float: 'left',
        marginLeft: '175px',
        boxSizing: 'border-box'
      },
      info: {
        width: '180px',
        height: '100px',
        boxSizing: 'border-box',
        marginTop: '10px',
        marginLeft: '20px',
        float: 'left'
      },
      icon: {
        float: 'right',
        width: '50px',
        height: '50px',
        backgroundColor: this.props.color,
        textAlign: 'center',
        borderRadius: '50%',
        marginTop: '10px',
        marginRight: '10px'
      }
    })

    return (
      <div style={style.root}>
        <Card style={style.card}>
          <CardContent style={style.content}>
            <div style={style.info}>
              <Typography variant='subtitle1' color='textSecondary'>
                {this.props.title}
              </Typography>
              <Typography variant='h5'>
                {this.props.info}
              </Typography>
            </div>
            <div style={style.icon}>
              {this.props.icon}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default DashboardInfoCard