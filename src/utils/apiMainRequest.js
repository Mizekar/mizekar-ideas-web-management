import axios from "axios";
import qs from "qs";
import {API_URL, ORG_ID, DOMAIN_NAME} from "../actions/action.constance";

let main = JSON.parse(localStorage.getItem('persist:root'))
let user = JSON.parse(main.user)
let token = user.apiToken;
let refToken = user.refreshToken
let mobile = user.mobile
let dashboard = main.dashboard
let _persist = main._persist


export async function post(url, payload) {


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
    //alert(e.message)
    console.log(e)
    if (e.message === "Request failed with status code 401") {
      await refreshToken();

      return await post(url, payload)

      //logout();
    }
  }
}

export async function upload(url, payload, callbackProgress, uploadId) {

  try {
    let response = await axios.post(`${API_URL}/${url}`, payload, {
      onUploadProgress: (p) => {
        //console.log( Math.round(p.loaded * 100 / p.total));
        callbackProgress(Math.round(p.loaded * 100 / p.total), uploadId)
      },
      headers: {
        "Content-Type": "multipart/form-data",
        "cache-control": "no-cache",
        Authorization: `Bearer ${token}`,
        orgid: ORG_ID

      }
    });
    return response.data;

  } catch (e) {
    //alert(e.message)
    console.log(e)
    if (e.message === "Request failed with status code 401") {
      await refreshToken();
      return await upload(url, payload, callbackProgress, uploadId)
      //logout();
    }
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
    //alert(response.status);
    return response.data;

  } catch (e) {
    //alert(e.code)
    console.log(e)
    if (e.message === "Request failed with status code 401") {
      await refreshToken();
      return await get(url, params)

      //logout();
    }
  }
}

export async function remove(url, params) {

  try {
    let response = await axios.delete(`${API_URL}/${url}`, {
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
    //alert(e.message)
    console.log(e)
    if (e.message === "Request failed with status code 401") {
      await refreshToken();
      return await remove(url)

      //logout();
    }
  }
}

export async function put(url, payload) {


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
    //alert(e.message)
    console.log(e);

    if (e.message === "Request failed with status code 401") {
      await refreshToken();
      return await put(url, payload)

      //logout();
    }
  }
}

async function refreshToken() {

  let url = "connect/token";

  let payload = {
    refresh_token: refToken,
    client_id: 'idea-web',
    client_secret: '00PcCMVwUGdb5weDo9FOOrYclGif7SJAFM3oXQGelhy4KQ5f8M3RMuTqeg',
    grant_type: 'refresh_token'
  }

  try {
    let response = await axios.post(`${DOMAIN_NAME}/${url}`, qs.stringify(payload), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
      }
    });
    let data = response.data;
    token = data.access_token
    refToken = data.refresh_token

    let main = {

      apiToken: data.access_token,
      tokenType: data.token_type,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      mobile: mobile,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage

    }
    //console.log(main);
    let userMain = {user: JSON.stringify(main), dashboard: dashboard, _persist: _persist}
    let root = JSON.stringify(userMain)

    localStorage.setItem('persist:root', root)


  } catch (e) {
    console.log(e)
  }
}

