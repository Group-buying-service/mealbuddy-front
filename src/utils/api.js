import axios from "axios";

export const BASE_URL = 'http://127.0.0.1:8000'

const API = axios.create({
  baseURL: BASE_URL,
})

const methodList = {
  'get': API.get,
  'post': API.post,
}

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
    return await API.get('/user/current/')
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
  else {
    return await axios.post(BASE_URL + '/user/login/', data)
      .then((res) => {
        const data = res.data;
        console.log(data)
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