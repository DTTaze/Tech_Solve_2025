import axios from "./axios.customize";

const createUserApi = (data) => {
  return axios.post("api/auth/register", data);
};

const getUserApi = () => {
  return axios.get("api/users/me");
};

export const updateUserApi = async (id, data) => {
  return axios.put(`api/users/${id}`, data);
};

const loginUserApi = (data) => {
  return axios.post("api/auth/login", data);
};

const getAllUserApi = () => {
  return axios.get("api/users");
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

const getAllTasksApi = () => {
  return axios.get("api/tasks");
};

const getTaskByIdApi = (taskId) => {
  return axios.get(`api/tasks/${taskId}`);
};

const acceptTaskApi = (taskId, userId) => {
  return axios.post(`api/tasks/${taskId}/accept/${userId}`);
};

const completeTaskApi = (id) => {
  return axios.post(`api/tasks/complete/${id}`);
};

const receiveCoinApi = (coins) => {
  return axios.post("api/tasks/coin/receive", { coins });
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
const getAllTaskCompletedById = (id) => {
  return axios.get(`api/users/task/completed/${id}`);
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
  submitTaskApi,
  getAllTaskCompletedById,
  completeTaskApi,
};
