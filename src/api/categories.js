import axios from "axios";
import {API_URL, ORG_ID} from "../actions/action.constance";

export async function getCategories( params,token) {
    try {
        let response = await axios.get(`${API_URL}/ideas/Categories`, {
            params: params,
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                Authorization: `Bearer ${token}`,
                orgid: ORG_ID
            }
        });
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

