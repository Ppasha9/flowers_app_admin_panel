import React from "react"

const NewProduct = () => {
    return (
        <div>
            <h2 className="page-header">
                Новый товар
            </h2>
            <div className="container">
                <form>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label for="inputName">Название</label>
                        <input type="text" class="form-control" id="inputName" placeholder="Название товара" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label for="inputContent">Описание</label>
                        <textarea type="text" class="form-control" id="inputContent" placeholder="Описание товара" />
                    </div>
                    <label for="inputPrice">Цена (руб.)</label>
                    <div className="form-group input-group" style={{ marginBottom: '10px' }}>
                        <input type="number" class="form-control" id="inputPrice" placeholder="Цена товара" />
                        <div class="input-group-append">
                            <span class="input-group-text">₽</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewProduct;