import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/auth.context";
import { notification, Spin } from "antd";
import Header from "./layouts/header_test";
import AdminHeader from "./layouts/AdminHeader";
import UserHeader from "./layouts/Header";
import { getUserApi } from "./utils/api";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        const res = await getUserApi();

        if (res && res.status === 200) {
          if (!res.data.avatar_url && res.data.id) {
            try {
              const avatarRes = await getUserAvatarByIdApi(res.data.id);
              if (avatarRes && avatarRes.avatar_url) {
                res.data.avatar_url = avatarRes.avatar_url;
              }
            } catch (avatarErr) {
              notification.error({
                message: "Lấy avatar không thành công",
                description:
                  avatarErr.error || "Đã xảy ra lỗi, vui lòng thử lại!",
              });
            }
          }
          setAuth({
            isAuthenticated: true,
            user: res.data,
          });
          if (res.data.avatar_url) {
            localStorage.setItem("user_avatar_url", res.data.avatar_url);
          }
        }
      } catch (err) {
        console.log(err);
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
          <UserHeader />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;
