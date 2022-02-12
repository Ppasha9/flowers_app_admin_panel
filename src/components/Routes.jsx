import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Users/Customers'
import Admins from '../pages/Users/Admins'
import Products from '../pages/Products/Products'
import NewProduct from '../pages/Products/NewProduct'
import EditProduct from '../pages/Products/EditProduct'
import Orders from '../pages/Orders/Orders'
import NewOrder from "../pages/Orders/NewOrder";
import Collections from "../pages/Collections/Collections";
import NewCompilation from "../pages/Collections/NewCompilation";

const Routes = () => {
    return (
        <Switch>
            <Route path='/' exact component={Dashboard} />
            <Route path='/customers' component={Customers} />
            <Route path='/admins' component={Admins} />

            <Route path='/products' component={Products} />
            <Route path='/new_product' component={NewProduct} />
            <Route path='/edit_product/:id' component={EditProduct} />

            <Route path='/orders' component={Orders} />
            <Route exact path='/new_order' component={NewOrder} />

            <Route path='/collections' component={Collections} />
            <Route path='/new_compilation' component={NewCompilation} />
        </Switch>
    )
}

export default Routes
