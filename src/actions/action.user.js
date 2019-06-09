//import * as constance from "./action.constance";
export const SET_USER = "SET_USER";
export const EMPTY_USER = "EMPTY_USER";
export const SET_PROFILE = "SET_PROFILE";


export function setUser(info) {
    return {
        type: SET_USER,
        info: info
    };
}

export function setProfile(info) {
    return {
        type: SET_PROFILE,
        info: info
    };
}

export function emptyUser() {
    return {
        type: EMPTY_USER,
    };
}

