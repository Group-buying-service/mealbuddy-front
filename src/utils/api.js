import axios from "axios";

export const BASE_URL = process.env.REACT_APP_BASE_API_URL
export const BASE_WS_URL = process.env.REACT_APP_BASE_WS_URL
const KAKAO_API_KEY = process.env.REACT_APP_KAKAO_API_KEY

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  credentials: 'include',
})

const kakaoAPI = axios.create({
  baseURL: 'https://dapi.kakao.com/v2/local'
})

kakaoAPI.defaults.headers.common['Authorization'] = `KakaoAK ${KAKAO_API_KEY}`

const methodList = {
  'get': API.get,
  'post': API.post,
  'delete': API.delete,
  'put': API.put,
}

const kakaoMethodList = {
  'get': kakaoAPI.get,
  'post': kakaoAPI.post,
}

const getCookie = (name) => {
  const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
}


/**
 * API 서버로 요청을 보냅니다.
 * @param {String} method 요청 method
 * @param {String} url 요청 url
 * @param {FormData|JSON} data 전송 데이터
 * @returns {Object} {status:good|fail, data:response.data} 형식의 Object
 */
export const APIcall = async (method, url, data) => {
  return await methodList[method](url, data)
    .then((res) => {
      const data = res.data;
      return {status: "good", data: data};
    })
    .catch((e)=>{
      const errors = e.response.data;
      return {status: "fail", data: errors};
    })
}

export const APILogin = async (data) => {
  const token = localStorage.getItem('token')
  if (token) {
    API.defaults.headers.common['Authorization'] = `token ${token}`
    return await API.get('/user/current/', {
      withCredentials: true,
      credentials: 'include',
    })
      .then((res) => {
        const data = res.data;
        localStorage.setItem('token', data.user.token);
        API.defaults.headers.common['Authorization'] = `token ${data.user.token}`
        const csrfToken = getCookie('csrftoken')
        API.defaults.headers.common['X-CSRFToken'] = csrfToken 
        return {status: "good", data: data.user};
      })
      .catch((e)=>{
        localStorage.setItem('token', '')
        const errors = e.response.data;
        return {status: "fail", data: errors};
      })
  }
  else {
    return await axios.post(BASE_URL + '/user/login/', data, {
      withCredentials: true,
      credentials: 'include',
    })
      .then((res) => {
        const data = res.data;
        localStorage.setItem('token', data.user.token);
        API.defaults.headers.common['Authorization'] = `token ${data.user.token}`
        return {status: "good", data: data.user};
      })
      .catch((e)=>{
        const errors = e.response.data;
        return {status: "fail", data: errors};
      })
  }
}

export const APIRegister = async (data) => {
  return await axios.post(BASE_URL + '/user/register/', data, {
    withCredentials: true,
    credentials: 'include',
  })
    .then((res) => {
      const data = res.data;
      localStorage.setItem('token', data.user.token);
      API.defaults.headers.common['Authorization'] = `token ${data.user.token}`
      return {status: "good", data: data.user};
    })
    .catch((e)=>{
      const errors = e.response.data;
      return {status: "fail", data: errors};
    })
}

export const kakaoAPIcall = async (method, url, data) => {
  return await kakaoMethodList[method](url, data)
    .then((res) => {
      const data = res.data;
      return {status: "good", data: data.documents[0]}
    })
    .catch((e) => {
      const errors = e.response.data;
      return {status: "fail", data: errors}
    })
}