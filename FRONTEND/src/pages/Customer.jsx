import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Routes, Route, Outlet } from "react-router-dom";
import CustomerDrawer from "../components/customer/layout/CustomerDrawer";
import CustomerAppBar from "../components/customer/layout/CustomerAppBar";
import "../styles/pages/customer.css";
import { getUserApi } from "../utils/api";

const drawerWidth = 240;

export default function Customer() {
  const [userInfo, setUserInfo] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getUserApi();
        if (userResponse?.data) {
          setUserInfo(userResponse.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        position: "relative", // Add position relative to establish a stacking context
      }}
    >
      {/* App Bar */}
      <CustomerAppBar
        open={open}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        userInfo={userInfo}
      />

      {/* Drawer */}
      <CustomerDrawer
        drawerWidth={drawerWidth}
        open={open}
        handleDrawerToggle={handleDrawerToggle}
        userInfo={userInfo}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: "100%",
          mt: "64px",
          backgroundColor: "var(--background-light)",
          position: "relative", // Add position relative
          zIndex: 1, // Set low z-index for main content
        }}
      >
        <Outlet context={userInfo} />
      </Box>
    </Box>
  );
}
