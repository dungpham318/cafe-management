import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

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
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

class DrinkTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Name', field: 'name',
        },
        { title: 'Price', field: 'price' },
        {
          title: 'Category',
          field: 'categoryId',
          lookup: {}
        },
        { title: 'Date', field: 'date', editable: 'never' }
      ],
      data: [],
      category: []
    }
  }

  componentDidMount = () => {
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
            data: [
              ...this.state.data,
              { _id: drink._id, name: drink.name, price: drink.price, categoryId: drink.categoryId, date: drink.date }
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
        let arr = [...this.state.columns]
        this.state.category.forEach(category => {
          let name = category.name
          let id = category._id
          arr[2] = { ...arr[2], lookup: Object.assign(arr[2].lookup, { [id]: name }) }
        })
        this.setState({
          columns: arr
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <MaterialTable
        title="Drink List"
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
                fetch('http://localhost:5000/api/add_new_drink', {
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
                  fetch(`http://localhost:5000/api/update_one_drink/${id}`, {
                    method: 'PUT',
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
                  fetch(`http://localhost:5000/api/delete_one_drink/${id}`, {
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

export default DrinkTable