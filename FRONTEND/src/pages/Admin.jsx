import React, { useEffect, useState } from "react";
import "../styles/pages/admin.css";
import TemporaryDrawer from "../components/admin/SidebarAdmin";
import { Outlet } from "react-router-dom";

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

  return (
    <div className="admin-page admin-pages-container">
      {/* Header AppBar */}
      <div className="flex justify-start items-center p-1.5">
        <div className="rounded-full bg-gray-100 w-10 h-10 flex justify-center items-center">
          <TemporaryDrawer userInfo={userInfo}/> 
        </div>
      </div>

      {/* Main content */}
      <div className="admin-content-container">
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;

