//import * as constance from "./action.constance";
export const SET_USER = "SET_USER";
export const EMPTY_USER = "EMPTY_USER";

export function setUser(info) {
    return {
        type: SET_USER,
        info: info
    };
}
export function emptyUser() {
    return {
        type: EMPTY_USER,
    };
}

