import axios from "axios";
import {API_URL, ORG_ID} from "../actions/action.constance";

export async function getMyProfile( token) {
    try {
        let response = await axios.get(`${API_URL}/accounts/profiles/me`, {
            params: {},
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                Authorization: `Bearer ${token}`,
                orgid: ORG_ID
            }
        });
        //alert(response.status);
        return response;

    } catch (e) {
        console.log(e)
        if (e.message === "Request failed with status code 401") {
            return {status: 401}
        }
        if (e.message === "Request failed with status code 404") {
            return {status: 404}
        }

    }
}

export async function createProfile( payload,token) {

    try {
        let response = await axios.post(`${API_URL}/accounts/profiles`,payload, {
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                Authorization: `Bearer ${token}`,
                orgid: ORG_ID
            }});
        return response;

    } catch (e) {
        console.log(e)
        if (e.message === "Request failed with status code 400") {
            return {status: 400}
        }

    }
}