import React, { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { ClipLoader } from "react-spinners"
import { Redirect } from "react-router-dom"

import Table from '../../components/table/Table'
import { categoriesFromEngToRus } from "../../utils/utils"
import ProductsRequestsHandler from "./ProductsRequestsHandler"

const customerTableHead = [
    'Превью',
    'Название',
    'Цена',
    'Категории',
    'Тэги',
    'Цветы',
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderListTags = (list) => {
    return (
        <>
            {list.map((elem) =>
                <span style={{
                    float: "left",
                    background: "#77B6EA",
                    borderRadius: "5px",
                    color: "white",
                    padding: "5px",
                    margin: "0 5px 5px 0",
                    letterSpacing: "1px",
                    cursor: "pointer"
                }} >{elem}</span>
            )}
        </>
    );
}

const renderBody = (setProductIdToRedirect, item, index) => (
    <tr key={index} onClick={() => { setProductIdToRedirect(item.id); }}>
        <td style={{ width: "15%" }}><img src={item.picUrl} alt={``} className="img-fluid img-thumbnail" style={{ margin: "0 !important", padding: "0 !important", width: "auto", height: "auto" }} /></td>
        <td>{item.name}</td>
        <td><b>{item.price} ₽</b></td>
        <td>{renderListTags(item.categories.map((e) => categoriesFromEngToRus(e)))}</td>
        <td>{renderListTags(item.tags)}</td>
        <td>{renderListTags(item.flowers)}</td>
    </tr>
)

const Products = () => {
    const [isFetching, setIsFetching] = useState(true);
    const [productIdToRedirect, setProductIdToRedirect] = useState(-1);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        try {
            ProductsRequestsHandler.getAll().then((res) => {
                setProducts(res);
                console.log("Fetched products: ", products);
                setIsFetching(false);
            });
        } catch (error) {
            alert("Произошла ошибка при получении всех товаров.");
        }
    }, []);

    if (isFetching) {
        return (
            <div className="container">
                <ClipLoader loading={isFetching} />
            </div>
        );
    }

    if (productIdToRedirect !== -1) {
        return (
            <Redirect to={`/edit_product/${productIdToRedirect}`} />
        );
    }

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
                                bodyData={products}
                                renderBody={(item, index) => renderBody(setProductIdToRedirect, item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;