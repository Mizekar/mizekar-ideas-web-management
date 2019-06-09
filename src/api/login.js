import axios from "axios";
import {API_URL_ROOT} from "../actions/action.constance";

export async function checkLogin(payload) {

    try {
        let response = await axios.post(`${API_URL_ROOT}/auth/phone`, payload);

        return response;

    } catch (error) {
        console.log(error)
    }
}