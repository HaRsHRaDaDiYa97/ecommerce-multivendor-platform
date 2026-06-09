import axios from "axios";

const privateApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👇 AUTO LOGOUT ON EXPIRED TOKEN
privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.location.href = "/login"; // or dispatch logout
    }
    return Promise.reject(error);
  }
);

export default privateApi;
