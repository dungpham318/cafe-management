import React, { Component } from 'react'
import DrinkList from './DrinkList'
import OrderList from './OrderList'
import Button from '@material-ui/core/Button'

class OrderCard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      category: [],
      drinkColumns: [
        {
          title: 'Category',
          field: 'categoryId',
          lookup: {},
          defaultGroupOrder: 0
        },
        { title: 'Drink', field: 'drink' },
        { title: 'Price', field: 'price' },
      ],
      drinkData: [],
      orderColumns: [
        { title: 'Drink', field: 'drink', editable: 'false' },
        { title: 'Quantity', field: 'quantity' },
        { title: 'Total', field: 'total', editable: 'false' },
      ],
      orderData: this.props.orderData,
      total: this.props.total
    }
  }

  componentDidMount = () => {
    if (this.props.orderData.lenght === 0) {
      this.setState({
        orderData: this.state.orderData
      })
    }
    if (this.props.total === 0) {
      this.setState({
        total: this.state.total
      })
    }
    this.getAllDrink()
  }

  getAllDrink = () => {
    this.getAllCategory()
    this.setState({
      data: []
    })
    fetch('http://localhost:5000/api/get_all_drink', {
      method: 'GET',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem('account')
      }
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        data.drinks.forEach(drink => {
          this.setState({
            drinkData: [
              ...this.state.drinkData,
              { drink_id: drink._id, drink: drink.name, price: drink.price, categoryId: drink.categoryId }
            ]
          })
        })
      })
      .catch(err => console.log(err))
  }

  getAllCategory = () => {
    fetch('http://localhost:5000/api/get_all_category', {
      method: 'GET',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem('account')
      }
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        data.categorys.forEach(category => {
          this.setState({
            category: [
              ...this.state.category,
              { _id: category._id, name: category.name }
            ]
          })
        })
        let arr = [...this.state.drinkColumns]
        this.state.category.forEach(category => {
          let name = category.name
          let id = category._id
          arr[0] = { ...arr[0], lookup: Object.assign(arr[0].lookup, { [id]: name }) }
        })
        this.setState({
          drinkColumns: arr
        })
      })
      .catch(err => console.log(err))
  }

  addDrink = async (drink) => {
    let i = 0
    let arr = this.state.orderData
    let check = true
    let total = 0
    await this.state.orderData.forEach(order => {
      if (order.drink_id === drink.drink_id) {
        check = false
        arr[i].quantity = arr[i].quantity + 1
        arr[i].total = Number(arr[i].price) * Number(arr[i].quantity)
        this.setState({
          orderData: arr
        })
        this.state.orderData.forEach(order => {
          total = total + order.total
        })
        this.setState({
          total: total
        })
      }
      i++
    })
    if (check === true) {
      await this.setState({
        orderData: [
          ...this.state.orderData,
          { drink_id: drink.drink_id, drink: drink.drink, quantity: 1, price: drink.price, total: drink.price }
        ]
      })

      await this.state.orderData.forEach(order => {
        total = total + order.total
      })
      await this.setState({
        total: total
      })
    }
  }

  render() {
    return (
      <div style={this.props.orderCardStyle}>
        <div style={this.props.orderCardContent} >
          <h1>{this.props.text}</h1>
          <div style={{ width: '45%', marginLeft: '20px', float: 'left' }}>
            <DrinkList columns={this.state.drinkColumns} drinkData={this.state.drinkData} addDrink={this.addDrink} />
          </div>
          <div style={{ width: '45%', marginRight: '20px', float: 'right' }}>
            <OrderList columns={this.state.orderColumns} drinkData={this.state.orderData} />
          </div>

          <div style={{ float: 'right', width: '45%', marginTop: '40px' }}>
            <h3>Total: {this.state.total}</h3>
            <Button style={{ float: 'right', paddingRight: '10px', position: 'absolute', bottom: '20px', right: '20px' }} onClick={this.props.closePopup} variant="contained" color="secondary" >Close</Button>
            <Button style={{ float: 'right', paddingRight: '10px', position: 'absolute', bottom: '20px', right: '120px' }} onClick={this.props.saveOrder(this.state.orderData)} variant="contained">Save</Button>
            <Button style={{ float: 'right', paddingRight: '10px', position: 'absolute', bottom: '20px', right: '220px' }} onClick={this.props.payOrder()} variant="contained" color="primary" >Pay</Button>
          </div>
        </div>
      </div>
    )
  }

}

export default OrderCard