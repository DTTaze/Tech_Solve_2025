import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/auth.context";
import { notification, Spin } from "antd";
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
          setAuth({
            isAuthenticated: true,
            user: res.data,
          });
          if (res.data.avatar_url) {
            localStorage.setItem("user_avatar_url", res.data.avatar_url);
          }
        }
      } catch (err) {
        notification.error({
          message: "Lấy user không thành công",
          description: err.message || "Đã xảy ra lỗi, vui lòng thử lại!",
        });
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
