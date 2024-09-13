import axios from "axios";

const request = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
});

request.interceptors.request.use(function (config) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers['Authorization'] = `Bearer ${user.token}`;
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

request.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default request
