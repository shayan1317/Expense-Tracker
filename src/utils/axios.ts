import axios from "axios";

const API = axios.create({
  baseURL: "expense-tracker-backend-snowy-rho.vercel.app/api",
});
// const API = axios.create({
//   baseURL: "http://localhost:3000/api",
// });
// ✅ Add auth token if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
