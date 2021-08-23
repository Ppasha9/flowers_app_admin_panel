/* eslint-disable import/no-anonymous-default-export */
import * as React from "react";

const apiUrl = "http://212.1.214.199:8080"

export default {
    login: ({ username, password }) => {
        const request = new Request(`${apiUrl}/api/auth/signin`, {
            method: 'POST',
            body: JSON.stringify({
                email: username,
                password: password,
                admin: true,
            }),
            headers: new Headers({ "Content-Type": "application/json" }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(auth => {
                localStorage.setItem("auth", JSON.stringify(auth));
                localStorage.setItem("permissions", "admin");
            })
            .catch(() => {
                throw new Error("Network error");
            });
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem("auth");
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    checkAuth: () => localStorage.getItem("auth")
        ? Promise.resolve()
        : Promise.reject(),
    logout: () => {
        localStorage.removeItem("auth");
        return Promise.resolve();
    },
    getPermissions: () => {
        const role = localStorage.getItem("permissions");
        return role ? Promise.resolve(role) : Promise.reject();
    }
};