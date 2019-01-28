//import "isomorphic-fetch";

import axios from "axios";
import qs from "qs";
import {API_URL_ROOT, DOMAIN_NAME} from "../actions/action.constance";

export async function post(url, payload) {

    try {
        let response = await axios.post(`${API_URL_ROOT}/${url}`, payload);


        return response.data;


    } catch (e) {
        alert(e.message)
        console.log(e)
    }
}

export async function postSystem(url, payload) {

    try {
        let response = await axios.post(`${DOMAIN_NAME}/${url}`, qs.stringify(payload), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache"
            }
        });
        return response.data;

    } catch (e) {
        alert(e.message)

        console.log(e)
    }
}
export async function postMain(url, payload,token) {

    let domain="https://idea.api.mizekar.com"
    try {
        let response = await axios.post(`${domain}/${url}`, payload,{
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;

    } catch (e) {
        alert(e.message)

        console.log(e)
    }
}

export async function get(url, token) {

    let domain="https://idea.api.mizekar.com"
    try {
        let response = await axios.get(`${domain}/${url}`, {
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;

    } catch (e) {
        alert(e.message)

        console.log(e)
    }
}

/*export async function get(url,token) {
    console.log("=======", `${API_URL_ROOT}/${url}`);
    return await fetch(`${API_URL_ROOT}/${url}`, {
        json: true,
        headers: {
            //snaphuntjwttoken: localStorage.getItem("snaphuntJwtToken"),
            "cache-control": "no-cache",
            Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
            "content-type": "application/json"
        }
    });
}*/

export async function patch(url, payload) {
    return await fetch(`${API_URL_ROOT}/${url}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        json: true,
        headers: {
            snaphuntjwttoken: localStorage.getItem("snaphuntJwtToken"),
            "cache-control": "no-cache",
            Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
            "content-type": "application/json"
        }
    });
}

export async function put(url, payload) {
    return await fetch(`${API_URL_ROOT}/${url}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        json: true,
        headers: {
            snaphuntjwttoken: localStorage.getItem("snaphuntJwtToken"),
            "cache-control": "no-cache",
            Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
            "content-type": "application/json"
        }
    });
}

export async function putImage(url, payload) {
    return await fetch(`${API_URL_ROOT}/${url}`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            snaphuntjwttoken: localStorage.getItem("snaphuntJwtToken"),
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
            "cache-control": "no-cache",
            "Content-Length": JSON.stringify(payload).length,
            keepAlive: true
        }
    });
}
