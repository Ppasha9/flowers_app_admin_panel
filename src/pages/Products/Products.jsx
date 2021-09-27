import React from "react"
import { Link } from 'react-router-dom'

import Table from '../../components/table/Table'

const customerTableHead = [
    '',
    'Название',
    'Описание',
    'Цена',
    'Категории',
    'Тэги',
    'Цветы',
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

const Products = () => {
    return (
        <div>
            <div className="row">
                <div className="col">
                    <h2 className="page-header">
                        Товары
                    </h2>
                </div>
                <div className="col">
                    <div className="d-flex justify-content-end">
                        <Link to="/new_product">
                            <button type="submit" className="btn btn-primary btn-lg">Добавить</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={[]}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;