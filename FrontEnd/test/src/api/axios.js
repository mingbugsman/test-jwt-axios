import axios from "axios";
import store from "../stores";
import {refreshToken,setAccessToken} from '../features/auth/authSlice'
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/v1/api/",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken || localStorage.getItem("accessToken");
  // add authorization header only for protected routes
  if (token && !["/register", "/login", "/token"].includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) =>{
    return response
  },
  async (error) => {
    console.log(error);
    const originalRequest = error.config;
    console.log(originalRequest._retry);
    if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        const state = store.getState();
        const token = state.auth.refreshToken || localStorage.getItem('refreshToken');
        console.log('After setting _retry:', originalRequest._retry);
        if (token) {
            const response = await store.dispatch(refreshToken({token}));
            console.log(response);
            if (response.payload.accessToken) {
                store.dispatch(setAccessToken(response.payload.accessToken));
                axios.defaults.headers.common.Authorization =  `Bearer ${response.payload.accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${response.payload.accessToken}`;
                return axiosInstance(originalRequest);
            }
        }
    }
    return Promise.reject(error);
});

export default axiosInstance;
