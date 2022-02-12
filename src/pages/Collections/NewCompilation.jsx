import React, {useRef, useState} from "react"
import {Redirect} from "react-router-dom";
import {ClipLoader} from "react-spinners";
import {default as ReactSelect} from "react-select";
import {AiFillDelete} from "react-icons/ai";

import CompilationsRequestsHandler from "./CompilationsRequestsHandler";
import ProductsRequestsHandler from "../Products/ProductsRequestsHandler";
import categories_items from "../../assets/JsonData/categories-list.json";

const SelectedProductComponent = ({ prInfo, index, deleteProduct }) => {
    const onDelete = (idx) => {
        deleteProduct(prInfo.id, index)
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
    const onSelectBtnClicked = (e) => {
        e.preventDefault()
        selectProduct(prInfo)
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
                <td>
                    <button className="btn btn-primary btn-md" onClick={onSelectBtnClicked}>
                        Выбрать товар
                    </button>
                </td>
            </tr>
        </div>
    )
}

const NewCompilation = () => {
    const [compilationName, setCompilationName] = useState("");
    const [imageData, setImageData] = useState(null);
    const [isCompilationCreating, setIsCompilationCreating] = useState(false);
    const [needRedirectToCollections, setNeedRedirectToCollections] = useState(false);

    const [category, setCategory] = useState("");
    const [searchText, setSearchText] = useState("");

    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [ignoredProductsIds, setIgnoredProductsIds] = useState([]);

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
        if (searchText !== "") {
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

    const onSelectProduct = (prInfo) => {
        setSelectedProducts([...selectedProducts, prInfo])
        setIgnoredProductsIds([...ignoredProductsIds, prInfo.id])
    }

    const onDeleteProduct = (prInfoId, prIndex) => {
        setSelectedProducts(selectedProducts.filter((sp, index) => {
            return index !== prIndex
        }))
        setIgnoredProductsIds(ignoredProductsIds.filter((id) => {
            return id !== prInfoId
        }))
    }

    const onFileSelected = e => {
        e.preventDefault();

        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onloadend = () => {
            setImageData({
                file: file,
                previewUrl: reader.result,
            });
        }

        reader.readAsDataURL(file);
    }

    const uploadImageRef = useRef();

    const onFileSelectBtnClicked = e => {
        e.preventDefault();
        uploadImageRef.current.click();
    }

    if (needRedirectToCollections) {
        return (
            <Redirect to="/collections" />
        );
    }

    const onSubmitProduct = (e) => {
        e.preventDefault()

        if (compilationName === "") {
            alert("Заполните название подборки");
            return;
        }

        if (imageData === null) {
            alert("Добавьте изображение");
            return;
        }

        setIsCompilationCreating(true);

        const fd = new FormData();
        fd.append("name", compilationName);
        fd.append("picture", imageData.file, imageData.file.name);

        CompilationsRequestsHandler.createNewCompilation(fd).then((compId) => {
            if (ignoredProductsIds !== []) {
                ignoredProductsIds.forEach((prId) => {
                    CompilationsRequestsHandler.addProductToCompilation(prId, compId).catch((e) => {
                        alert(`При добавлении товара №${prId} к подборке произошла ошибка.`);
                        return;
                    })
                });
            }

            setIsCompilationCreating(false);
            setNeedRedirectToCollections(true);
        }).catch((e) => {
            alert("При добавлении новой подборки произошла ошибка.");
            return;
        });
    }

    return (
        <div>
            <h2 className="page-header">
                Новая подборка
            </h2>
            <div className="container">
                <form>
                    <div className="form-group" style={{marginBottom: '10px'}}>
                        <label htmlFor="inputName">Название</label>
                        <input type="text" className="form-control" id="inputName" value={compilationName}
                               placeholder="Название подборки" onChange={(e) => setCompilationName(e.target.value)}/>
                    </div>

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
                                                                            prInfo={pr}
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

                    <label htmlFor="compilationImage">Изображение подборки</label>
                    <div className="form-group" id="compilationImage">
                        <input type="file" onChange={onFileSelected} ref={uploadImageRef} style={{display: "none"}}/>
                        <button className="btn btn-secondary btn-md" onClick={onFileSelectBtnClicked}
                                style={{marginTop: "5px"}}>Выбрать изображение
                        </button>
                        {imageData !== null &&
                            <img src={imageData.previewUrl} className="d-block img-fluid img-thumbnail"
                                 style={{marginTop: "5px", maxWidth: "40%", height: "auto"}} alt="Изображение подборки"/>
                        }
                    </div>
                    <button className="btn btn-primary btn-lg container" style={{ marginTop: "20px" }} onClick={onSubmitProduct}>Добавить подборку</button>
                    {isCompilationCreating && <ClipLoader loading={isCompilationCreating} />}
                </form>
            </div>
        </div>
    );
}

export default NewCompilation;