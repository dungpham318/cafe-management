import React, { Component } from 'react'
import Layout from '../view/layout'
import DrinkTable from '../component/DrinkTable'

class Drink extends Component {
  render() {
    return (
      <Layout title='Drink'>
        <div>
          <div>

          </div>
          <div style={{ width: '95%', marginLeft: '2.5%', marginTop: '40px', boxSizing: 'border-box' }}>
            <DrinkTable />
          </div>
        </div>
      </Layout>
    )
  }
}

export default Drink 