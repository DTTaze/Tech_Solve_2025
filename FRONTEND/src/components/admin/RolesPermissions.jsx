import React, { useState } from "react";
import DataTable from "./DataTable";
import {
  roleColumns,
  rolesData,
  permissionColumns,
  permissionsData,
} from "../../data/mock-data";
import { Box, Typography, Tabs, Tab } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`roles-permissions-tabpanel-${index}`}
      aria-labelledby={`roles-permissions-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function RolesPermissions() {
  const [roles, setRoles] = useState(rolesData);
  const [permissions, setPermissions] = useState(permissionsData);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleAddRole = () => {
    console.log("Add role");
    // Will implement role creation logic
  };

  const handleEditRole = (role) => {
    console.log("Edit role", role);
    // Will implement role edit logic
  };

  const handleDeleteRole = (role) => {
    console.log("Delete role", role);
    // Will implement role deletion logic
  };

  const handleAddPermission = () => {
    console.log("Add permission");
    // Will implement permission creation logic
  };

  const handleEditPermission = (permission) => {
    console.log("Edit permission", permission);
    // Will implement permission edit logic
  };

  const handleDeletePermission = (permission) => {
    console.log("Delete permission", permission);
    // Will implement permission deletion logic
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3, p: 2 }}>
        Roles & Permissions
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="roles and permissions tabs"
        >
          <Tab
            label="Roles"
            id="roles-permissions-tab-0"
            aria-controls="roles-permissions-tabpanel-0"
          />
          <Tab
            label="Permissions"
            id="roles-permissions-tab-1"
            aria-controls="roles-permissions-tabpanel-1"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <DataTable
          title="Roles"
          columns={roleColumns}
          rows={roles}
          onAdd={handleAddRole}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          loading={loading}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <DataTable
          title="Permissions"
          columns={permissionColumns}
          rows={permissions}
          onAdd={handleAddPermission}
          onEdit={handleEditPermission}
          onDelete={handleDeletePermission}
          loading={loading}
        />
      </TabPanel>
    </Box>
  );
}
