import React, { useState } from "react";
import DataTable from "./data-table";
import { userColumns, usersData } from "../data/mock-data";
import { Box, Typography } from "@mui/material";

export default function UsersManagement() {
  const [users, setUsers] = useState(usersData);
  const [loading, setLoading] = useState(false);

  const handleAddUser = () => {
    console.log("Add user");
    // Will implement user creation form/modal
  };

  const handleEditUser = (user) => {
    console.log("Edit user", user);
    // Will implement user edit form/modal
  };

  const handleDeleteUser = (user) => {
    console.log("Delete user", user);
    // Will implement confirmation and deletion logic
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
