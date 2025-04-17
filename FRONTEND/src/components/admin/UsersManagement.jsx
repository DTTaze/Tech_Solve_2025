import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import { userColumns } from "./HeaderColumn";
import { Box, Typography } from "@mui/material";
import {
  getAllUserApi,
  deleteUserApi,
  createUserApi,
  updateUserApi,
} from "../../utils/api";
import UserForm from "../ui/form/UserForm";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");

  useEffect(() => {
    const fetchUsers = async () => {
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
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setFormMode("add");
    setEditData(null);
    setFormOpen(true);
  };

  const handleEditUser = (user) => {
    setFormMode("edit");
    setEditData(user);
    setFormOpen(true);
  };

  const handleDeleteUser = async (user) => {
    const res = await deleteUserApi(user.id);
    if (confirm("Bạn có chắc chắn muốn xóa không?")) {
      if (res.success) {
        alert("Xóa người dùng thành công!");
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      }
    }
  };

  const handleSubmitUser = async (data, mode) => {
    if (mode === "add") {
      try {
        const result = await createUserApi(data);
        if (result.success) {
          alert("Thêm người dùng thành công!");
        } else {
          alert("Thêm người dùng thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    } else if (mode === "edit") {
      try {
        const result = await updateUserApi(data.id, data);
        if (result.success) {
          alert("Cập nhật người dùng thành công!");
        } else {
          alert("Cập nhật người dùng thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    }
    setFormOpen(false);
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
      <UserForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitUser}
        initialData={editData}
        mode={formMode}
      />
    </Box>
  );
}
