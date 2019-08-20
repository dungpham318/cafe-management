import React, { Component } from 'react'
import Layout from './layout'
import Card from '@material-ui/core/Card'
import TableCard from '../component/TableCard'
import OrderCard from '../component/OrderCard'
import socketIOClient from "socket.io-client"

const styles = {
  tableCard: {
    width: '200px',
    height: '100px',
    border: '1px solid grey',
    margin: '50px 50px 50px 50px',
    borderRadius: '5px',
    fontSize: '20px'
  },
  tableCardChoosed: {
    width: '200px',
    height: '100px',
    border: '1px solid grey',
    margin: '50px 50px 50px 50px',
    borderRadius: '5px',
    fontSize: '20px',
    backgroundColor: 'rgb(112, 171, 143)'
  },
  orderCard: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: 'auto',
    backgroundColor: 'rgba(0,0,0, 0.5)'
  },
  orderCardContent: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    left: '15%',
    right: '25%',
    top: '25%',
    bottom: '25%',
    margin: 'auto',
    background: 'white'
  }
}

class StaffDashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tables: [],
      showPopup: false,
      title: '',
      orderDatas: [],
      currentTable: '',
      currentOrderData: [],
      total: 0,
      style: false
    }
  }

  getListTable = () => {
    fetch('http://localhost:5000/api/get_all_table', {
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
        data.tables.forEach(table => {
          this.setState({
            tables: [
              ...this.state.tables,
              { _id: table._id, name: table.name }
            ]
          })
        })
      })
      .catch(err => console.log(err))
  }

  componentWillMount = async () => {
    await this.getListTable()
    // const socket = socketIOClient('http://localhost:5000/')
    // // socket.on('connect', async () => {
    // //   await socket.emit('authenticate', { token: sessionStorage.getItem('account') })
    // //   await socket.on('GetOrderData', (data) => {
    // //     console.log(data.orderDatas)
    // //   })
    // //   await setInterval(() => {
    // //     socket.emit('OrderData', { orderData: this.state.orderDatas })
    // //   }, 5000)
    // // })
    let orderDatas = JSON.parse(localStorage.getItem('orderDatas'))
    if (orderDatas !== null) {
      this.setState({
        orderDatas: orderDatas
      })
    }
  }

  componentDidMount() {
    this.handleLoad()
  }

  handleLoad = () => {
    setTimeout(() => {
      this.state.orderDatas.forEach(order => {
        document.getElementById(order.table_id).style.backgroundColor = 'rgb(112, 171, 143)'
      })
    }, 1000)
  }

  handleClick = (tableId) => {
    return event => {
      this.state.tables.forEach(table => {
        if (table._id === tableId) {
          this.setState({
            title: table.name,
            currentTable: table._id
          }, () => {
            console.log(this.state.orderDatas)
            this.state.orderDatas.forEach(order => {
              if (order.table_id === tableId) {
                let total = 0
                order.orderData.forEach(data => {
                  total += data.total
                })
                this.setState({
                  currentOrderData: order.orderData,
                  total: total
                })
              }
            })
            this.setState({
              showPopup: !this.state.showPopup
            })
          })
        }
      })
    }
  }

  togglePopup = () => {
    this.setState({
      showPopup: !this.state.showPopup,
      currentOrderData: [],
      total: 0
    })
  }

  updateBill = (orderData) => {
    let check = false
    this.state.orderDatas.forEach(order => {
      if (order.table_id === this.state.currentTable) {
        let id = order.bill_id
        order.orderData = orderData
        localStorage.setItem('orderDatas', JSON.stringify(this.state.orderDatas))
        let newData = {
          billInformation: orderData
        }
        check = true
        fetch(`http://localhost:5000/api//update_one_bill/${id}`, {
          method: 'PATCH',
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem('account'),
          },
          body: JSON.stringify(newData)
        })
          .then(response => {
            return response.json()
          })
          .then(data => {
            if (data.result === true) {
              alert('Updated !')
              return
            } else {
              alert('Error !')
            }
          })
          .catch(err => console.log(err))
      } else {
        check = false
      }
    })
    return check

  }

  saveOrder = (orderData) => {
    return async event => {
      if (orderData.length !== 0) {
        if (this.updateBill(orderData) === false) {
          this.setState({
            orderDatas: [
              ...this.state.orderDatas,
              { table_id: this.state.currentTable, orderData }
            ]
          })

          let newData = {
            "tableId": this.state.currentTable,
            "billInformation": []
          }
          await orderData.forEach(drink => {
            newData.billInformation.push({
              drink_id: drink.drink_id,
              quantity: drink.quantity
            })
          })
          await fetch('http://localhost:5000/api/add_new_bill', {
            method: 'POST',
            mode: 'cors',
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem('account'),
            },
            body: JSON.stringify(newData)

          })
            .then(response => {
              return response.json()
            })
            .then(data => {
              this.state.orderDatas.forEach(order => {
                if (order.table_id === data.bill.table_id) {
                  Object.assign(order, { bill_id: data.bill._id })
                }
              })
              localStorage.setItem('orderDatas', JSON.stringify(this.state.orderDatas))
            })
            .then(alert('Saved !'))
            .catch(err => console.log(err))
        } else {
          return
        }
        document.getElementById(this.state.currentTable).style.backgroundColor = 'rgb(112, 171, 143)'
      } else {
        alert('Please add drink')
      }
    }
  }

  payOrder = () => {
    return event => {
      let check = false
      let pos = 0
      console.log(this.state.orderDatas)
      this.state.orderDatas.forEach(order => {
        if (order.table_id === this.state.currentTable) {
          let id = order.bill_id
          check = true
          let index = pos
          fetch(`http://localhost:5000/api/pay_a_bill/${id}`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem('account'),
            },
          })
            .then(response => {
              return response.json()
            })
            .then(data => {
              if (data.result === true) {
                alert('Done !')
                this.state.orderDatas.splice(index, 1)
                localStorage.setItem('orderDatas', JSON.stringify(this.state.orderDatas))
                this.togglePopup()
                document.getElementById(this.state.currentTable).style.backgroundColor = 'white'
                return
              } else {
                alert('Error !')
              }
            })
            .catch(err => console.log(err))
          return
        } else {
          pos++
        }
      })
      if (check === false) {
        alert('Please save the order !')
      }
    }
  }

  render() {
    const tableList = this.state.tables.map((table) =>
      <TableCard key={table._id} children={table.name} tableCardStyle={styles.tableCard} handleClick={this.handleClick} tableId={table._id} id={table._id} />
    )
    return (
      <Layout title='Dashboard'>
        <div style={{ width: '95%', marginLeft: '2.5%', marginTop: '40px', boxSizing: 'border-box', position: 'relative' }}>
          <Card>
            {tableList}
          </Card>
          {this.state.showPopup ?
            <OrderCard
              text={this.state.title}
              closePopup={this.togglePopup}
              orderCardStyle={styles.orderCard}
              orderCardContent={styles.orderCardContent}
              saveOrder={this.saveOrder}
              orderData={this.state.currentOrderData}
              payOrder={this.payOrder}
              total={this.state.total}
            />
            : null
          }
        </div>
      </Layout>
    )
  }
}

export default StaffDashboard
