import React, { Component } from 'react'
import Layout from '../view/layout'
import CategoryTable from '../component/CategoryTable'

class Category extends Component {
  render() {
    return (
      <Layout title='Category'>
        <div>
          <div>

          </div>
          <div style={{ width: '95%', marginLeft: '2.5%', marginTop: '40px', boxSizing: 'border-box' }}>
            <CategoryTable />
          </div>
        </div>
      </Layout>
    )
  }
}

export default Category 