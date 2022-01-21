import axios from "axios";
import { getAuthToken } from "../../utils/local-storage/auth";

class ProductsRequestsHandler {
    static async addNewProduct(formData) {
        return axios({
            method: "post",
            url: process.env.REACT_APP_SERVER_API + "/api/admin/products/",
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
            data: formData,
        }).then((res) => {
            console.log("Product successfully added. Id: ", res.data.id);
            return res.data.id;
        }).catch((e) => {
            console.log("Failed to add new product");
            console.log(e.response);
            throw e;
        });
    }

    static async addParametersToProduct(data) {
        return axios({
            method: "post",
            url: process.env.REACT_APP_SERVER_API + "/api/admin/products/add_parameters",
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
            data,
        }).then((_) => {
            console.log("Parameters was successfully added to product. Id: ", data.id);
            return;
        }).catch((e) => {
            console.log("Failed to add parameters to product");
            console.log(e.response);
            throw e;
        });
    }

    static async getAll() {
        return axios({
            method: "get",
            url: process.env.REACT_APP_SERVER_API + "/api/admin/products/",
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
        }).then((res) => {
            if (res.status !== 200) {
                console.log("Failed to fetch all products");
                console.log(res.status, res.statusText);
                throw Error("Failed to fetch all products");
            }

            console.log("All products successfully fetched.");
            return res.data;
        }).catch((e) => {
            console.log("Failed to fetch all products");
            console.log(e.response);
            throw e;
        });
    }

    static async getOne(id) {
        return axios({
            method: "get",
            url: process.env.REACT_APP_SERVER_API + `/api/admin/products/${id}/`,
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
        }).then((res) => {
            if (res.status !== 200) {
                console.log(`Failed to fetch product with id ${id}`);
                console.log(res.status, res.statusText);
                throw Error(`Failed to fetch product with id ${id}`);
            }

            console.log(`Product with id ${id} was successfully fetched.`);
            return res.data;
        }).catch((e) => {
            console.log(`Failed to fetch product with id ${id}`);
            console.log(e.response);
            throw e;
        });
    }

    static async editOne(id, data) {
        return axios({
            method: "put",
            url: process.env.REACT_APP_SERVER_API + `/api/admin/products/${id}/`,
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
            data,
        }).then((res) => {
            if (res.status !== 200) {
                console.log(`Failed to edit product with id ${id}`);
                console.log(res.status, res.statusText);
                throw Error(`Failed to edit product with id ${id}`);
            }

            console.log(`Product with id ${id} was successfully editec.`);
            return;
        }).catch((e) => {
            console.log(`Failed to edit product with id ${id}`);
            console.log(e.response);
            throw e;
        });
    }

    static async searchByCategoryAndText(category, text) {
        return axios({
            method: "get",
            url: process.env.REACT_APP_SERVER_API + `/api/admin/products_search?category=${category}&text=${text}`,
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
        }).then((res) => {
            if (res.status !== 200) {
                console.log(`Failed to search products with category ${category} and text ${text}`);
                console.log(res.status, res.statusText);
                throw Error(`Failed to search products with category ${category} and text ${text}`);
            }

            console.log(`Search products with category ${category} and text ${text} succeeded`);
            return res.data;
        }).catch((e) => {
            console.log(`Failed to search products with category ${category} and text ${text}`);
            console.log(e.response);
            throw e;
        });
    }
}

export default ProductsRequestsHandler;