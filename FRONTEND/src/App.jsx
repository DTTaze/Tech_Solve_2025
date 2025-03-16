import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./components/layout/auth.context";
import axios from "./utils/axios.customize";
import { Spin } from "antd";
import Header from "./components/layout/header_test";
import AdminHeader from "./components/layout/adminHeader";
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
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;
