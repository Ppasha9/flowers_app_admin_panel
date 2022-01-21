import React, { useState, useEffect } from "react"
import { default as ReactSelect } from "react-select"
import { components } from "react-select"
import { AiFillDelete } from "react-icons/ai"
import { Redirect } from "react-router-dom"

import categories_items from "../../assets/JsonData/categories-list.json"
import tags_items from "../../assets/JsonData/tags-list.json"
import flowers_items from "../../assets/JsonData/flowers-list.json"

import ProductsRequestsHandler from "./ProductsRequestsHandler";
import { ClipLoader } from "react-spinners"
import { categoriesFromEngToRus } from "../../utils/utils"

const EditProduct = (props) => {
    const [isFetching, setIsFetching] = useState(true);
    const [productName, setProductName] = useState("");
    const [productContent, setProductContent] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [flowers, setFlowers] = useState([]);
    const [params, setParams] = useState([]);
    const [curParamName, setCurParamName] = useState("");
    const [curParamValue, setCurParamValue] = useState("");
    const [curParamPrice, setCurParamPrice] = useState(0);
    const [imageData, setImageData] = useState(null);
    const [isProductEditing, setIsProductEditing] = useState(false);
    const [needRedirectToProducts, setNeedRedirectToProducts] = useState(false);

    useEffect(() => {
        try {
            ProductsRequestsHandler.getOne(props.match.params.id).then((res) => {
                setProductName(res.name);
                setProductContent(res.content);
                setProductPrice(res.price);

                const newCategories = res.categories.map((cat) => ({ value: cat, label: categoriesFromEngToRus(cat) }));
                setCategories(newCategories);

                const newTags = res.tags.map((tag) => ({ value: tag, label: tag }));
                setTags(newTags);

                const newFlowers = res.flowers.map((flower) => ({ label: flower, value: flower }));
                setFlowers(newFlowers);

                const newParams = res.parameters.map((param) => ({ name: param.name, value: param.value, price: param.price }));
                setParams(newParams);

                setImageData({
                    file: null,
                    previewUrl: res.picUrl,
                });

                console.log("Fetched product: ", res);
                setIsFetching(false);
            });
        } catch (e) {
            alert("Произошла ошибка при загрузке товара");
        }
    }, []);

    const handleCategoriesChange = (selected) => {
        setCategories(selected);
    }
    const handleTagsChange = (selected) => {
        setTags(selected);
    }
    const handleFlowersChange = (selected) => {
        setFlowers(selected);
    }

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "}
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const onCurParamNameChange = (e) => {
        setCurParamName(e.target.value);
    }
    const onCurParamValueChange = (e) => {
        setCurParamValue(e.target.value);
    }
    const onCurParamPriceChange = (e) => {
        setCurParamPrice(e.target.value);
    }

    const addNewParam = (e) => {
        e.preventDefault();

        if (curParamName === "") {
            alert('Название параметра пустое');
            return;
        }
        if (curParamValue === "") {
            alert('Значение параметра пустое');
            return;
        }
        if (curParamPrice === "") {
            alert('Цена товара пустое');
            return;
        }

        console.log(curParamName, curParamValue, curParamPrice);

        const newParams = [
            ...params,
            { name: curParamName, value: curParamValue, price: curParamPrice, }
        ];
        setParams(newParams);

        setCurParamName("");
        setCurParamValue("");
        setCurParamPrice(0);
    }

    const onDeleteParam = (idx) => {
        setParams(params.filter((_, index) => index !== idx));
    }

    const onSubmitProduct = () => {
        if (productName === "") {
            alert("Заполните название товара");
            return;
        }

        if (productContent === "") {
            alert("Заполните описание товара");
            return;
        }

        if (productPrice === "") {
            alert("Заполните цену товара");
            return;
        }

        if (categories === []) {
            alert("Выберите категории");
            return;
        }

        if (tags === []) {
            alert("Выберите тэги");
            return
        }

        if (flowers === []) {
            alert("Выберите цветы");
            return
        }

        if (imageData === null) {
            alert("Добавьте изображение");
            return;
        }

        setIsProductEditing(true);

        const data = {
            name: productName,
            content: productContent,
            price: productPrice,
            parameters: params,
            categories: categories.map((c) => c.value),
            tags: tags.map((t) => t.value),
            flowers: flowers.map((f) => f.value),
        };

        ProductsRequestsHandler.editOne(props.match.params.id, data).then(() => {
            setIsProductEditing(false);
            setNeedRedirectToProducts(true);
        }).catch((e) => {
            alert("При редактировании товара произошла ошибка.");
            return;
        });;
    }

    if (isFetching) {
        return (
            <div className="container">
                <ClipLoader loading={isFetching} />
            </div>
        );
    }

    if (needRedirectToProducts) {
        return (
            <Redirect to="/products" />
        );
    }

    return (
        <div>
            <h2 className="page-header">
                Новый товар
            </h2>
            <div className="container">
                <form>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label for="inputName">Название</label>
                        <input type="text" class="form-control" id="inputName" value={productName} placeholder="Название товара" onChange={(e) => setProductName(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label for="inputContent">Описание</label>
                        <textarea type="text" class="form-control" id="inputContent" value={productContent} placeholder="Описание товара" onChange={(e) => setProductContent(e.target.value)} />
                    </div>
                    <label for="inputPrice">Цена (руб.)</label>
                    <div className="form-group input-group" style={{ marginBottom: '10px' }}>
                        <input type="number" class="form-control" id="inputPrice" value={productPrice} placeholder="Цена товара" onChange={(e) => setProductPrice(e.target.value)} />
                        <div class="input-group-append">
                            <span class="input-group-text">₽</span>
                        </div>
                    </div>
                    <label for="inputCategories">Категории</label>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <span
                            data-toggle="popover"
                            data-trigger="focus"
                            data-content="Выберите категории"
                            id="inputCategories">
                            <ReactSelect
                                options={categories_items}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{
                                    Option
                                }}
                                onChange={handleCategoriesChange}
                                allowSelectAll={true}
                                value={categories}
                            />
                        </span>
                    </div>
                    <label for="inputTags">Тэги</label>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <span
                            data-toggle="popover"
                            data-trigger="focus"
                            data-content="Выберите тэги"
                            id="inputTags">
                            <ReactSelect
                                options={tags_items}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{
                                    Option
                                }}
                                onChange={handleTagsChange}
                                allowSelectAll={true}
                                value={tags}
                            />
                        </span>
                    </div>
                    <label for="inputFlowers">Цветы</label>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <span
                            data-toggle="popover"
                            data-trigger="focus"
                            data-content="Выберите цветы"
                            id="inputFlowers">
                            <ReactSelect
                                options={flowers_items}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{
                                    Option
                                }}
                                onChange={handleFlowersChange}
                                allowSelectAll={true}
                                value={flowers}
                            />
                        </span>
                    </div>
                    <label for="inputParameters">Параметры</label>
                    <div className="form-group" id="inputParameters" style={{ marginBottom: '10px' }}>
                        {params.map((val, idx) => (
                            <div className="container" style={{ marginBottom: '5px' }}>
                                <div className="row">
                                    <div className="col-4">
                                        <div className="form-control">
                                            <span>{val.name}</span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="form-control">
                                            <span>{val.value}</span>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="form-control">
                                            <label>Цена: </label>
                                            <span> {val.price} ₽</span>
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <button className="btn" onClick={() => onDeleteParam(idx)}>
                                            <AiFillDelete size="1.5rem" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="container" style={{ marginTop: params.length > 0 ? '10px' : '0px' }}>
                            <div className="row">
                                <div className="col-4">
                                    <div className="form-control">
                                        <input type="text" class="form-control" value={curParamName} placeholder="Название параметра" onChange={onCurParamNameChange} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-control">
                                        <input type="text" class="form-control" value={curParamValue} placeholder="Значение параметра" onChange={onCurParamValueChange} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-control input-group">
                                        <input type="number" class="form-control" value={curParamPrice} placeholder="Цена товара" onChange={onCurParamPriceChange} />
                                        <div class="input-group-append">
                                            <span class="input-group-text">₽</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-primary btn-sm" style={{ marginTop: '5px' }} onClick={addNewParam}>Добавить</button>
                        </div>
                    </div>
                    {imageData !== null &&
                        <>
                            <label for="productImage">Изображение товара</label>
                            <div className="form-group" id="productImage">
                                <img src={imageData.previewUrl} className="d-block img-fluid img-thumbnail" style={{ marginTop: "5px", maxWidth: "40%", height: "auto" }} alt="Изображение товара" />
                            </div>
                        </>
                    }
                    <button className="btn btn-primary btn-lg container" style={{ marginTop: "20px" }} onClick={onSubmitProduct}>Редактировать товар</button>
                    {isProductEditing && <ClipLoader loading={isProductEditing} />}
                </form>
            </div>
        </div>
    );
}

export default EditProduct;