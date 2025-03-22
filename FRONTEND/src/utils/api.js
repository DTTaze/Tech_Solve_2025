import axios from "./axios.customize";

const createUserApi = (data) => {
  const URL_API = "api/auth/register";
  return axios.post(URL_API, data);
};
const loginUserApi = (data) => {
  const URL_API = "api/auth/login";
  return axios.post(URL_API, data);
};
const getAllUserApi = () => {
  const URL_API = "api/users";
  return axios.get(URL_API);
};

const uploadUserAvatarApi = (user_id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axios.post(`api/avatars/upload/${user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const getAllUserAvatarsApi = () => {
  return axios.get("api/avatars/");
};
const getUserAvatarByIdApi = (user_id) => {
  return axios.get(`api/avatars/${user_id}`);
};
const updateUserAvatarApi = (user_id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axios.put(`api/avatars/${user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const deleteUserAvatarApi = (user_id) => {
  return axios.delete(`api/avatars/${user_id}`);
};
// const getUserByIdApi = () => {
//   const URL_API = "api/users/:id";
//   return axios.get(URL_API);
// };
export {
  createUserApi,
  loginUserApi,
  getAllUserApi,
  updateUserAvatarApi,
  deleteUserAvatarApi,
  getAllUserAvatarsApi,
  getUserAvatarByIdApi,
  uploadUserAvatarApi,
};
