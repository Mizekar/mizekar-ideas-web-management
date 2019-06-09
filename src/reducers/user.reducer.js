import * as userAction from "../actions/action.user";

const initialState = {
    apiToken: '',
    tokenType: '',
    refreshToken: '',
    expiresIn: '',
    mobile: '',
    firstName: '',
    lastName: '',
    profileImage: ''

}

const user = (state = initialState, action = {}) => {
    //alert(action.type);
    const {info} = action;
    //console.log(action.info)
    switch (action.type) {
        case userAction.SET_USER:
            return (
                {
                    apiToken: info.apiToken,
                    tokenType: info.tokenType,
                    refreshToken: info.refreshToken,
                    expiresIn: info.expiresIn,
                    mobile: info.mobile,
                }
            )
            break;
        case userAction.SET_PROFILE:
            return (
                {
                    firstName: info.firstName,
                    lastName: info.lastName,
                    profileImage: info.profileImage
                }
            )
            break;
        case userAction.EMPTY_USER:
            return (
                {
                    apiToken: '',
                    tokenType: '',
                    refreshToken: '',
                    expiresIn: '',
                    mobile: '',
                    firstName: '',
                    lastName: '',
                    profileImage: ''
                }
            )
            break;
        default:
            return state;
    }
}

export default user;
