import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
// import { notification } from "antd";
import { userColumns } from "./HeaderColumn";
import { Box, Typography } from "@mui/material";
import { getAllUserApi, deleteUserApi } from "../../utils/api";
export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAllUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllUserApi();
        if (res.success) {
          setUsers(res.data);
        } else {
          setError(res.error);
          console.log(res.error);
        }
      } catch (e) {
        setError(e);
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    getAllUsers();
  }, []);

  const handleAddUser = async () => {
    console.log("Add user");
  };

  const handleEditUser = (user) => {
    console.log("Edit user", user);
    // Will implement user edit form/modal
  };

  const handleDeleteUser = async (user) => {
    const res = await deleteUserApi(user.id);
    console.log(res);
    if (res.success) {
      notification.success({
        message: "Xóa người dùng thành công",
      });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Users Management
      </Typography>
      <DataTable
        title="Users"
        columns={userColumns}
        rows={users}
        onAdd={handleAddUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        loading={loading}
      />
    </Box>
  );
}
