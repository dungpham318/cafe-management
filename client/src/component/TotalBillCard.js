import React, { Component } from 'react'
import DashboardInfoCard from './DashboardInfoCard'
import Assignment from "@material-ui/icons/Assignment"

class TotalBillCard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      totalBill: 0
    }
  }

  componentDidMount() {
    // fetch('http://localhost:5000/api/get_total_bill_by_day', {
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
    //       bill: data.totalBill
    //     })
    //   })
    //   .catch(err => console.log(err))
  }

  render() {
    let icon = <Assignment style={{ fontSize: '25px', paddingTop: '12.5px', color: 'white' }} />
    return (
      <DashboardInfoCard title='Today orders' icon={icon} color='#ebb041' info={this.props.totalBill} />
    )
  }
}

export default TotalBillCard