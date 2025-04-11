import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import {
  roleColumns,
  rolesPermissionsColumns,
  permissionColumns,
} from "./HeaderColumn";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { getAllRolesApi, getAllPermissionsApi } from "../../utils/api";
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
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rolesRes, permissionsRes] = await Promise.all([
          getAllRolesApi(),
          getAllPermissionsApi(),
          // getAllRolesPermissionsApi(),
        ]);

        if (rolesRes.success) {
          setRoles(rolesRes.data);
        } else {
          console.log(rolesRes.error);
        }

        if (permissionsRes.success) {
          setPermissions(permissionsRes.data);
        } else {
          console.log(permissionsRes.error);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <Tab
            label="Roles - Permissions"
            id="roles-permissions-tab-2"
            aria-controls="roles-permissions-tabpanel-2"
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

      <TabPanel value={tabValue} index={2}>
        <DataTable
          title="Roles - Permissions"
          columns={rolesPermissionsColumns}
          rows={roles}
          onAdd={handleAddPermission}
          onEdit={handleEditPermission}
          onDelete={handleDeletePermission}
          loading={loading}
        />
      </TabPanel>
    </Box>
  );
}
