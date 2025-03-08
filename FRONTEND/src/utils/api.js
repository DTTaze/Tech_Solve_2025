import axios from "./axios.customize";

const createUserApi = (username,email, password) => {
  const URL_API = "api/auth/register";
  const data = {
    username,
    email,
    password,
  };
  return axios.post(URL_API, data);
};
export { createUserApi };
