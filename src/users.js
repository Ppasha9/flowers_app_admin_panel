import * as React from "react";
import {
    List,
    Datagrid,
    TextField,
    EmailField
} from "react-admin";

export const UserList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="code" />
            <TextField source="name" />
            <TextField source="surname" />
            <EmailField source="email" />
            <TextField source="phone" />
        </Datagrid>
    </List>
);