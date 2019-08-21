import React, { Component } from 'react'
import Layout from '../view/layout'
import AccountTable from '../component/AccountTable'

class Account extends Component {
  render() {
    return (
      <Layout title='Account'>
        <div>
          <div>

          </div>
          <div style={{ width: '95%', marginLeft: '2.5%', marginTop: '40px', boxSizing: 'border-box' }}>
            <AccountTable />
          </div>
        </div>
      </Layout>
    )
  }
}

export default Account 