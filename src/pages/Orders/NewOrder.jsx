import React, {useCallback, useEffect, useState} from "react";
import {default as ReactSelect} from "react-select";

import {AiFillDelete} from "react-icons/ai";
import {ClipLoader} from "react-spinners";
import Form from "react-bootstrap/Form";

import "./NewOrder.css"

import categories_items from "../../assets/JsonData/categories-list.json"
import ProductsRequestsHandler from "../Products/ProductsRequestsHandler";
import {Redirect} from "react-router-dom";
import OrdersRequestsHandler from "./OrdersRequestsHandler";

const SelectedProductComponent = ({ prInfo, selectedParamsInfo, index, deleteProduct }) => {
    console.log("selectedParamsInfo", selectedParamsInfo)

    const onDelete = (idx) => {
        let prFinalPrice = prInfo.price
        Object.keys(selectedParamsInfo).map((k) => {
            prFinalPrice += selectedParamsInfo[k].value.pPrice
        })
        deleteProduct(prInfo.id, index, prFinalPrice)
    }

    return (
        <div>
            <tr key={index}>
                <td style={{width: "15%"}}>
                    <div className="widget-26-job-emp-img">
                        <img
                            src={prInfo.picUrl}
                            alt={``}
                            className="img-fluid"
                            style={{ margin: "0 !important", padding: "0 !important", width: "auto", height: "auto" }} />
                    </div>
                </td>
                <td>
                    <div>
                        {prInfo.name} <br/> <b>{prInfo.price} ₽</b>
                    </div>
                </td>
                <td style={{width: "50%"}}>
                    <div className="form-control">
                        {Object.keys(selectedParamsInfo).length === 0 &&
                            <div className="form-label">
                                <span>У этого товара нет параметров</span>
                            </div>
                        }
                        {Object.keys(selectedParamsInfo).length > 0 &&
                            <div className="form-label">
                                <span>Выберите параметры перед тем, как добавить товар в заказ</span>
                                <ul className="list-group">
                                    {Object.keys(selectedParamsInfo).map((pName) => {
                                        return (
                                            <li className="list-group-item">
                                                <label htmlFor="selectParam">{pName}: {selectedParamsInfo[pName].label}</label>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        }
                    </div>
                </td>
                <td>
                    <button className="btn" onClick={() => onDelete(index)}>
                        <AiFillDelete size="1.5rem" />
                    </button>
                </td>
            </tr>
        </div>
    )
}

const SearchProductComponent = ({ prInfo, index, selectProduct }) => {
    const [paramsInfo, setParamsInfo] = useState({});

    let paramsByNames = {}
    let paramsNames = []
    prInfo.parameters.map((param) => {
        if (paramsByNames[param.name] != null) {
            paramsByNames[param.name].push({
                "value": {
                    "pValue": param.value,
                    "pPrice": param.price
                },
                "label": `${param.value} (+ ${param.price} ₽)`})
        } else {
            paramsByNames[param.name] = [{
                "value": {
                    "pValue": param.value,
                    "pPrice": param.price
                },
                "label": `${param.value} (+ ${param.price} ₽)`}]
            paramsNames.push(param.name)
        }
    })

    const onParamSelect = (pName, selectedValue) => {
        paramsInfo[pName] = selectedValue
        setParamsInfo(paramsInfo)
        console.log("paramsInfo", paramsInfo)
    }

    const checkAllParamsSelected = () => {
        let paramsSelectedBool = paramsNames.map((pName) => { return Object.keys(paramsInfo).some((k) => pName === k)})
        return !paramsSelectedBool.some(v => v === false)
    }

    const onSelectBtnClicked = (e) => {
        e.preventDefault()

        if (!checkAllParamsSelected()) {
            alert("Сначала выберите все параметры")
            return
        }

        selectProduct(prInfo, paramsInfo)
    }

    return (
        <div className="form-group">
            <tr key={index}>
                <td style={{width: "15%"}}>
                    <div className="widget-26-job-emp-img">
                        <img
                            src={prInfo.picUrl}
                            alt={``}
                            className="img-fluid"
                            style={{ margin: "0 !important", padding: "0 !important", width: "auto", height: "auto" }} />
                    </div>
                </td>
                <td>
                    <div className="form-control widget-26-job-title">
                        {prInfo.name} <br/> <b>{prInfo.price} ₽</b>
                    </div>
                </td>
                <td style={{width: "50%"}}>
                    <div className="form-control">
                         {paramsNames.length === 0 &&
                            <div className="form-label">
                                <span>У этого товара нет параметров</span>
                            </div>
                        }
                        {paramsNames.length > 0 &&
                            <div className="form-label">
                                <span>Выберите параметры перед тем, как добавить товар в заказ</span>
                                <ul className="list-group">
                                    {paramsNames.map((pName) => {
                                        return (
                                            <li className="list-group-item">
                                                <label htmlFor="selectParam">{pName}:</label>
                                                <div className="form-group">
                                                    <span
                                                        data-toggle="popover"
                                                        data-trigger="focus"
                                                        id="selectParam"
                                                    >
                                                        <ReactSelect
                                                            options={paramsByNames[pName]}
                                                            placeholder="Выберите..."
                                                            onChange={(selected) => {
                                                                onParamSelect(pName, selected)
                                                            }}
                                                        />
                                                    </span>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        }
                    </div>
                </td>
                <td>
                    <button className="btn btn-primary btn-md" onClick={onSelectBtnClicked}>
                        Выбрать товар
                    </button>
                </td>
            </tr>
        </div>
    )
}

const NewOrder = (props) => {
    const [orderShortDescription, setOrderShortDescription] = useState("");
    const [consumerName, setConsumerName] = useState("");
    const [consumerPhone, setConsumerPhone] = useState("");
    const [consumerEmail, setConsumerEmail] = useState("");
    const [inputProductByDescrs, setInputProductByDescrs] = useState(true);
    const [inputProductBySelecting, setInputProductBySelecting] = useState(false);
    const [productsDescrs, setProductsDescrs] = useState("");

    const [category, setCategory] = useState("");
    const [searchText, setSearchText] = useState("");

    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [ignoredProductsIds, setIgnoredProductsIds] = useState([]);

    const [orderPrice, setOrderPrice] = useState(0);

    const [checkPickupDelivery, setCheckPickupDelivery] = useState(true);
    const [checkCourierDelivery, setCheckCourierDelivery] = useState(false);

    const [consumerStreet, setConsumerStreet] = useState("");
    const [consumerHouseNum, setConsumerHouseNum] = useState("");
    const [consumerApartmentNum, setConsumerApartmentNum] = useState("");
    const [deliveryComment, setDeliveryComment] = useState("");

    const [isOrderCreating, setIsOrderCreating] = useState(false);

    let columnNameToAddTo = ""
    if (Object.keys(props.location).some(v => v === "state")) {
        columnNameToAddTo = props.location.state
    }

    let testDate = new Date(columnNameToAddTo)
    let isValidDate = !isNaN(testDate)

    const [deliveryDate, setDeliveryDate] = useState(columnNameToAddTo === "" || !isValidDate ? new Date() : new Date(columnNameToAddTo));
    const [deliveryDateString, setDeliveryDateString] = useState(columnNameToAddTo === "" || !isValidDate ? "" : columnNameToAddTo);

    const [needRedirectToOrders, setNeedRedirectToOrders] = useState(false);

    const onCategoryChange = (selected) => {
        if (selected != null) {
            setCategory(selected.value);
        }
    }

    const onSearchTextChange = (e) => {
        setSearchText(e.target.value);
    }

    const onSearchClicked = (e) => {
        e.preventDefault();
        if (inputProductBySelecting && searchText !== "") {
            try {
                ProductsRequestsHandler.searchByCategoryAndText(category, searchText).then((res) => {
                    setProducts(res);
                    console.log("Fetched products: ", res);
                })
            } catch (error) {
                alert("Произошла ошибка при получении всех товаров.");
            }
        }
    }

    const onSelectProduct = (prInfo, selectedParamsInfo) => {
        setSelectedProducts([...selectedProducts, {"prInfo": prInfo, "selectedParamsInfo": selectedParamsInfo}])
        setIgnoredProductsIds([...ignoredProductsIds, prInfo.id])
        let prFinalPrice = prInfo.price
        Object.keys(selectedParamsInfo).map((k) => {
            prFinalPrice += selectedParamsInfo[k].value.pPrice
        })
        setOrderPrice(orderPrice + prFinalPrice)
    }

    const onDeleteProduct = (prInfoId, prIndex, prFinalPrice) => {
        setSelectedProducts(selectedProducts.filter((sp, index) => {
            return index !== prIndex
        }))
        setIgnoredProductsIds(ignoredProductsIds.filter((id) => {
            return id !== prInfoId
        }))
        setOrderPrice(orderPrice - prFinalPrice)
    }

    const onSubmitOrder = (e) => {
        e.preventDefault()

        if (orderShortDescription === "") {
            alert("Заполните краткое описание заказа")
            return
        }

        if (consumerName === "") {
            alert("Заполните имя получателя")
            return
        }

        if (consumerEmail === "" && consumerPhone === "") {
            alert("Заполните почту или номер телефона покупателя")
            return
        }

        if (inputProductByDescrs) {
            if (productsDescrs === "") {
                alert("Заполните описание товаров")
                return
            }

            if (orderPrice === 0) {
                alert("Заполните цену заказа")
                return
            }
        }

        if (inputProductBySelecting) {
            if (selectedProducts.length === 0) {
                alert("Выберите товары для заказа")
                return
            }
        }

        if (checkCourierDelivery) {
            if (consumerStreet === "" || consumerHouseNum === "" || consumerApartmentNum === "") {
                alert("Заполните данные о доставке курьером")
                return
            }
        }

        if (deliveryDateString === "") {
            alert("Выберите дату")
            return
        }

        setIsOrderCreating(true)

        let reqBody = {
            "receiverName": consumerName,
            "receiverPhone": consumerPhone,
            "receiverEmail": consumerEmail,
            "receiverStreet": consumerStreet,
            "receiverHouseNum": consumerHouseNum,
            "receiverApartmentNum": consumerApartmentNum,
            "deliveryComment": deliveryComment,
            "deliveryMethod": checkPickupDelivery ? "pickup" : "courier",
            "paymentMethod": "cash",
            "shortDescription": orderShortDescription,
            "productsDescription": productsDescrs,
            "price": orderPrice,
            "deliveryDate": deliveryDate,
            "columnName": deliveryDateString,
            "selectedProductsDescrs": [],
        }

        if (inputProductBySelecting) {
            selectedProducts.map((pr) => {
                let prInfoToAdd = {
                    "id": pr.prInfo.id,
                    "parameters": [],
                }

                let selectedParams = Object.keys(pr.selectedParamsInfo)
                if (selectedParams.length > 0) {
                    selectedParams.map((pName) => {
                        prInfoToAdd.parameters.push(
                            {
                                "name": pName,
                                "value": pr.selectedParamsInfo[pName].value.pValue,
                                "price": pr.selectedParamsInfo[pName].value.pPrice,
                            }
                        )
                    })
                }

                reqBody.selectedProductsDescrs.push(prInfoToAdd)
            })
        }

        OrdersRequestsHandler.createNewOrder(reqBody).then(() => {
            setIsOrderCreating(false)
            setNeedRedirectToOrders(true)
        })
    }

    if (needRedirectToOrders) {
        return (
            <Redirect to="/orders" />
        );
    }

    return (
        <div>
            <h2 className="page-header">
                Новый заказ
            </h2>

            <h4>Основная информация</h4>
            <div className="form-group" style={{marginBottom: '10px'}}>
                <label htmlFor="inputContent">Описание</label>
                <input type="text" className="form-control" id="inputContent" value={orderShortDescription}
                          placeholder="Короткое описание заказа" onChange={(e) => setOrderShortDescription(e.target.value)}/>
            </div>
            <div className="form-group" style={{marginBottom: '10px'}}>
                <label htmlFor="inputConsumerName">Данные покупателя</label>
                <input type="text" className="form-control" id="inputConsumerName" value={consumerName}
                       placeholder="Имя покупателя" onChange={(e) => setConsumerName(e.target.value)}/>
                <input type="text" className="form-control" id="inputConsumerPhone" value={consumerPhone} style={{marginTop: '5px'}}
                       placeholder="Телефон покупателя" onChange={(e) => setConsumerPhone(e.target.value)}/>
                <input type="text" className="form-control" id="inputConsumerEmail" value={consumerEmail} style={{marginTop: '5px'}}
                       placeholder="Почта покупателя" onChange={(e) => setConsumerEmail(e.target.value)}/>
            </div>

            <h4 style={{ marginTop: "20px" }}>Выбор товаров</h4>
            <div className="form-check" style={{marginBottom: '10px'}}>
                <input type="checkbox" className="form-check-input" id="inputProductsByDescrs" checked={inputProductByDescrs}
                       onChange={
                           () => {
                               setInputProductByDescrs(!inputProductByDescrs);
                               setInputProductBySelecting(!inputProductBySelecting);
                               setOrderPrice(0);
                           }
                       } />
                <label className="form-check-label" for="inputProductsByDescrs" >В виде простого описания</label>
            </div>
            <div className="form-check" style={{marginBottom: '10px'}}>
                <input type="checkbox" className="form-check-input" id="inputProductsBySelecting" checked={inputProductBySelecting}
                       onChange={
                           () => {
                               setInputProductBySelecting(!inputProductBySelecting);
                               setInputProductByDescrs(!inputProductByDescrs);
                               setOrderPrice(0);
                           }
                       }/>
                <label className="form-check-label" htmlFor="inputProductsBySelecting">Через меню выбора товаров</label>
            </div>

            {inputProductByDescrs &&
                <>
                    <div className="form-group" style={{marginBottom: '10px'}}>
                        <label htmlFor="inputProductsDescrs">Описание товаров</label>
                        <textarea type="text" className="form-control" id="inputProductsDescrs" value={productsDescrs}
                               placeholder="Описание товаров" onChange={(e) => setProductsDescrs(e.target.value)}/>
                    </div>
                    <label htmlFor="inputPrice">Цена заказа</label>
                    <div className="form-group input-group" style={{marginBottom: '10px'}}>
                        <input type="number" className="form-control" id="inputPrice" value={orderPrice} placeholder="Цена товара" onChange={(e) => setOrderPrice(e.target.value)} />
                        <div className="input-group-append">
                            <span className="input-group-text">₽</span>
                        </div>
                    </div>
                </>
            }

            {inputProductBySelecting &&
                <div className="container">
                    {selectedProducts.length > 0 &&
                        <div className="row">
                            <span className="form-label" style={{color: "red"}}>Выбранные товары</span>
                            <div className="col-12">
                                <div className="card card-margin">
                                    <div className="card-body">
                                        <div className="row search-body">
                                            <div className="col-lg-12">
                                                <div className="search-result">
                                                    <div className="result-body">
                                                        <div className="table-responsive">
                                                            <table className="table widget-26">
                                                                <tbody>
                                                                {selectedProducts.map((pr, index) => {
                                                                    return (
                                                                        <SelectedProductComponent
                                                                            prInfo={pr.prInfo}
                                                                            selectedParamsInfo={pr.selectedParamsInfo}
                                                                            index={index}
                                                                            deleteProduct={onDeleteProduct}
                                                                        />
                                                                    )
                                                                })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="form-label">Финальная цена заказа: {orderPrice} ₽</span>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="row">
                        <div className="col-lg-12 card-margin">
                            <div className="card search-form">
                                <div className="card-body p-0">
                                    <form id="search-form">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="row no-gutters">
                                                    <div className="col-lg-3 col-md-3 col-sm-12 p-0">
                                                        <ReactSelect
                                                            className="form-control"
                                                            options={categories_items}
                                                            placeholder="Категория..."
                                                            onChange={onCategoryChange}
                                                        />
                                                    </div>
                                                    <div className="col-lg-8 col-md-6 col-sm-12 p-0">
                                                        <input type="text" placeholder="Поиск..."
                                                               className="form-control" id="search" name="search" onChange={onSearchTextChange}/>
                                                    </div>
                                                    <div className="col-lg-1 col-md-3 col-sm-12 p-0">
                                                        <button className="btn btn-base" onClick={onSearchClicked}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24" viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" stroke-width="2"
                                                                 stroke-linecap="round" stroke-linejoin="round"
                                                                 className="feather feather-search">
                                                                <circle cx="11" cy="11" r="8"></circle>
                                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    {products.length === 0 &&
                        <div className="row">
                            <div className="col-lg-12 card-margin">
                                <div className="card">
                                    <label className="form-label">Введите что-нибудь в строку поиска и запустите поиск</label>
                                </div>
                            </div>
                        </div>
                    }
                    {products.length > 0 &&
                        <div className="row">
                            <div className="col-12">
                                <div className="card card-margin">
                                    <div className="card-body">
                                        <div className="row search-body">
                                            <div className="col-lg-12">
                                                <div className="search-result">
                                                    <div className="result-body">
                                                        <div className="table-responsive">
                                                            <table className="table widget-26">
                                                                <tbody>
                                                                {products.map((pr, index) => {
                                                                    if (!ignoredProductsIds.some(ind => ind === pr.id)) {
                                                                        return (
                                                                            <SearchProductComponent
                                                                                prInfo={pr}
                                                                                index={index}
                                                                                selectProduct={onSelectProduct}
                                                                            />
                                                                        )
                                                                    } else {
                                                                        return (<></>)
                                                                    }
                                                                })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }

            <h4 style={{ marginTop: "20px" }}>Доставка</h4>
            <div className="form-check" style={{marginBottom: '10px'}}>
                <input type="checkbox" className="form-check-input" id="pickupCheck"
                       checked={checkPickupDelivery}
                       onChange={
                           () => {
                               setCheckPickupDelivery(!checkPickupDelivery);
                               setCheckCourierDelivery(!checkCourierDelivery);
                           }
                       }/>
                <label className="form-check-label" htmlFor="pickupCheck">Самовывоз (г. СПб, улица Варшавская, д. 59)</label>
            </div>
            <div className="form-check" style={{marginBottom: '10px'}}>
                <input type="checkbox" className="form-check-input" id="courierCheck"
                       checked={checkCourierDelivery}
                       onChange={
                           () => {
                               setCheckPickupDelivery(!checkPickupDelivery);
                               setCheckCourierDelivery(!checkCourierDelivery);
                           }
                       }/>
                <label className="form-check-label" htmlFor="courierCheck">Курьером (+ 300 ₽)</label>
            </div>

            {checkCourierDelivery &&
                <>
                    <div className="form-group" style={{marginBottom: '10px'}}>
                        <label htmlFor="inputConsumerStreet">Данные о доставке</label>
                        <input type="text" className="form-control" id="inputConsumerStreet" value={consumerStreet}
                               placeholder="Улица" onChange={(e) => setConsumerStreet(e.target.value)}/>
                        <input type="text" className="form-control" id="inputConsumerHouseNum" value={consumerHouseNum} style={{marginTop: '5px'}}
                               placeholder="Номер дома" onChange={(e) => setConsumerHouseNum(e.target.value)}/>
                        <input type="text" className="form-control" id="inputConsumerApartmentNum" value={consumerApartmentNum} style={{marginTop: '5px'}}
                               placeholder="Номер квартиры" onChange={(e) => setConsumerApartmentNum(e.target.value)}/>
                        <input type="text" className="form-control" id="inputConsumerDeliveryComment" value={deliveryComment} style={{marginTop: '5px'}}
                               placeholder="Комментарий к доставке" onChange={(e) => setDeliveryComment(e.target.value)}/>

                    </div>
                </>
            }

            {(columnNameToAddTo === "" || !isValidDate) &&
                <div className="form-group">
                    <label htmlFor="inputDeliveryDate">Дата</label>
                    <Form.Control
                        type="date"
                        name="date_of_delivery"
                        onChange={(e) => {
                            setDeliveryDate(new Date(e.target.value.toString()))
                            setDeliveryDateString(`${deliveryDate.getDay()}.${deliveryDate.getMonth() + 1}.${deliveryDate.getFullYear()}`)
                        }}
                    />
                </div>
            }

            <button className="btn btn-primary btn-lg container" style={{ marginTop: "20px" }} onClick={onSubmitOrder}>Создать заказ</button>
            {isOrderCreating && <ClipLoader loading={isOrderCreating} />}
        </div>
    );
}

export default NewOrder