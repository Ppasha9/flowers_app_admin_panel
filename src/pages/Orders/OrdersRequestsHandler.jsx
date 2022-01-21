import axios from "axios";
import { getAuthToken } from "../../utils/local-storage/auth";

class OrdersRequestsHandler {
    static async getAllCardsWithColumns() {
        return axios({
            method: "get",
            url: process.env.REACT_APP_SERVER_API + "/api/admin/orders/cards_with_columns",
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
        }).then((res) => {
            if (res.status !== 200) {
                console.log("Failed to fetch all orders cards and columns");
                console.log(res.status, res.statusText);
                throw Error("Failed to fetch all orders cards and columns");
            }

            console.log("All orders cards and columns successfully fetched.");
            console.log(res.data);
            return res.data;
        }).catch((e) => {
            console.log("Failed to fetch all orders cards and columns");
            console.log(e.response);
            throw e;
        })
    }

    static async createNewOrder(data) {
        return axios({
            method: "post",
            url: process.env.REACT_APP_SERVER_API + "/api/admin/orders",
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
            data: data
        }).then((res) => {
            if (res.status !== 200) {
                console.log("Failed to create new order from admin panel");
                console.log(res.status, res.statusText);
                throw Error("Failed to create new order from admin panel");
            }

            console.log("New order was created successfully")
            return
        }).catch((e) => {
            console.log("Failed to create new order from admin panel");
            console.log(e.response);
            throw e;
        });
    }

    static async createNewOrderColumn(data) {
        return axios({
            method: "post",
            url: process.env.REACT_APP_SERVER_API + `/api/admin/orders/create_column`,
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
            data: data
        }).then((res) => {
            if (res.status !== 200) {
                console.log("Failed to create new order column from admin panel");
                console.log(res.status, res.statusText);
                throw Error("Failed to create new order column from admin panel");
            }

            console.log("New order column was created successfully")
            return
        }).catch((e) => {
            console.log("Failed to create new order column from admin panel");
            console.log(e.response);
            throw e;
        });
    }
}

export default OrdersRequestsHandler;