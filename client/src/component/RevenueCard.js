import React, { Component } from 'react'
import DashboardInfoCard from './DashboardInfoCard'
import AccountBalanceWallet from "@material-ui/icons/AccountBalanceWallet"


class RevenueCard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      revenue: 0
    }
  }

  // componentDidMount() {
  //   fetch('http://localhost:5000/api/get_total_revenue_by_day', {
  //     method: 'GET',
  //     mode: 'cors',
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + sessionStorage.getItem('account')
  //     }
  //   })
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(data => {
  //       this.setState({
  //         revenue: data.revenue
  //       })
  //     })
  //     .catch(err => console.log(err))
  // }

  render() {
    let icon = <AccountBalanceWallet style={{ fontSize: '25px', paddingTop: '12.5px', color: 'white' }} />
    return (
      <DashboardInfoCard title='Today revenue' icon={icon} color='#ED4740' info={this.props.revenue} />
    )
  }
}

export default RevenueCard