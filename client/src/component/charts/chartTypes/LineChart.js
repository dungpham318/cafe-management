import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class LineChart extends Component {
  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
  }

  render() {
    return (
      <Line
        data={this.props.chartData}
        options={{
          title: {
            display: this.props.displayTitle,
            text: 'Revenue by ' + this.props.title,
            fontSize: 18
          },
          legend: {
            display: this.props.displayLegend,
            position: this.props.legendPosition
          }
        }}
      />
    )
  }
}

export default LineChart;