import axios from "./axios.customize";

export const loginUserApi = (data) => {
  return axios.post("api/auth/login", data);
};

export const createUserApi = (data) => {
  return axios.post("api/auth/register", data);
};

export const getUserApi = () => {
  return axios.get("api/users/me");
};

export const getAllUserApi = () => {
  return axios.get("api/users");
};

export const updateUserApi = (id, data) => {
  return axios.put(`api/users/${id}`, data);
};

export const deleteUserApi = (id) => {
  return axios.delete(`api/users/${id}`);
};

export const getAllRolesApi = () => {
  return axios.get("api/roles");
};

export const getAllPermissionsApi = () => {
  return axios.get("api/permissions");
};

// export const getAllRolesPermissionsApi = () => {
//   return axios.get("api/permissions");
// };

export const getAllVideosApi = () => {
  return axios.get("api/videos")
};

export const uploadUserAvatarApi = (user_id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axios.post(`api/avatars/upload/${user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUserAvatarByIdApi = (user_id) => {
  return axios.get(`api/avatars/${user_id}`);
};

export const getAllUserAvatarsApi = () => {
  return axios.get("api/avatars/");
};

export const updateUserAvatarApi = (user_id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axios.put(`api/avatars/${user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteUserAvatarApi = (user_id) => {
  return axios.delete(`api/avatars/${user_id}`);
};

export const getAllItemsApi = () => {
  return axios.get("api/items");
};

export const purchaseItemApi = (user_id, item_id, data) => {
  return axios.post(`api/items/purchase/${item_id}`, { user_id, ...data });
};

export const acceptTaskApi = (taskId, userId) => {
  return axios.post(`api/tasks/${taskId}/accept/${userId}`);
};

export const completeTaskApi = (id) => {
  return axios.post(`api/tasks/complete/${id}`);
};

export const getTaskByIdApi = (taskId) => {
  return axios.get(`api/tasks/${taskId}`);
};

export const getAllTasksApi = () => {
  return axios.get("api/tasks");
};

export const getAllTaskCompletedById = (id) => {
  return axios.get(`api/users/task/completed/${id}`);
};

export const receiveCoinApi = (coins) => {
  return axios.post("api/tasks/coin/receive", { coins });
};

export const submitTaskApi = (taskUserId, data) => {
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

export const getUserTransactionHistory = (user_id) => {
  return axios.get(`api/transactions/${user_id}`);
};
