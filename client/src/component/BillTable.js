import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox'
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
};

class BillTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'Table', field: 'table', editable: 'never' },
        { title: 'Date', field: 'date', editable: 'never', },
        { title: 'Started Time', field: 'startedTime', editable: 'never' },
        { title: 'Ended Time', field: 'endedTime', editable: 'never', defaultSort: 'asc' },
        { title: 'Quantity', field: 'quantity', editable: 'never' },
        { title: 'Total', field: 'total', editable: 'never' },
        {
          title: 'Status', field: 'status', editable: 'never',
          sorting: false,
          render: (rowData) => {
            if (rowData.status === 'Paid') {
              return (
                <span style={{ color: 'green' }}>
                  Paid
                </span>
              )
            } else {
              return (
                <span style={{ color: 'red' }}>
                  Unpaid
                </span>
              )
            }
          }
        },

      ],
      data: [],
      detailData: []
    }
  }

  componentDidMount = () => {
    this.setState({
      data: []
    })
    fetch('http://localhost:5000/api/get_all_bill', {
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
        data.bills.forEach(bill => {
          let status = ''
          if (bill.status === true) {
            status = 'Paid'
          } else {
            status = 'Unpaid'
          }
          this.setState({
            data: [
              ...this.state.data,
              { _id: bill._id, table: bill.tableName, date: bill.date, startedTime: bill.startedTime, endedTime: bill.endedTime, quantity: bill.quantity, billInfomation: bill.billInformation, total: bill.total, status: status }
            ]
          })
        })

      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <MaterialTable
        title="Bill List"
        columns={this.state.columns}
        data={this.state.data}
        icons={tableIcons}
        options={{
          exportButton: true,
          rowStyle: {
            backgroundColor: '#EEE',
          },
          headerStyle: {
            backgroundColor: 'rgb(112, 171, 143)',
            color: '#FFF',
            fontSize: '16px'
          },
          pageSize: '10'
        }}
        detailPanel={rowData => {
          let drinkList = []
          console.log(rowData.billInfomation)
          rowData.billInfomation.forEach(data => {
            drinkList.push({ drink: data.name, quantity: data.quantity, price: data.price, total: data.total })
          })
          return (
            <MaterialTable
              title='Bill Detail'
              columns={[
                { title: 'Drink', field: 'drink', editable: 'never' },
                { title: 'Quantity', field: 'quantity', editable: 'never' },
                { title: 'Price', field: 'price', editable: 'never' },
                { title: 'Total', field: 'total', editable: 'never' }
              ]}
              data={drinkList}
              options={{
                search: false,
                paging: false,
                sorting: true,
                defaultSort: 'desc'
              }}
              icons={tableIcons}
            />
          )
        }
        }
      />
    )
  }
}

export default BillTable