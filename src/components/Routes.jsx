import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Users/Customers'
import Admins from '../pages/Users/Admins'
import Products from '../pages/Products/Products'
import NewProduct from '../pages/Products/NewProduct'

const Routes = () => {
    return (
        <Switch>
            <Route path='/' exact component={Dashboard} />
            <Route path='/customers' component={Customers} />
            <Route path='/admins' component={Admins} />
            <Route path='/products' component={Products} />
            <Route path='/new_product' component={NewProduct} />
        </Switch>
    )
}

export default Routes
