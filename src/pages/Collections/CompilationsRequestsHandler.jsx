import axios from "axios";
import { getAuthToken } from "../../utils/local-storage/auth";

class CompilationsRequestsHandler {
    static async getAllCompilationsCuttedForms() {
        return axios({
            method: "get",
            url: process.env.REACT_APP_SERVER_API + "/api/compilation/all",
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
        }).then((res) => {
            if (res.status !== 200) {
                console.log("Failed to fetch all compilations");
                console.log(res.status, res.statusText);
                throw Error("Failed to fetch all compilations");
            }

            console.log("All compilations successfully fetched.");
            console.log(res.data);
            return res.data;
        }).catch((e) => {
            console.log("Failed to fetch all compilations");
            console.log(e.response);
            throw e;
        })
    }

    static async createNewCompilation(formData) {
        return axios({
            method: "post",
            url: process.env.REACT_APP_SERVER_API + "/api/compilation",
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
            data: formData,
        }).then((res) => {
            console.log("Compilation successfully added. Id: ", res.data);
            return res.data;
        }).catch((e) => {
            console.log("Failed to add new compilation");
            console.log(e.response);
            throw e;
        });
    }

    static async addProductToCompilation(prId, compId) {
        const fd = new FormData();
        fd.append("productId", prId);
        fd.append("compilationId", compId);

        return axios({
            method: "post",
            url: process.env.REACT_APP_SERVER_API + "/api/compilation/add-product",
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
            data: fd,
        }).then((res) => {
            console.log(`Product with id ${prId} was successfully added to compilation with id ${compId}`)
            return res.data;
        }).catch((e) => {
            console.log(`Failed to add product with id ${prId} to compilation with id ${compId}`);
            console.log(e.response);
            throw e;
        });
    }
}

export default CompilationsRequestsHandler;