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
    const response = await axios.put(`api/users/${userId}`, userData);
    return response;
  } catch (error) {
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

export const getAllTaskCompletedById = (user_id) => {
  return axios.get(`api/users/task/completed/${user_id}`);
}

const getAllTasksApi = () => {
  return axios.get("api/tasks");
};

const getTaskByIdApi = (taskId) => {
  return axios.get(`api/tasks/${taskId}`);
};

const acceptTaskApi = (taskId, userId) => {
  return axios.post(`api/tasks/${taskId}/accept/${userId}`);
};

export const completeTaskApi = (taskId) => {
  return axios.post(`api/tasks/${taskId}/complete`);
};

const receiveCoinApi = (coins) => {
  return axios.post('api/tasks/receive-coin', { coins });
};

const submitTaskApi = (taskUserId, data) => {
  const formData = new FormData();
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.file) {
    formData.append("file", data.file);
  }
  
  return axios.post(`api/tasks/submit/${taskUserId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
  getUserApi,
  getAllTasksApi,
  getTaskByIdApi,
  acceptTaskApi,
  receiveCoinApi,
  submitTaskApi
};
