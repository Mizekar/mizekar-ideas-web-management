import axios from "axios";
import {DOMAIN_NAME} from "../actions/action.constance";
import qs from "qs";

export async function checkToken(payload) {

    try {
        let response = await axios.post(`${DOMAIN_NAME}/connect/token`, qs.stringify(payload), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache"
            }
        });
        return response;

    } catch (error) {
        console.log(error)
    }
}