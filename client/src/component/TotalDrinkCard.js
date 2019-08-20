import React, { Component } from 'react'
import DashboardInfoCard from './DashboardInfoCard'
import InvertColors from "@material-ui/icons/InvertColors"


class TotalBillCard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      totalDrink: 0
    }
  }

  componentDidMount() {
    // fetch('http://localhost:5000/api/get_total_drink_by_day', {
    //   method: 'GET',
    //   mode: 'cors',
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + sessionStorage.getItem('account')
    //   }
    // })
    //   .then(response => {
    //     return response.json()
    //   })
    //   .then(data => {
    //     this.setState({
    //       totalDrink: data.totalDrink
    //     })
    //   })
    //   .catch(err => console.log(err))
  }

  render() {
    let icon = <InvertColors style={{ fontSize: '25px', paddingTop: '12.5px', color: 'white' }} />
    return (
      <DashboardInfoCard title='Today drinks' icon={icon} color='#3292b6' info={this.props.totalDrink} />
    )
  }
}

export default TotalBillCard