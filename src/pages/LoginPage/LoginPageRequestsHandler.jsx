import axios from "axios"

import { getAuthToken } from "../../utils/local-storage/auth"

class LoginPageRequestsHandler {
    static async login(email, password) {
        return axios({
            method: "post",
            url: process.env.REACT_APP_SERVER_API + "/api/auth/signin",
            data: {
                "email": email,
                "password": password,
                "admin": true,
            },
            headers: {
                Authorization: "Bearer" + getAuthToken()
            },
        }).then((res) => {
            if (res.status === 200) {
                return res.data;
            } else {
                console.error(`Failed to login with params email=${email} and password=${password}.`);
                console.error(`Result response status is ${res.status}`);
                console.error(res);
                throw Error(`Failed to login, status is ${res.status}`);
            }
        }).catch((e) => {
            console.error(`Failed to login with params email=${email} and password=${password}.`);
            console.error(e.message, e.response);
            throw e;
        });
    }
}

export default LoginPageRequestsHandler;