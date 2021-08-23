/* eslint-disable import/no-anonymous-default-export */
import { fetchUtils } from "react-admin";
import { stringify } from "querystring";

const apiUrl = "http://212.1.214.199:8080/api/admin"
const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" });
    }
    const { token } = JSON.parse(localStorage.getItem("auth"));
    console.log(`token: ${token}`);
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};

export default {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const url = `${apiUrl}/${resource}?range=${(page - 1) * perPage},${page * perPage - 1}`;
        return httpClient(url).then(({ headers, json }) => {
            console.log(`headers: ${JSON.stringify(headers)}`);
            console.log(`json: ${JSON.stringify(json)}`);
            return ({
                data: json,
                total: null //parseInt(headers.get('content-range').split('/').pop(), 10),
            })
        });
    },

    create: (resource, params) => {
        if (resource === "products") {
            let formData = new FormData();
            formData.append("name", params.data.name);
            formData.append("content", params.data.content);
            formData.append("size", params.data.size);
            formData.append("height", params.data.height);
            formData.append("diameter", params.data.diameter);
            formData.append("price", params.data.price);
            formData.append("categories", params.data.categories);
            formData.append("tags", params.data.tags);
            formData.append("flowers", params.data.flowers);
            formData.append("picture", params.data.picture.rawFile);

            return httpClient(`${apiUrl}/${resource}`, {
                method: "POST",
                body: formData,
            }).then(({ json }) => ({
                data: { ...params.data, id: json.id, },
            }));
        }

        return httpClient(`${apiUrl}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id, },
        }));
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({ data: json })),

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json, })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "DELETE",
        }).then(({ json }) => ({ data: json, })),

    deleteMany: (resource, params) => {
        let url = `${apiUrl}/${resource}?indices=`;
        params.ids.forEach(element => {
            url += `${element},`
        });
        url = url.substr(0, url.length - 1);
        return httpClient(url, {
            method: "DELETE",
        }).then(({ json }) => ({ data: json, }));
    },
};