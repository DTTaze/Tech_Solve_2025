import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "../components/customer/CustomerDashboard";
import CustomerProfile from "../components/customer/CustomerProfile";
import CustomerOrders from "../components/customer/CustomerOrders";
import CustomerRewards from "../components/customer/CustomerRewards";
import CustomerDrawer from "../components/customer/layout/CustomerDrawer";
import CustomerAppBar from "../components/customer/layout/CustomerAppBar";
import "../styles/pages/customer.css";
import { getUserApi } from "../utils/api";

const drawerWidth = 240;

export default function Customer() {
  const [userInfo, setUserInfo] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const userResponse = await getUserApi();
        if (userResponse?.data) {
          setUserInfo({
            id: userResponse.data.id,
            full_name: userResponse.data.full_name || "Customer",
            avatar_url: userResponse.data.avatar_url,
            username: userResponse.data.username || "Guest",
            coins: userResponse.data.coins.amount || 0,
            email: userResponse.data.email,
            phone_number: userResponse.data.phone_number,
            last_logined: userResponse.data.last_logined,
          });
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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Bar */}
      <CustomerAppBar
        open={open}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
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
          p: 3,
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { sm: `${open ? drawerWidth : 0}px` },
          mt: "64px", // Height of AppBar
        }}
      >
        <Routes>
          <Route path="/" element={<CustomerDashboard context={userInfo} />} />
          <Route
            path="/profile"
            element={<CustomerProfile context={userInfo} />}
          />
          <Route
            path="/orders"
            element={<CustomerOrders context={userInfo} />}
          />
          <Route
            path="/rewards"
            element={<CustomerRewards context={userInfo} />}
          />
        </Routes>
      </Box>
    </Box>
  );
}
