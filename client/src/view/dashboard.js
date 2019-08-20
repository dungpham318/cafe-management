import React, { Component } from 'react'
import DashboardContentStyle from '../assets/jss/component/dashboardContent-style'
import RevenueChart from '../component/charts/RevenueChart'
import RevenueCard from '../component/RevenueCard'
import TotalBillCard from '../component/TotalBillCard'
import TotalDrinkCard from '../component/TotalDrinkCard'
import DrinkChart from '../component/charts/DrinkChart'
import Notification from '../component/Notification'
import Layout from '../view/layout'
import socketIOClient from "socket.io-client"

class Dashboard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      todayRevenue: 0,
      totalBill: 0,
      totalDrink: 0,
      revenueByHour: [],
      quantityDrink: {
        label: [],
        data: []
      }
    }
  }

  componentDidMount() {
    const socket = socketIOClient('http://localhost:5000/')
    socket.on('connect', async () => {
      await socket.emit('authenticate', { token: sessionStorage.getItem('account') })
      await socket.on('TodayRevenue', (data) => this.setState({ todayRevenue: data.revenue }))
      await socket.on('TodayOrders', (data) => this.setState({ totalBill: data.totalBill }))
      await socket.on('TodayDrinks', (data) => this.setState({ totalDrink: data.totalDrink }))
      await socket.on('RevenueByHour', (data) => this.setState({ revenueByHour: data.revenueByHour }))
      await socket.on('QuantityDrink', (data) => {
        let labels = []
        let quantity = []
        data.quantityDrink.forEach(drink => {
          labels.push(drink.name)
          quantity.push(drink.quantity)
        })
        this.setState({
          quantityDrink: {
            label: labels,
            data: quantity
          }
        })
      })
    })
  }

  render() {
    return (
      <Layout title='Dashboard'>
        <div>
          <div style={DashboardContentStyle.root}>
            <div style={DashboardContentStyle.header}>
              <RevenueCard revenue={this.state.todayRevenue} />
              <TotalBillCard totalBill={this.state.totalBill} />
              <TotalDrinkCard totalDrink={this.state.totalDrink} />
            </div>
            <div style={DashboardContentStyle.content}>
              <RevenueChart data={this.state.revenueByHour} />
              <Notification />
              <DrinkChart label={this.state.quantityDrink.label} data={this.state.quantityDrink.data} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Dashboard 