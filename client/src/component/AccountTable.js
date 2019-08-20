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

class AccountTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'Username', field: 'username', editable: 'onAdd' },
        { title: 'Password', field: 'password' },
        { title: 'Role', field: 'role', editable: 'never' },
        { title: 'Date', field: 'date', editable: 'never' }
      ],
      data: []
    }
  }

  componentDidMount = () => {
    this.setState({
      data: []
    })
    fetch('http://localhost:5000/api/get_all_staff_account', {
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
        data.accounts.forEach(account => {
          this.setState({
            data: [
              ...this.state.data,
              { _id: account._id, username: account.username, password: '******', role: account.role, date: account.date }
            ]
          })
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <MaterialTable
        title="Account List"
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
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                fetch('http://localhost:5000/api/create_new_staff_account', {
                  method: 'POST',
                  mode: 'cors',
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem('account'),
                  },
                  body: JSON.stringify(newData)
                })
                  .then(response => { return response.json })
                this.componentDidMount()
                resolve()
              }, 1000)
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  let id = oldData._id
                  fetch(`http://localhost:5000/api/update_one_account/${id}`, {
                    method: 'PATCH',
                    mode: 'cors',
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newData)
                  })
                    .then(response => { return response.json })
                  const data = this.state.data
                  const index = data.indexOf(oldData)
                  data[index] = newData
                  newData.password = '******'
                  console.log(data)
                  this.setState({ data }, () => resolve())
                }
                resolve()
              }, 1000)
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  let id = oldData._id
                  fetch(`http://localhost:5000/api/delete_one_account/${id}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then(response => { return response.json })
                  let data = this.state.data
                  const index = data.indexOf(oldData)
                  data.splice(index, 1);
                  this.setState({ data }, () => resolve())
                }
                resolve()
              }, 1000)
            }),
        }}
      />
    )
  }
}

export default AccountTable