import axios from "axios";
import { store } from "./store/index.js";
import { addErrors } from "./store/errorsSlice.js";

const APP_URL = import.meta.env.VITE_API_URL;

const request = axios.create({
  baseURL: `${APP_URL}/api/v1`,
});

request.interceptors.request.use(
  function (config) {
    const storage = JSON.parse(sessionStorage.getItem("payload"));
    if (storage?.token) {
      config.headers["Authorization"] = `Bearer ${storage.token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    store.dispatch(addErrors(error));
    return Promise.reject(error);
  }
);

export default request;
