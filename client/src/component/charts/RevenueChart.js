import React, { Component } from "react"
import LineChart from './chartTypes/LineChart'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

const style = {
  root: {
    width: '1000px',
    float: 'left',
    boxSizing: 'border-box',
    marginTop: '50px',
    marginLeft: '50px',
    border: '1px solid #DFE3E8'
  }
}
class RevenueChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartData: {
        labels: ['8h00', '10h00', '12h00', '14h00', '16h00', '18h00', '20h00', '22h00'],
        datasets: [
          {
            label: 'revenue',
            data: this.props.data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)'
            ]
          }
        ]
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.data) {
      this.setState({
        chartData: {
          labels: ['8h00', '10h00', '12h00', '14h00', '16h00', '18h00', '20h00', '22h00'],
          datasets: [
            {
              label: 'revenue',
              data: nextProps.data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)'
              ]
            }
          ]
        }
      })
    }
  }

  render() {
    return (
      <Card style={style.root}>
        <CardContent>
          <LineChart chartData={this.state.chartData} title={'hour'} legendPosition='bottom' />
        </CardContent>
      </Card>
    )
  }
}

export default RevenueChart