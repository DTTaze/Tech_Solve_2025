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
      const res = await axios.get("/api/users/me");
      if (res && !res.message) {
        setAuth({
          isAuthenticated: true,
          user: {
            email: res.email,
            username: res.username,
          },
        });
      }
      setAppLoading(false);
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
          {/* <Header /> */}
          {/* <AdminHeader /> */}
          <UserHeader />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;
