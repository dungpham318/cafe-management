import React, { Component } from 'react'
import Layout from '../view/layout'
import BillTable from '../component/BillTable'

class Bill extends Component {
  render() {
    return (
      <Layout title='Bill'>
        <div>
          <div>

          </div>
          <div style={{ width: '95%', marginLeft: '2.5%', marginTop: '40px', boxSizing: 'border-box' }}>
            <BillTable />
          </div>
        </div>
      </Layout>
    )
  }
}

export default Bill 