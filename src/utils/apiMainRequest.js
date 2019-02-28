import axios from "axios";
import qs from "qs";
import {API_URL, ORG_ID} from "../actions/action.constance";
let main=JSON.parse(localStorage.getItem('persist:root'))
let user=JSON.parse(main.user)
const token=user.apiToken


export async function post(url,payload) {



    try {
        let response = await axios.post(`${API_URL}/${url}`, payload, {
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                Authorization: `Bearer ${token}`,
                orgid: ORG_ID
            }
        });
        return response.data;

    } catch (e) {
        alert(e.message)
        console.log(e)
    }
}

export async function upload(url,payload,callbackProgress,uploadId) {

    try {
        let response = await axios.post(`${API_URL}/${url}`, payload, {
            onUploadProgress: (p) => {
              //console.log( Math.round(p.loaded * 100 / p.total));
              callbackProgress(Math.round(p.loaded * 100 / p.total),uploadId)
            },
            headers: {
                /*"Content-Type": "multipart/form-data",*/
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                Authorization: `Bearer ${token}`,
                orgid: ORG_ID

            }
        });
        return response.data;

    } catch (e) {
        alert(e.message)
        console.log(e)
    }
}

export async function get(url, params) {

    try {
        let response = await axios.get(`${API_URL}/${url}`, {
            params: params,
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                Authorization: `Bearer ${token}`,
                orgid: ORG_ID
            }
        });
        return response.data;

    } catch (e) {
        alert(e.message)
        console.log(e)
    }
}

export async function remove(url) {

    try {
        let response = await axios.delete(`${API_URL}/${url}`, {
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                Authorization: `Bearer ${token}`,
                orgid: ORG_ID
            }
        });
        return response.data;

    } catch (e) {
        alert(e.message)
        console.log(e)
    }
}

export async function put(url,payload) {



    try {
        let response = await axios.put(`${API_URL}/${url}`, payload, {
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                Authorization: `Bearer ${token}`,
                orgid: ORG_ID
            }
        });
        return response.data;

    } catch (e) {
        alert(e.message)
        console.log(e)
    }
}
