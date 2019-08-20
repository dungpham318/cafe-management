import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';

class PieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: 'right',
    location: 'City'
  }

  render() {
    return (
      <div>
        <Pie
          data={this.props.chartData}
          options={{
            title: {
              display: this.props.displayTitle,
              text: 'Total drinks by' + this.props.title,
              fontSize: 18
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition
            }
          }}
        />
      </div>
    )
  }
}

export default PieChart;