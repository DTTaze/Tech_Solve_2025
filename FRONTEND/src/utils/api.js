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

export const getAllRolesPermissionsApi = () => {
  return axios.get("api/permissions");
};

export const getAllVideosApi = () => {
  return axios.get("api/videos");
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

export const acceptTaskApi = (task_id, user_id) => {
  return axios.post(`api/tasks/${task_id}/accept/${user_id}`);
};

export const completeTaskApi = (id) => {
  return axios.post(`api/tasks/complete/${id}`);
};

export const getTaskByIdApi = (task_id) => {
  return axios.get(`api/tasks/${task_id}`);
};

export const getAllTasksApi = () => {
  return axios.get("api/tasks");
};

export const getAllTaskCompletedById = (id) => {
  return axios.get(`api/users/task/completed/${id}`);
};

export const AllTaskByIdApi = (id) => {
  return axios.post(`api/users/task/all/${id}`);
};

export const receiveCoinApi = (coins) => {
  return axios.post("api/tasks/coin/receive", { coins });
};

export const submitTaskApi = (task_user_id, data) => {
  const formData = new FormData();
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.file) {
    formData.append("file", data.file);
  }

  return axios.post(`api/tasks/submit/${task_user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUserTransactionHistory = (user_id) => {
  return axios.get(`api/transactions/${user_id}`);
};

export const increaseProgressCountApi = (task_user_id) => {
  return axios.post(`api/tasks/progress/increase/${task_user_id}`);
};

export const deleteTaskApi = (id) => {
  return axios.delete(`api/tasks/${id}`);
};

export const createTaskApi = (data) => {
  return axios.post("api/tasks/upload", data);
};

export const updateTaskApi = (id, data) => {
  return axios.put(`api/tasks/${id}`, data);
};

export const deleteItemApi = (id) => {
  return axios.delete(`api/items/${id}`);
};

export const createItemApi = (item_id, data) => {
  return axios.post(`api/items/upload/${item_id}`, data);
};

export const updateItemApi = (item_id, data) => {
  return axios.put(`api/items/${item_id}`, data);
};

export const deleteRoleApi = (id) => {
  return axios.delete(`api/roles/${id}`);
};

export const createRoleApi = (data) => {
  return axios.post("api/roles/create", data);
};

export const updateRoleApi = (id, data) => {
  return axios.put(`api/roles/${id}`, data);
};

export const deletePermissionApi = (id) => {
  return axios.delete(`api/permissions/${id}`);
};

export const createPermissionApi = (data) => {
  return axios.post("api/permissions/create", data);
};

export const updatePermissionApi = (id, data) => {
  return axios.put(`api/permissions/${id}`, data);
};

export const deleteRolePermissionApi = (id) => {
  return axios.delete(`api/permissions/${id}`);
};

export const createRolePermissionApi = (data) => {
  return axios.post("api/permissions/create", data);
};

export const updateRolePermissionApi = (id, data) => {
  return axios.put(`api/permissions/${id}`, data);
};

export const acceptTaskByIdApi = (task_id, user_id) => {
  return axios.post(`api/tasks/accept/${user_id}/${task_id}`);
}