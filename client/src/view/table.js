import React, { Component } from 'react'
import Layout from '../view/layout'
import TableTable from '../component/TableTable'

class Table extends Component {
  render() {
    return (
      <Layout title='Drink'>
        <div>
          <div>

          </div>
          <div style={{ width: '95%', marginLeft: '2.5%', marginTop: '40px', boxSizing: 'border-box' }}>
            <TableTable />
          </div>
        </div>
      </Layout>
    )
  }
}

export default Table 