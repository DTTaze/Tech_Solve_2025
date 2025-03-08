import axios from "./axios.customize";

const createUserApi = (username, password, email) => {
  const URL_API = "user";
  const data = {
    username,
    email,
    password,
  };
  return axios.post(URL_API, data);
};
export { createUserApi };
