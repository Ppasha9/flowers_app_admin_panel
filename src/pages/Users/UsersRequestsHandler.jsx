import axios from "axios"
import { getAuthToken } from "../../utils/local-storage/auth";

class UsersRequestsHandler {
    static async getAllUsers(isCustomers) {
        return axios({
            method: "get",
            url: process.env.REACT_APP_SERVER_API + "/api/admin/" + (isCustomers ? "users" : "admins"),
            headers: {
                Authorization: "Bearer " + getAuthToken(),
            },
        }).then((res) => {
            if (res.status !== 200) {
                console.log("Failed to fetch all users");
                console.log(res.status, res.statusText);
                throw Error("Failed to fetch all users");
            }

            return res.data;
        }).catch((e) => {
            console.log("Failed to fetch all users: ", e.message);
            console.log(e.response);
            throw e;
        });
    }
}

export default UsersRequestsHandler;