import React, { useEffect, useState } from "react";
import "../styles/pages/admin.css";
import TemporaryDrawer from "../components/admin/SidebarAdmin";
import AdminDashboard from "../components/admin/AdminDashboard";
import UsersManagement from "../components/admin/UsersManagement";
import RolesPermissions from "../components/admin/RolesPermissions";
import ContentManagement from "../components/admin/ContentManagement";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { getUserApi } from "../utils/api";

function Admin() {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const userResponse = await getUserApi();
        console.log("User data:", userResponse.data);

        if (userResponse?.data) {
          const dataOfUser = {
            id: userResponse.data.id,
            full_name: userResponse.data.full_name || "User",
            avatar_url: userResponse.data.avatar_url,
            username: userResponse.data.username || "Guest",
            role_id: userResponse.data.role_id || 0,
            email: userResponse.data.email,
            phone_number: userResponse.data.phone_number,
            last_logined: userResponse.data.last_logined,
          };
          console.log("data of user after fetch:", dataOfUser);
          setUserInfo(dataOfUser);
        } else {
          console.log("No user data found, setting default user info.");
          setUserInfo({
            id: 0,
            name: "Guest User",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <UsersManagement />;
      case "roles":
        return <RolesPermissions />;
      case "content":
        return <ContentManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  // Listen to sidebar navigation events
  React.useEffect(() => {
    const handleNavigation = (event) => {
      if (event.detail && event.detail.section) {
        setCurrentSection(event.detail.section.toLowerCase());
      }
    };

    window.addEventListener("admin-navigation", handleNavigation);

    return () => {
      window.removeEventListener("admin-navigation", handleNavigation);
    };
  }, []);

  return (
    <div className="admin-page admin-pages-container">
      {/* Header AppBar */}
      <AppBar
        position="static"
        color="white"
        elevation={0}
        sx={{ height: "64px", width: "250px", padding: "0px 10px" }}
      >
        <Toolbar sx={{ minHeight: "64px", padding: "0 16px" }}>
          <TemporaryDrawer userInfo={userInfo}/>
          <Typography
            variant="h4"
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Admin
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <div className="admin-content-container">{renderSection()}</div>
    </div>
  );
}

export default Admin;

