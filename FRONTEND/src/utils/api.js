import axios from "./axios.customize";

const createUserApi = (data) => {
  const URL_API = "api/auth/register";
  return axios.post(URL_API, data);
};

const getUserApi = () => {
  const URL_API = "api/users/me";
  return axios.get(URL_API);
};

export const updateUserApi = async (userId, userData) => {
  try {
    console.log("🚀 Gửi request PUT:", `/api/users/${userId}`, userData);
    const response = await axios.put(`/api/users/${userId}`, userData);
    console.log("📡 Phản hồi từ server:", response.data);
    return response;
  } catch (error) {
    console.error("❌ API lỗi:", error.response ? error.response.data : error.message);
    throw error;
  }
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

export {
  createUserApi,
  loginUserApi,
  getAllUserApi,
  updateUserAvatarApi,
  deleteUserAvatarApi,
  getAllUserAvatarsApi,
  getUserAvatarByIdApi,
  uploadUserAvatarApi,
  getUserApi
};
