import * as React from "react";
import { Admin, Resource } from "react-admin";

import dataProvider from "./dataProvider";
import authProvider from "./authProvider";

import FilterVintageIcon from "@material-ui/icons/FilterVintage";
import UserIcon from '@material-ui/icons/Group';

import { ProductList, ProductCreate, ProductEdit } from "./products";
import { UserList } from "./users";

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource name="users" list={UserList} icon={UserIcon} />
    <Resource name="admins" list={UserList} />
    <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit} icon={FilterVintageIcon} />
  </Admin>
);

export default App;