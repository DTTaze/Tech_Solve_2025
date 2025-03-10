import axios from "./axios.customize";

const createUserApi = (username, email, password) => {
  const URL_API = "api/auth/register";
  const data = {
    username,
    email,
    password,
  };
  return axios.post(URL_API, data);
};
const loginUserApi = (email, password) => {
  const URL_API = "api/auth/login";
  const data = {
    email,
    password,
  };
  return axios.post(URL_API, data);
};
const getUserApi = () => {
  const URL_API = "api/users";
  return axios.get(URL_API);
};
export { createUserApi, loginUserApi, getUserApi };
