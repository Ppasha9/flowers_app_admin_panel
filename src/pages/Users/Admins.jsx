import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'

import Table from '../../components/table/Table'
import UsersRequestsHandler from './UsersRequestsHandler'

const customerTableHead = [
    'Имя',
    'Почта',
    'Фамилия',
    'Телефон',
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.surname}</td>
        <td>{item.phone}</td>
    </tr>
)

const Admins = () => {
    const [isFetching, setIsFetching] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        try {
            UsersRequestsHandler.getAllUsers(false).then((res) => {
                setUsers(res);
                setIsFetching(false);
            });
        } catch (error) {
            alert("Произошла ошибка при получении списка всех покупателей");
        }
    }, []);

    if (isFetching) {
        return (
            <div className="container">
                <ClipLoader loading={isFetching} />
            </div>
        );
    } else {
        return (
            <div>
                <h2 className="page-header">
                    Админы
                </h2>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card__body">
                                <Table
                                    limit='10'
                                    headData={customerTableHead}
                                    renderHead={(item, index) => renderHead(item, index)}
                                    bodyData={users}
                                    renderBody={(item, index) => renderBody(item, index)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Admins;
