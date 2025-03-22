import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./layouts/auth.context";
import axios from "./utils/axios.customize";
import { Spin } from "antd";
import Header from "./layouts/header_test";
import AdminHeader from "./layouts/adminHeader";
import UserHeader from "./layouts/userHeader";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        const res = await axios.get("/api/users/me");

        if (res && !res.message) {
          if (!res.avatar_url && res.id) {
            try {
              const avatarRes = await axios.get(`/api/avatars/${res.id}`);
              if (avatarRes && avatarRes.avatar_url) {
                res.avatar_url = avatarRes.avatar_url;
              }
            } catch (avatarErr) {
              console.error("Failed to fetch avatar:", avatarErr);
            }
          }
          setAuth({
            isAuthenticated: true,
            user: res,
          });
          if (res.avatar_url) {
            localStorage.setItem("user_avatar_url", res.avatar_url);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setAppLoading(false);
      }
    };

    fetchAccount();
  }, []);


  return (
    <div>
      {appLoading === true ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin></Spin>
        </div>
      ) : (
        <>
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;
